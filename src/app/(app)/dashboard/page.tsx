
"use client";

import { useState } from "react";
import { ProfileGoalsForm } from "@/components/dashboard/ProfileGoalsForm";
import { RoadmapDisplay } from "@/components/dashboard/RoadmapDisplay";
import { FourWeekPlanDisplay } from "@/components/dashboard/FourWeekPlanDisplay";
import { analyzeResumeAndRecommend } from "@/ai/flows/resume-analyzer";
import type { AnalyzeResumeAndRecommendOutput, AnalyzeResumeAndRecommendInput } from "@/ai/flows/resume-analyzer";
import { generateFourWeekPlan } from "@/ai/flows/four-week-plan-flow";
import type { FourWeekPlanOutput, FourWeekPlanInput } from "@/ai/flows/four-week-plan-flow";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResumeAndRecommendOutput | null>(null);
  const [fourWeekPlan, setFourWeekPlan] = useState<FourWeekPlanOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const { toast } = useToast();

  const handleProfileSubmit = async (values: AnalyzeResumeAndRecommendInput) => {
    setIsLoadingAnalysis(true);
    setIsLoadingPlan(false); 
    setAnalysisResult(null); 
    setFourWeekPlan(null); 

    try {
      toast({
        title: "Starting Analysis...",
        description: "Analyzing your profile and career goals.",
      });
      const result = await analyzeResumeAndRecommend(values);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete!",
        description: "Your personalized roadmap has been generated. Now, crafting your 4-week plan...",
      });

      setIsLoadingPlan(true);
      try {
        const planInput: FourWeekPlanInput = {
          careerGoal: values.careerGoals,
          currentStrengths: result.strengths,
          areasForImprovement: result.weaknesses,
          skillsToDevelop: result.missingSkills,
        };
        const planResult = await generateFourWeekPlan(planInput);
        setFourWeekPlan(planResult);
        if (planResult && planResult.weeks && planResult.weeks.length > 0) {
            toast({
            title: "4-Week Plan Generated!",
            description: "Your study and networking plan is ready.",
            });
        } else {
            toast({
            title: "Plan Generation Issue",
            description: "The 4-week plan was generated but appears empty. Roadmap is still available.",
            variant: "destructive",
            });
        }
      } catch (planError) {
        console.error("4-week plan generation failed:", planError);
        setFourWeekPlan(null); // Ensure plan is null on error
        toast({
          title: "Plan Generation Failed",
          description: "Could not generate your 4-week plan. Your roadmap is still available.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPlan(false);
      }

    } catch (error) {
      console.error("Resume analysis failed:", error);
      setAnalysisResult(null); // Ensure analysis is null on error
      setFourWeekPlan(null); // Ensure plan is also null if analysis fails
      toast({
        title: "Analysis Failed",
        description: "Could not generate your roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const showOverallLoader = isLoadingAnalysis || isLoadingPlan;
  let loaderText = "";
  if (isLoadingAnalysis && !analysisResult) {
    loaderText = "Analyzing your profile and goals...";
  } else if (isLoadingPlan) {
    loaderText = "Crafting your 4-week action plan...";
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-2">Your Career Dashboard</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Define your aspirations and let AI craft your path to success.
      </p>
      
      <ProfileGoalsForm onSubmit={handleProfileSubmit} isLoading={isLoadingAnalysis || isLoadingPlan} />

      {showOverallLoader && (
        <div className="flex flex-col justify-center items-center my-8 space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          {loaderText && <p className="text-lg text-muted-foreground">{loaderText}</p>}
        </div>
      )}

      {analysisResult && !isLoadingAnalysis && (
        <>
          <Separator className="my-8" />
          <RoadmapDisplay analysis={analysisResult} />
        </>
      )}

      {fourWeekPlan && !isLoadingPlan && analysisResult && ( // Only show plan if analysis was also successful
        <>
          <Separator className="my-8" />
          <FourWeekPlanDisplay plan={fourWeekPlan} />
        </>
      )}
    </div>
  );
}
