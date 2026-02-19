"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getReviewHistory, deleteReviewFromHistory, clearReviewHistory, type ReviewHistoryItem } from "@/lib/history";
import { History, Trash2, X, Code2, Calendar, FileCode, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function HistoryPage() {
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewHistoryItem | null>(null);

  useEffect(() => {
    setHistory(getReviewHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteReviewFromHistory(id);
    setHistory(getReviewHistory());
    if (selectedReview?.id === id) {
      setSelectedReview(null);
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all review history?")) {
      clearReviewHistory();
      setHistory([]);
      setSelectedReview(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-surface-dark pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-gradient text-4xl font-bold mb-2 flex items-center gap-3">
              <History className="text-primary" />
              Review History
            </h1>
            <p className="text-text-secondary">
              View and manage your past code reviews
            </p>
          </div>
          {history.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear All
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="card text-center py-12">
            <History className="mx-auto text-text-secondary mb-4" size={48} />
            <h2 className="text-2xl font-semibold mb-2">No Review History</h2>
            <p className="text-text-secondary mb-6">
              Your code reviews will appear here once you start reviewing code.
            </p>
            <Link href="/review">
              <Button>Start Reviewing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* History List */}
            <div className={cn(
              "lg:col-span-5 space-y-4",
              selectedReview ? "hidden lg:block" : "block"
            )}>
              {history.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "card cursor-pointer transition-all hover:scale-[1.02] active:scale-95",
                    selectedReview?.id === item.id ? "ring-2 ring-primary bg-primary/5" : ""
                  )}
                  onClick={() => setSelectedReview(item)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileCode className="text-primary flex-shrink-0" size={18} />
                        <span className="font-semibold capitalize truncate">{item.language}</span>
                      </div>
                      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                        {item.code.substring(0, 100)}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-text-secondary">
                          <Calendar size={14} />
                          {formatDate(item.timestamp)}
                        </div>
                        <div className="flex items-center gap-3">
                          {item.review.issues.length > 0 && (
                            <span className="text-red-500 font-medium">
                              {item.review.issues.length} issue{item.review.issues.length > 1 ? "s" : ""}
                            </span>
                          )}
                          {item.review.suggestions.length > 0 && (
                            <span className="text-yellow-500 font-medium">
                              {item.review.suggestions.length} suggestion{item.review.suggestions.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-text-secondary hover:text-red-500 flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Review Details */}
            <div className={cn(
              "lg:col-span-7",
              selectedReview ? "block" : "hidden lg:block"
            )}>
              <div className="lg:sticky lg:top-28">
                {selectedReview ? (
                  <div className="card space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-border pb-4 -mx-2 px-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedReview(null)}
                          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-dark transition-colors"
                        >
                          <History size={18} />
                        </button>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <Code2 className="text-primary hidden sm:block" />
                          Review Details
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedReview(null)}
                        className="p-2 rounded-lg hover:bg-surface-dark transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Original Code</h3>
                          <span className="text-xs bg-surface-dark px-2 py-1 rounded border border-border">{selectedReview.language}</span>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-border bg-[#1e1e1e]">
                          <MonacoEditor
                            height="200px"
                            language={selectedReview.language}
                            value={selectedReview.code}
                            theme="vs-dark"
                            options={{
                              readOnly: true,
                              minimap: { enabled: false },
                              fontSize: 13,
                              lineNumbers: "on",
                              padding: { top: 12 },
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedReview.review.issues.length > 0 && (
                          <div className="card bg-red-500/5 border-red-500/20">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-500">
                              <AlertTriangle size={16} />
                              Issues ({selectedReview.review.issues.length})
                            </h3>
                            <ul className="space-y-2">
                              {selectedReview.review.issues.map((issue, index) => (
                                <li key={index} className="text-xs text-text-secondary flex items-start gap-2">
                                  <span className="text-red-500 mt-0.5">•</span>
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {selectedReview.review.suggestions.length > 0 && (
                          <div className="card bg-yellow-500/5 border-yellow-500/20">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-yellow-500">
                              <Lightbulb size={16} />
                              Suggestions ({selectedReview.review.suggestions.length})
                            </h3>
                            <ul className="space-y-2">
                              {selectedReview.review.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-xs text-text-secondary flex items-start gap-2">
                                  <span className="text-yellow-500 mt-0.5">•</span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {selectedReview.review.corrected_code && (
                        <div>
                          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-green-500">
                            <CheckCircle size={16} />
                            Improved Code
                          </h3>
                          <div className="rounded-xl overflow-hidden border border-border bg-[#1e1e1e]">
                            <MonacoEditor
                              height="250px"
                              language={selectedReview.language}
                              value={selectedReview.review.corrected_code}
                              theme="vs-dark"
                              options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                fontSize: 13,
                                lineNumbers: "on",
                                padding: { top: 12 },
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="card text-center py-20 hidden lg:block">
                    <FileCode className="mx-auto text-text-secondary/40 mb-4" size={64} />
                    <h3 className="text-xl font-medium mb-2">Select a Review</h3>
                    <p className="text-text-secondary max-w-xs mx-auto">
                      Pick a review from the history list to see the detailed AI feedback and improved code.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

