"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";
import { LogOut, UserCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function AppHeader() {
  const { user, signOut } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

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
      <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-primary">
        <Briefcase className="h-7 w-7" />
        <span>CareerCompass</span>
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
