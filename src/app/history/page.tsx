"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getReviewHistory, deleteReviewFromHistory, clearReviewHistory, type ReviewHistoryItem } from "@/lib/history";
import { History, Trash2, X, Code2, Calendar, FileCode, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";
import { Button } from "@/components/Button";
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* History List */}
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`card cursor-pointer transition-all hover:scale-105 ${
                    selectedReview?.id === item.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedReview(item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileCode className="text-primary" size={18} />
                        <span className="font-semibold capitalize">{item.language}</span>
                      </div>
                      <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                        {item.code.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar size={14} />
                        {formatDate(item.timestamp)}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        {item.review.issues.length > 0 && (
                          <span className="text-red-500">
                            {item.review.issues.length} issue{item.review.issues.length > 1 ? "s" : ""}
                          </span>
                        )}
                        {item.review.suggestions.length > 0 && (
                          <span className="text-yellow-500">
                            {item.review.suggestions.length} suggestion{item.review.suggestions.length > 1 ? "s" : ""}
                          </span>
                        )}
                        {item.review.corrected_code && (
                          <span className="text-green-500">Fixed code</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-2 rounded-lg hover:bg-surface-dark transition-colors text-text-secondary hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Review Details */}
            <div className="lg:sticky lg:top-24">
              {selectedReview ? (
                <div className="card space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Code2 className="text-primary" />
                      Review Details
                    </h2>
                    <button
                      onClick={() => setSelectedReview(null)}
                      className="p-2 rounded-lg hover:bg-surface-dark transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-text-secondary">Original Code</h3>
                    <div className="rounded-lg overflow-hidden border border-border">
                      <MonacoEditor
                        height="200px"
                        language={selectedReview.language}
                        value={selectedReview.code}
                        theme="vs-dark"
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                        }}
                      />
                    </div>
                  </div>

                  {selectedReview.review.issues.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={16} />
                        Issues ({selectedReview.review.issues.length})
                      </h3>
                      <ul className="space-y-1">
                        {selectedReview.review.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedReview.review.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="text-yellow-500" size={16} />
                        Suggestions ({selectedReview.review.suggestions.length})
                      </h3>
                      <ul className="space-y-1">
                        {selectedReview.review.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                            <span className="text-yellow-500">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedReview.review.corrected_code && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="text-green-500" size={16} />
                        Improved Code
                      </h3>
                      <div className="rounded-lg overflow-hidden border border-border">
                        <MonacoEditor
                          height="250px"
                          language={selectedReview.language}
                          value={selectedReview.review.corrected_code}
                          theme="vs-dark"
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card text-center py-12">
                  <FileCode className="mx-auto text-text-secondary mb-4" size={48} />
                  <p className="text-text-secondary">
                    Select a review from the list to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

