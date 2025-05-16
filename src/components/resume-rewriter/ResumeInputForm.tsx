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
import { Loader2, Wand2 } from "lucide-react";
import type { RewriteResumeInput } from "@/ai/flows/resume-rewriter-flow";

const resumeInputFormSchema = z.object({
  rawResumeText: z.string().min(100, { message: "Resume text must be at least 100 characters." }).max(15000, { message: "Resume text must be less than 15000 characters." }),
});

interface ResumeInputFormProps {
  onSubmit: (values: RewriteResumeInput) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<RewriteResumeInput>;
}

export function ResumeInputForm({ onSubmit, isLoading, initialData }: ResumeInputFormProps) {
  const form = useForm<RewriteResumeInput>({
    resolver: zodResolver(resumeInputFormSchema),
    defaultValues: {
      rawResumeText: initialData?.rawResumeText || "",
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
            <Wand2 className="h-6 w-6" />
            <CardTitle className="text-2xl">Input Your Resume Text</CardTitle>
        </div>
        <CardDescription>
          Paste your current resume text below. The AI will rewrite and reformat it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="rawResumeText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Raw Resume Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your entire resume content here..."
                      className="min-h-[250px] resize-y text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The more complete your pasted text, the better the AI can assist.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rewriting...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Rewrite My Resume
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
