"use client";
import { useState } from "react";
import { Button } from "@/components/Button";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const CodeEditor = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [review, setReview] = useState<{
    issues: string[];
    suggestions: string[];
    corrected_code: string;
  }>({
    issues: [],
    suggestions: [],
    corrected_code: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [language] = useState("javascript");




  const handleReview = async () => {
    setIsLoading(true);
    setReview({ issues: [], suggestions: [], corrected_code: "" });

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
    
      const data = await response.json();
      setReview(data);
    } catch (error: any) {
      setReview({ 
        issues: [`Error fetching review: ${error.message || "Unknown error"}`], 
        suggestions: [], 
        corrected_code: "" 
      });
    }
    
    setIsLoading(false);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">AI Code Review</h1>

      {/* Language Selector */}

      <div className="w-full max-w-5xl border rounded-lg overflow-hidden shadow-lg">
      <MonacoEditor
        height="50vh"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
        options={{ minimap: { enabled: false } }}
      />


      </div>

      <Button onClick={handleReview} className="mt-6 px-8 py-3 text-lg" disabled={isLoading}>
        {isLoading ? "Reviewing..." : "Review Code"}
      </Button>

      {/* Show Issues & Suggestions */}
      {review.issues.length > 0 && (
        <div className="mt-6 p-5 border rounded-lg w-full max-w-7xl bg-gray-800 text-white shadow-md">
          <h2 className="text-xl font-semibold mb-2">⚠️ Issues:</h2>
          <ul className="list-disc pl-5">
            {review.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {review.suggestions.length > 0 && (
        <div className="mt-6 p-5 border rounded-lg w-full max-w-7xl bg-gray-900 text-white shadow-md">
          <h2 className="text-xl font-semibold mb-2">💡 Suggestions:</h2>
          <ul className="list-disc pl-5">
            {review.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Show Corrected Code */}
      {review.corrected_code && (
        <div className="mt-6 w-full max-w-7xl border rounded-lg overflow-hidden shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-center">✅ Fixed Code:</h2>
          <MonacoEditor height="300px" language={language} value={review.corrected_code} theme="vs-dark" options={{ readOnly: true }} />
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
