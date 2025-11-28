import CodeEditor from "@/components/CodeEditor";

export default function ReviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-surface-dark pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="heading-gradient text-4xl font-bold mb-4">
            Code Review
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Paste your code below and get instant AI-powered feedback.
          </p>
        </div>
        <CodeEditor />
      </div>
    </main>
  );
}

