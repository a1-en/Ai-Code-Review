import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-surface-dark py-12 px-4">
      <div className="container mx-auto max-w-7xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="heading-gradient text-4xl font-bold mb-4">
            AI-Powered Code Review
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Get instant feedback on your code with our advanced AI code review system.
            Write, analyze, and improve your code in real-time.
          </p>
        </div>
      <CodeEditor />
      </div>
    </main>
  );
}
