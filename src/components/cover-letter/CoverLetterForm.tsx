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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import type { GenerateCoverLetterInput } from "@/ai/flows/cover-letter-generator-flow";

const coverLetterFormSchema = z.object({
  resumeText: z.string().min(100, { message: "Resume text must be at least 100 characters." }).max(10000, { message: "Resume text must be less than 10000 characters." }),
  jobDetails: z.string().min(10, { message: "Job details must be at least 10 characters." }).max(1000, { message: "Job details must be less than 1000 characters." }),
  userFullName: z.string().min(2, { message: "Your full name must be at least 2 characters." }).max(100),
  hiringManagerName: z.string().max(100).optional(),
  companyName: z.string().min(1, { message: "Company name is required." }).max(100),
});

interface CoverLetterFormProps {
  onSubmit: (values: GenerateCoverLetterInput) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<GenerateCoverLetterInput>;
}

export function CoverLetterForm({ onSubmit, isLoading, initialData }: CoverLetterFormProps) {
  const form = useForm<GenerateCoverLetterInput>({
    resolver: zodResolver(coverLetterFormSchema),
    defaultValues: {
      resumeText: initialData?.resumeText || "",
      jobDetails: initialData?.jobDetails || "",
      userFullName: initialData?.userFullName || "",
      hiringManagerName: initialData?.hiringManagerName || "",
      companyName: initialData?.companyName || "",
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Generate Your Cover Letter</CardTitle>
        <CardDescription>
          Provide your resume, job details, and a few personal touches to create a compelling cover letter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="userFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Your Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Acme Corp" {...field} />
                  </FormControl>
                  <FormDescription>The company you are applying to.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hiringManagerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Hiring Manager's Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mr. John Smith or Ms. Ada Lovelace" {...field} />
                  </FormControl>
                  <FormDescription>If known, include their title (e.g., Mr., Ms., Dr.).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Job Title or Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the job title, a short job description, or key responsibilities here..."
                      className="min-h-[100px] resize-y text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide enough detail for the AI to tailor the letter effectively.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    The AI will use this to highlight your relevant skills and experiences.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Letter...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
