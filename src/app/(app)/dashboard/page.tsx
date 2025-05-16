"use client";

import { useState } from "react";
import { ProfileGoalsForm } from "@/components/dashboard/ProfileGoalsForm";
import { RoadmapDisplay } from "@/components/dashboard/RoadmapDisplay";
import { analyzeResumeAndRecommend } from "@/ai/flows/resume-analyzer";
import type { AnalyzeResumeAndRecommendOutput, AnalyzeResumeAndRecommendInput } from "@/ai/flows/resume-analyzer";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResumeAndRecommendOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProfileSubmit = async (values: AnalyzeResumeAndRecommendInput) => {
    setIsLoading(true);
    setAnalysisResult(null); // Clear previous results
    try {
      const result = await analyzeResumeAndRecommend(values);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete!",
        description: "Your personalized roadmap has been generated.",
      });
    } catch (error) {
      console.error("Resume analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate your roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-2">Your Career Dashboard</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Define your aspirations and let AI craft your path to success.
      </p>
      
      <ProfileGoalsForm onSubmit={handleProfileSubmit} isLoading={isLoading} />

      {analysisResult && (
        <>
          <Separator className="my-8" />
          <RoadmapDisplay analysis={analysisResult} />
        </>
      )}
    </div>
  );
}
