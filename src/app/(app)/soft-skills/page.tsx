
"use client";

import { useState } from "react";
import { SoftSkillsInputForm } from "@/components/soft-skills/SoftSkillsInputForm";
import { SoftSkillsResultDisplay } from "@/components/soft-skills/SoftSkillsResultDisplay";
import { analyzeSoftSkillsAndPersonality } from "@/ai/flows/soft-skills-analyzer-flow";
import type { SoftSkillsAnalyzerOutput, SoftSkillsAnalyzerInput } from "@/ai/flows/soft-skills-analyzer-flow";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function SoftSkillsAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<SoftSkillsAnalyzerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (values: SoftSkillsAnalyzerInput) => {
    setIsLoading(true);
    setAnalysisResult(null); 

    try {
      toast({
        title: "Analyzing Soft Skills & Personality...",
        description: "This may take a moment.",
      });
      const result = await analyzeSoftSkillsAndPersonality(values);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete!",
        description: "Your soft skills and personality insights are ready.",
      });
    } catch (error: any) {
      console.error("Soft skills analysis failed:", error);
      setAnalysisResult(null);
      let errorMessage = "Could not generate your soft skills analysis. Please try again.";
      if (error.message && error.message.includes("AI failed to analyze")) {
        errorMessage = "The AI failed to perform the analysis. This might be due to the input or a temporary issue. Please try again or rephrase your input.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-2">Soft Skills & Personality Analysis</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Discover your key soft skills, understand your working style, and find suitable career paths.
      </p>
      
      <SoftSkillsInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="flex flex-col justify-center items-center my-12 space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Analyzing your input...</p>
        </div>
      )}

      {analysisResult && !isLoading && (
        <>
          <Separator className="my-12" />
          <SoftSkillsResultDisplay result={analysisResult} />
        </>
      )}
    </div>
  );
}
