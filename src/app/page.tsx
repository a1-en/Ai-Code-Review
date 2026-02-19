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
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Sparkles className="text-primary flex-shrink-0" size={16} />
            <span className="text-xs sm:text-sm font-medium text-primary">Powered by OpenAI GPT-3.5 Turbo</span>
          </div>

          <h1 className="heading-gradient text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in tracking-tight">
            AI-Powered Code Review
          </h1>

          <p className="text-text-secondary text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 animate-fade-in leading-relaxed">
            Get instant, intelligent feedback on your code. Improve code quality, catch bugs early, and learn best practices with our advanced AI code review system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center animate-fade-in px-4 sm:px-0">
            <Link href="/review" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-lg px-8 py-7 shadow-xl shadow-primary/20">
                Start Reviewing Code
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/history" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full text-lg px-8 py-7">
                View History
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-8 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 tracking-tight">
            Why Choose Our Code Review Tool?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card group animate-slide-up hover:scale-105 transition-all duration-300 bg-surface/50 backdrop-blur-sm border-border/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon className="text-primary group-hover:text-white" size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                      <p className="text-text-secondary leading-relaxed text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="card text-center py-12 sm:py-16 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles size={120} className="text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
              Ready to Improve Your Code?
            </h2>
            <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Start using our AI-powered code review tool today and take your code quality to the next level.
            </p>
            <Link href="/review">
              <Button size="lg" className="text-lg px-10 py-7 shadow-xl shadow-primary/20">
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
