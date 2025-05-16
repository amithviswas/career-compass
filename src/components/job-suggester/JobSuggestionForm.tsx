
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb } from "lucide-react";
import type { JobSuggestionInput } from "@/ai/flows/job-suggestion-flow";

const jobSuggestionFormSchema = z.object({
  resumeText: z.string().min(100, { message: "Resume text must be at least 100 characters." }).max(10000, { message: "Resume text must be less than 10000 characters." }),
});

interface JobSuggestionFormProps {
  onSubmit: (values: JobSuggestionInput) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<JobSuggestionInput>;
}

export function JobSuggestionForm({ onSubmit, isLoading, initialData }: JobSuggestionFormProps) {
  const form = useForm<JobSuggestionInput>({
    resolver: zodResolver(jobSuggestionFormSchema),
    defaultValues: {
      resumeText: initialData?.resumeText || "",
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
            <Lightbulb className="h-6 w-6" />
            <CardTitle className="text-2xl">Discover Your Potential Roles</CardTitle>
        </div>
        <CardDescription>
          Paste your resume text below. The AI will analyze it to suggest suitable job roles and career paths for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="resumeText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Your Resume Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the full text of your resume here..."
                      className="min-h-[250px] resize-y text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The more detailed your resume text, the more accurate the job suggestions will be.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Suggest Job Roles
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
