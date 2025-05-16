
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlayCircle } from "lucide-react";

const setupFormSchema = z.object({
  targetJobRole: z.string().min(5, { message: "Target job role must be at least 5 characters." }).max(200, { message: "Target job role must be less than 200 characters." }),
});

type SetupFormValues = z.infer<typeof setupFormSchema>;

interface MockInterviewSetupProps {
  onSubmit: (values: SetupFormValues) => Promise<void>;
  isLoading: boolean;
}

export function MockInterviewSetup({ onSubmit, isLoading }: MockInterviewSetupProps) {
  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      targetJobRole: "",
    },
  });

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Mock Interview Setup</CardTitle>
        <CardDescription>
          Enter the job role you want to practice for. We'll generate relevant questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="targetJobRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Target Job Role & Company (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer at Google, Product Manager" {...field} />
                  </FormControl>
                  <FormDescription>Be specific for tailored questions.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Interview...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Mock Interview
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
