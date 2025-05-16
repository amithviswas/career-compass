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
import { Brain, Loader2 } from "lucide-react";

const profileGoalsSchema = z.object({
  resumeText: z.string().min(100, { message: "Resume text must be at least 100 characters." }).max(10000, { message: "Resume text must be less than 10000 characters." }),
  careerGoals: z.string().min(10, { message: "Career goals must be at least 10 characters." }).max(500, { message: "Career goals must be less than 500 characters." }),
});

type ProfileGoalsFormValues = z.infer<typeof profileGoalsSchema>;

interface ProfileGoalsFormProps {
  onSubmit: (values: ProfileGoalsFormValues) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<ProfileGoalsFormValues>;
}

export function ProfileGoalsForm({ onSubmit, isLoading, initialData }: ProfileGoalsFormProps) {
  const form = useForm<ProfileGoalsFormValues>({
    resolver: zodResolver(profileGoalsSchema),
    defaultValues: {
      resumeText: initialData?.resumeText || "",
      careerGoals: initialData?.careerGoals || "",
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Define Your Path</CardTitle>
        <CardDescription>
          Provide your resume details and career aspirations to generate your personalized roadmap.
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
                  <FormLabel className="text-lg">Your Resume</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your resume text here..."
                      className="min-h-[200px] resize-y text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please paste the full text of your resume.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="careerGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Your Career Goals</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Become a Senior Software Engineer in AI within 5 years."
                      className="text-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Clearly state your short-term and long-term career objectives.
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
                  <Brain className="mr-2 h-4 w-4" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
