
"use client";

import { useState } from "react";
import { LinkedInProfileForm } from "@/components/linkedin/LinkedInProfileForm";
import { LinkedInOptimizationDisplay } from "@/components/linkedin/LinkedInOptimizationDisplay";
import { optimizeLinkedInProfile } from "@/ai/flows/linkedin-optimizer-flow";
import type { LinkedInOptimizerOutput, LinkedInOptimizerInput } from "@/ai/flows/linkedin-optimizer-flow";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function LinkedInOptimizerPage() {
  const [optimizationResult, setOptimizationResult] = useState<LinkedInOptimizerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (values: LinkedInOptimizerInput) => {
    setIsLoading(true);
    setOptimizationResult(null); 

    try {
      toast({
        title: "Optimizing LinkedIn Profile...",
        description: "Analyzing your profile data and generating suggestions. This may take a moment.",
      });
      const result = await optimizeLinkedInProfile(values);
      setOptimizationResult(result);
      toast({
        title: "Optimization Complete!",
        description: "Your LinkedIn profile suggestions are ready below.",
      });
    } catch (error: any) {
      console.error("LinkedIn optimization failed:", error);
      setOptimizationResult(null);
      let errorMessage = "Could not generate LinkedIn profile suggestions. Please try again.";
      if (error.message && error.message.includes("Failed to generate LinkedIn profile optimization suggestions from AI")) {
        errorMessage = "The AI failed to generate suggestions. This might be due to the input or a temporary issue. Please try again or rephrase your input.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Optimization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-2">LinkedIn Profile Optimizer</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Enhance your LinkedIn presence to attract opportunities and align with your career goals.
      </p>
      
      <LinkedInProfileForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="flex flex-col justify-center items-center my-12 space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Generating your profile enhancements...</p>
        </div>
      )}

      {optimizationResult && !isLoading && (
        <>
          <Separator className="my-12" />
          <LinkedInOptimizationDisplay result={optimizationResult} />
        </>
      )}
    </div>
  );
}
