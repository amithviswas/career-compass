
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
import { Loader2, Search, Sparkles } from "lucide-react";
import type { SoftSkillsAnalyzerInput } from "@/ai/flows/soft-skills-analyzer-flow";

const softSkillsFormSchema = z.object({
  inputText: z.string().min(100, { message: "Input text must be at least 100 characters." }).max(10000, { message: "Input text must be less than 10000 characters." }),
});

interface SoftSkillsInputFormProps {
  onSubmit: (values: SoftSkillsAnalyzerInput) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<SoftSkillsAnalyzerInput>;
}

export function SoftSkillsInputForm({ onSubmit, isLoading, initialData }: SoftSkillsInputFormProps) {
  const form = useForm<SoftSkillsAnalyzerInput>({
    resolver: zodResolver(softSkillsFormSchema),
    defaultValues: {
      inputText: initialData?.inputText || "",
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-6 w-6" />
            <CardTitle className="text-2xl">Analyze Your Strengths</CardTitle>
        </div>
        <CardDescription>
          Paste your resume text or detailed answers to behavioral questions below. The AI will analyze it to identify your soft skills and working style.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="inputText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Your Text for Analysis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your resume text, or detailed descriptions of your experiences and achievements..."
                      className="min-h-[250px] resize-y text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The more detailed your input, the better the analysis will be.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze My Soft Skills
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
