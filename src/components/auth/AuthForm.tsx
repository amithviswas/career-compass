"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormValues = z.infer<typeof formSchema>;

interface AuthFormProps extends HTMLAttributes<HTMLDivElement> {
  isLogin?: boolean;
  onSubmit: (values: AuthFormValues) => Promise<void>;
  loading: boolean;
}

export function AuthForm({ isLogin = false, onSubmit, loading, className, ...props }: AuthFormProps) {
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className={className} {...props}>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{isLogin ? "Login to CareerCompass" : "Create your Account"}</CardTitle>
          <CardDescription>
            {isLogin ? "Welcome back! Please enter your details." : "Start your journey with CareerCompass."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <Button variant="link" asChild className="p-0 text-accent">
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button variant="link" asChild className="p-0 text-accent">
                  <Link href="/auth/login">Login</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
