
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, Loader2 } from "lucide-react";
import type { JobMatchAnalyzerInput } from "@/ai/flows/job-match-analyzer-flow";
import { JobMatchAnalyzerInputSchema } from "@/ai/flows/job-match-analyzer-flow";


interface JobMatchFormProps {
  onSubmit: (values: JobMatchAnalyzerInput) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<JobMatchAnalyzerInput>;
}

export function JobMatchForm({ onSubmit, isLoading, initialData }: JobMatchFormProps) {
  const form = useForm<JobMatchAnalyzerInput>({
    resolver: zodResolver(JobMatchAnalyzerInputSchema),
    defaultValues: {
      resumeText: initialData?.resumeText || "",
      targetJobTitleAndCompany: initialData?.targetJobTitleAndCompany || "",
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Analyze Resume to Job Match</CardTitle>
        <CardDescription>
          Paste your resume and specify the target job title and company to see how well you match.
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
                      className="min-h-[200px] resize-y text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ensure you paste the complete text for an accurate analysis.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetJobTitleAndCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Target Job Title & Company</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Software Engineer at Google, Product Manager at Microsoft"
                      className="text-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific for the most relevant analysis (e.g., "Senior Data Analyst at Netflix").
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Match...
                </>
              ) : (
                <>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Analyze Resume Match
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
