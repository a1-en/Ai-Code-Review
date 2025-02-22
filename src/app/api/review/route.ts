import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();
    if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // AI Prompt enforcing JSON response
    const prompt = `
      Analyze the following ${language} code and return feedback in strict JSON format (do NOT wrap it in a code block).
      {
        "issues": ["List of detected issues"],
        "suggestions": ["Possible improvements"],
        "corrected_code": "Fully improved code"
      }

      Code:
      \`\`\`${language}
      ${code}
      \`\`\`
    `;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";


    // Remove markdown-style code block if present
    rawText = rawText.replace(/```json|```/g, "").trim();

    let structuredFeedback = { issues: [], suggestions: [], corrected_code: "" };

    try {
      structuredFeedback = JSON.parse(rawText);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
    }

    return NextResponse.json(structuredFeedback);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}
