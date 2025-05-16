
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
    LayoutDashboard, 
    MessageSquare, 
    Briefcase, 
    FileText, 
    Linkedin, 
    Mic, 
    HeartHandshake, 
    Lightbulb, 
    FileEdit,
    Github,
    Instagram
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/job-suggester", label: "Job Role Suggester", icon: Lightbulb },
  { href: "/resume-rewriter", label: "ATS Resume Maker", icon: FileEdit },
  { href: "/cover-letter", label: "Cover Letter Generator", icon: FileText },
  { href: "/linkedin-optimizer", label: "LinkedIn Optimizer", icon: Linkedin },
  { href: "/mock-interview", label: "Mock Interview", icon: Mic },
  { href: "/soft-skills", label: "Soft Skills Analysis", icon: HeartHandshake },
  { href: "/chatbot", label: "AI Chatbot", icon: MessageSquare },
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/amithviswas", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/amith-viswas-reddy/", icon: Linkedin },
  { name: "Instagram", href: "https://www.instagram.com/amithviswas_reddy/", icon: Instagram },
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
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
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
      {/* Social Icons for Desktop Sidebar */}
      <div className="mt-auto border-t border-sidebar-border p-4">
        <TooltipProvider>
          <div className="flex justify-around items-center">
            {socialLinks.map((social) => (
              <Tooltip key={social.name}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <Link href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                      <social.icon className="h-5 w-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover text-popover-foreground">
                  <p>{social.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </aside>
  );
}
