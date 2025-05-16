"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  LogOut, 
  UserCircle, 
  Briefcase, 
  Menu, 
  X,
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Linkedin, 
  Mic, 
  HeartHandshake, 
  Lightbulb,
  FileEdit
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

export function AppHeader() {
  const { user, signOut } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/auth/login");
    } catch (error) {
      console.error("Sign out failed", error);
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 shadow-sm backdrop-blur-md sm:px-6">
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:w-80 bg-sidebar text-sidebar-foreground p-0">
            <div className="flex items-center justify-between h-16 border-b border-sidebar-border px-4">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Briefcase className="h-7 w-7 text-sidebar-primary" />
                <span>CareerCompass</span>
              </Link>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </SheetClose>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-base py-3", // Increased padding for better touch targets
                    pathname === item.href
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={item.href} className="flex items-center w-full">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Logo/Title */}
        <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-lg font-semibold text-primary">
          <Briefcase className="h-7 w-7" />
          <span>CareerCompass</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {user && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <UserCircle className="h-5 w-5" />
            <span>{user.displayName || user.email}</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Log out">
          <LogOut className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </header>
  );
}
