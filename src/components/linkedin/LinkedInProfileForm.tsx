
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod"; // Import Zod
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
import { Linkedin, Loader2, Sparkles } from "lucide-react";
// Removed import of LinkedInOptimizerInputSchema from flow
import type { LinkedInOptimizerInput } from "@/ai/flows/linkedin-optimizer-flow";

// Define the schema locally for client-side validation
const linkedInOptimizerFormSchema = z.object({
  currentHeadline: z.string().max(220, {message: "Headline must be less than 220 characters."}).optional().or(z.literal("")),
  currentAboutSection: z.string().max(2600, {message: "About section must be less than 2600 characters."}).optional().or(z.literal("")),
  currentExperience: z.string().max(5000, {message: "Experience summary must be less than 5000 characters."}).optional().or(z.literal("")),
  currentSkills: z.string().max(1000, {message: "Skills list must be less than 1000 characters."}).optional().or(z.literal("")),
  careerGoal: z.string().min(5, { message: "Career goal must be at least 5 characters." }).max(200, { message: "Career goal must be less than 200 characters." }),
});


interface LinkedInProfileFormProps {
  onSubmit: (values: LinkedInOptimizerInput) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<LinkedInOptimizerInput>;
}

export function LinkedInProfileForm({ onSubmit, isLoading, initialData }: LinkedInProfileFormProps) {
  const form = useForm<LinkedInOptimizerInput>({
    resolver: zodResolver(linkedInOptimizerFormSchema), // Use the local schema
    defaultValues: {
      currentHeadline: initialData?.currentHeadline || "",
      currentAboutSection: initialData?.currentAboutSection || "",
      currentExperience: initialData?.currentExperience || "",
      currentSkills: initialData?.currentSkills || "",
      careerGoal: initialData?.careerGoal || "",
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
            <Linkedin className="h-6 w-6" />
            <CardTitle className="text-2xl">Optimize Your LinkedIn Profile</CardTitle>
        </div>
        <CardDescription>
          Provide your current LinkedIn details and career goal to get AI-powered suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="careerGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Target Career Goal / Job Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior Software Engineer at Google" {...field} />
                  </FormControl>
                  <FormDescription>What role or career path are you aiming for?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentHeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Current LinkedIn Headline (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Developer | Java, Python, Cloud" {...field} />
                  </FormControl>
                   <FormDescription>Max 220 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentAboutSection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Current 'About' Section (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your current LinkedIn 'About' section here..."
                      className="min-h-[150px] resize-y text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Max 2600 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Current Experience Section (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste key details from your LinkedIn 'Experience' section (e.g., job titles, main responsibilities, achievements)..."
                      className="min-h-[150px] resize-y text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Summarize or paste relevant parts. Max 5000 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Current Skills (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Java, Python, Project Management, Agile" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of your top skills. Max 1000 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Optimize My Profile
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

