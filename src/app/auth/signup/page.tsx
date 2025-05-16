"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const { signUp } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await signUp(values.email, values.password);
      toast({ title: "Signup Successful", description: "Welcome to CareerCompass!" });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signup failed", error);
      toast({
        title: "Signup Failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
      <AuthForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
