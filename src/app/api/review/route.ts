import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();
    if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const openaiUrl = "https://api.openai.com/v1/chat/completions";

    // AI Prompt enforcing JSON response
    const prompt = `Analyze the following ${language} code and return feedback in strict JSON format (do NOT wrap it in a code block).
{
  "issues": ["List of detected issues"],
  "suggestions": ["Possible improvements"],
  "corrected_code": "Fully improved code"
}

Code:
\`\`\`${language}
${code}
\`\`\``;

    const response = await fetch(openaiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a code review assistant. Always respond with valid JSON only, no markdown code blocks.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get AI response", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    let rawText = data?.choices?.[0]?.message?.content || "";

    // Remove markdown-style code block if present
    rawText = rawText.replace(/```json|```/g, "").trim();

    let structuredFeedback = { issues: [], suggestions: [], corrected_code: "" };

    try {
      structuredFeedback = JSON.parse(rawText);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.error("Raw response:", rawText);
    }

    return NextResponse.json(structuredFeedback);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}
