"use client";
import { useState } from "react";
import { Button } from "@/components/Button";
import dynamic from "next/dynamic";
import { Code2, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";

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
  const [language, setLanguage] = useState("javascript");

  const handleReview = async () => {
    if (!code.trim()) {
      setReview({
        issues: ["Code editor is empty. Please write a code to review."],
        suggestions: [],
        corrected_code: "",
      });
      return;
    }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setReview({
          issues: [`Error fetching review: ${error.message}`],
          suggestions: [],
          corrected_code: "",
        });
      } else {
        setReview({
          issues: ["An unknown error occurred"],
          suggestions: [],
          corrected_code: "",
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="card animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code2 className="text-primary" />
            <h2 className="text-lg font-semibold">Code Editor</h2>
          </div>
          <select
            className="px-4 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="php">PHP</option>
          </select>
        </div>
        
        <div className="rounded-lg overflow-hidden border border-border">
          <MonacoEditor
            height="50vh"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleReview}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center gap-2 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Reviewing..." : "Review Code"}
          </Button>
        </div>
      </div>

      {review.issues.length > 0 && (
        <div className="card animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" />
            <h2 className="text-lg font-semibold">Issues Found</h2>
          </div>
          <ul className="space-y-2">
            {review.issues.map((issue, index) => (
              <li key={index} className="flex items-start gap-2 text-text-secondary">
                <span className="text-red-500">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {review.suggestions.length > 0 && (
        <div className="card animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-yellow-500" />
            <h2 className="text-lg font-semibold">Suggestions</h2>
          </div>
          <ul className="space-y-2">
            {review.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-text-secondary">
                <span className="text-yellow-500">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {review.corrected_code && (
        <div className="card animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-500" />
            <h2 className="text-lg font-semibold">Improved Code</h2>
          </div>
          <div className="rounded-lg overflow-hidden border border-border">
            <MonacoEditor
              height="300px"
              language={language}
              value={review.corrected_code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
