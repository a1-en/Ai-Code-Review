"use client";
import { useState } from "react";
import { Button } from "@/components/Button";
import dynamic from "next/dynamic";
import { Code2, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";
import { saveReviewToHistory } from "@/lib/history";

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

      // Save to history
      if (data && (data.issues?.length > 0 || data.suggestions?.length > 0 || data.corrected_code)) {
        saveReviewToHistory(code, language, data);
      }
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
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="card animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Code2 className="text-primary" size={20} />
            </div>
            <h2 className="text-lg font-semibold">Code Editor</h2>
          </div>
          <select
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
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

        <div className="rounded-xl overflow-hidden border border-border bg-[#1e1e1e]">
          <MonacoEditor
            height="min(60vh, 500px)"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
            }}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleReview}
            className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Reviewing...
              </>
            ) : (
              <>
                <Code2 size={20} />
                Review Code
              </>
            )}
          </Button>
        </div>
      </div>

      {(review.issues.length > 0 || review.suggestions.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {review.issues.length > 0 && (
            <div className="card border-red-500/20 bg-red-500/5 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-red-500" size={20} />
                <h2 className="text-lg font-semibold text-red-500">Issues Found</h2>
              </div>
              <ul className="space-y-3">
                {review.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.suggestions.length > 0 && (
            <div className="card border-yellow-500/20 bg-yellow-500/5 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-yellow-500" size={20} />
                <h2 className="text-lg font-semibold text-yellow-500">Suggestions</h2>
              </div>
              <ul className="space-y-3">
                {review.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {review.corrected_code && (
        <div className="card border-green-500/20 bg-green-500/5 animate-slide-up">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="text-green-500" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-green-500">Improved Code</h2>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border bg-[#1e1e1e]">
            <MonacoEditor
              height="min(40vh, 400px)"
              language={language}
              value={review.corrected_code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
