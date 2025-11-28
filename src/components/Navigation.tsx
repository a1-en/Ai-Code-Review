"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, History, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/review", label: "Review Code", icon: Code2 },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-effect mx-4 mt-4 rounded-full px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="heading-gradient text-xl font-bold">AI Code Review</span>
          </Link>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-primary hover:bg-surface"
                  )}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

