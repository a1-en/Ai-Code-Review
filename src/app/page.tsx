import Link from "next/link";
import { Button } from "@/components/Button";
import { Code2, Zap, Shield, History, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "Instant Reviews",
      description: "Get AI-powered code reviews in seconds, not minutes.",
    },
    {
      icon: Shield,
      title: "Comprehensive Analysis",
      description: "Detect issues, get suggestions, and see improved code versions.",
    },
    {
      icon: Code2,
      title: "Multi-Language Support",
      description: "Supports JavaScript, TypeScript, Python, Java, C++, Ruby, Go, and PHP.",
    },
    {
      icon: History,
      title: "Review History",
      description: "Save and revisit your past code reviews anytime.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-surface-dark">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="text-primary" size={16} />
            <span className="text-sm text-primary">Powered by OpenAI GPT-3.5 Turbo</span>
          </div>
          
          <h1 className="heading-gradient text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            AI-Powered Code Review
          </h1>
          
          <p className="text-text-secondary text-xl md:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in">
            Get instant, intelligent feedback on your code. Improve code quality, catch bugs early, and learn best practices with our advanced AI code review system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Link href="/review">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Reviewing Code
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View History
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Our Code Review Tool?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card animate-slide-up hover:scale-105 transition-transform"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-text-secondary">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="card text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Improve Your Code?
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Start using our AI-powered code review tool today and take your code quality to the next level.
            </p>
            <Link href="/review">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Now
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
