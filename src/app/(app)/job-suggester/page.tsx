
"use client";

import { useState } from "react";
import { JobSuggestionForm } from "@/components/job-suggester/JobSuggestionForm";
import { JobSuggestionDisplay } from "@/components/job-suggester/JobSuggestionDisplay";
import { suggestJobRoles } from "@/ai/flows/job-suggestion-flow";
import type { JobSuggestionOutput, JobSuggestionInput } from "@/ai/flows/job-suggestion-flow";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function JobSuggesterPage() {
  const [suggestionResult, setSuggestionResult] = useState<JobSuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (values: JobSuggestionInput) => {
    setIsLoading(true);
    setSuggestionResult(null); 

    try {
      toast({
        title: "Generating Job Suggestions...",
        description: "Analyzing your resume to find suitable roles. This may take a moment.",
      });
      const result = await suggestJobRoles(values);
      setSuggestionResult(result);
      toast({
        title: "Suggestions Ready!",
        description: "Your personalized job role suggestions are below.",
      });
    } catch (error: any) {
      console.error("Job suggestion generation failed:", error);
      setSuggestionResult(null);
      let errorMessage = "Could not generate job suggestions. Please try again.";
      if (error.message && error.message.includes("AI failed to generate job role suggestions")) {
        errorMessage = "The AI failed to generate suggestions. This might be due to the input or a temporary issue. Please try again or rephrase your input.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-2">Job Role Suggester</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Paste your resume to get AI-powered suggestions for suitable job roles and career paths.
      </p>
      
      <JobSuggestionForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="flex flex-col justify-center items-center my-12 space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Finding the best roles for you...</p>
        </div>
      )}

      {suggestionResult && !isLoading && (
        <>
          <Separator className="my-12" />
          <JobSuggestionDisplay result={suggestionResult} />
        </>
      )}
    </div>
  );
}
