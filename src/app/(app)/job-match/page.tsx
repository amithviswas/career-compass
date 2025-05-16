
"use client";

import { useState } from "react";
import { JobMatchForm } from "@/components/job-match/JobMatchForm";
import { JobMatchResultDisplay } from "@/components/job-match/JobMatchResultDisplay";
import { analyzeJobMatch } from "@/ai/flows/job-match-analyzer-flow";
import type { JobMatchAnalyzerOutput, JobMatchAnalyzerInput } from "@/ai/flows/job-match-analyzer-flow";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function JobMatchAnalyzerPage() {
  const [analysisResult, setAnalysisResult] = useState<JobMatchAnalyzerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (values: JobMatchAnalyzerInput) => {
    setIsLoading(true);
    setAnalysisResult(null); 

    try {
      toast({
        title: "Starting Job Match Analysis...",
        description: "Comparing your resume to the target job. This may take a moment.",
      });
      const result = await analyzeJobMatch(values);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete!",
        description: "Your job match report has been generated.",
      });
    } catch (error: any) {
      console.error("Job match analysis failed:", error);
      setAnalysisResult(null);
      let errorMessage = "Could not generate your job match report. Please try again.";
      if (error.message && error.message.includes("Failed to get analysis from AI")) {
        errorMessage = "The AI failed to generate an analysis. This might be due to the input or a temporary issue. Please try again or rephrase your input.";
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
      <h1 className="text-3xl font-bold text-primary mb-2">Job Match Analyzer</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Discover how well your resume aligns with a specific job and get actionable insights.
      </p>
      
      <JobMatchForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="flex flex-col justify-center items-center my-12 space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Analyzing your resume against the job requirements...</p>
        </div>
      )}

      {analysisResult && !isLoading && (
        <>
          <Separator className="my-12" />
          <JobMatchResultDisplay analysis={analysisResult} />
        </>
      )}
    </div>
  );
}
