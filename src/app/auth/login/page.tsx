"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { signIn } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await signIn(values.email, values.password);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed", error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <AuthForm isLogin onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
