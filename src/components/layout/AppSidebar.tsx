
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Briefcase, ClipboardCheck, FileText } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/job-match", label: "Job Match Analyzer", icon: ClipboardCheck },
  { href: "/cover-letter", label: "Cover Letter Generator", icon: FileText },
  { href: "/chatbot", label: "AI Chatbot", icon: MessageSquare },
  // Add more items like Profile/Settings if needed
  // { href: "/profile", label: "Profile", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-[var(--sidebar-width)] bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed h-full">
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border ">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground">
          <Briefcase className="h-7 w-7 text-sidebar-primary" />
          <span>CareerCompass</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn(
              "w-full justify-start text-base",
              pathname === item.href
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href={item.href}>
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      {/* Optional Footer */}
      {/* <div className="mt-auto p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/70 text-center">&copy; {new Date().getFullYear()} CareerCompass</p>
      </div> */}
    </aside>
  );
}
