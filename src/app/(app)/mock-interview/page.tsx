
"use client";

import { useState } from "react";
import { MockInterviewSetup } from "@/components/mock-interview/MockInterviewSetup";
import type { SetupFormValues } from "@/components/mock-interview/MockInterviewSetup";
import { MockInterviewInProgress } from "@/components/mock-interview/MockInterviewInProgress";
import { MockInterviewSummary } from "@/components/mock-interview/MockInterviewSummary";
import { generateInterviewQuestions } from "@/ai/flows/interview-questions-flow";
import type { InterviewQuestionsInput } from "@/ai/flows/interview-questions-flow";
import { evaluateInterviewAnswer } from "@/ai/flows/interview-answer-eval-flow";
import type { InterviewAnswerEvalInput, InterviewAnswerEvalOutput } from "@/ai/flows/interview-answer-eval-flow";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type InterviewPhase = "setup" | "generatingQuestions" | "inProgress" | "evaluatingAnswer" | "finished";

interface AnswerRecord extends InterviewAnswerEvalOutput {
  question: string;
  userAnswer: string;
}

export default function MockInterviewPage() {
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [targetJobRoleContext, setTargetJobRoleContext] = useState(""); // Stores the string for AI context
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordedAnswers, setRecordedAnswers] = useState<AnswerRecord[]>([]);
  const [lastEvaluationResult, setLastEvaluationResult] = useState<AnswerRecord | null>(null);
  const { toast } = useToast();

  const handleSetupSubmit = async (values: SetupFormValues) => {
    setPhase("generatingQuestions");
    
    let jobRole = values.selectedJobRole === "Other" ? values.customJobRole : values.selectedJobRole;
    let company = values.selectedCompany === "Other" ? values.customCompany : values.selectedCompany;
    const combinedTarget = `${jobRole}${company && company !== "Startup (General)" && company !== "Mid-size Tech Company" ? ` at ${company}` : ''}`;
    
    setTargetJobRoleContext(combinedTarget);
    setRecordedAnswers([]);
    setLastEvaluationResult(null);
    setCurrentQuestionIndex(0);

    try {
      toast({ title: "Generating Interview Questions...", description: `Preparing for ${combinedTarget}. Please wait.` });
      const questionInput: InterviewQuestionsInput = { targetJobRole: combinedTarget };
      const result = await generateInterviewQuestions(questionInput);
      if (result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        setPhase("inProgress");
        toast({ title: "Interview Ready!", description: `Generated ${result.questions.length} questions for ${combinedTarget}.` });
      } else {
        throw new Error("No questions were generated.");
      }
    } catch (error: any) {
      console.error("Failed to generate interview questions:", error);
      toast({ title: "Setup Failed", description: error.message || "Could not start the interview. Please try again.", variant: "destructive" });
      setPhase("setup");
    }
  };

  const handleAnswerSubmit = async (userAnswer: string) => {
    setPhase("evaluatingAnswer");
    const currentQuestion = questions[currentQuestionIndex];
    try {
      toast({ title: "Evaluating Your Answer...", description: "The AI is reviewing your response." });
      const evalInput: InterviewAnswerEvalInput = {
        targetJobRole: targetJobRoleContext, // Use the stored context string
        question: currentQuestion,
        userAnswer,
      };
      const evaluationResult = await evaluateInterviewAnswer(evalInput);
      
      const newAnswerRecord: AnswerRecord = {
        question: currentQuestion,
        userAnswer,
        ...evaluationResult,
      };
      setRecordedAnswers(prev => [...prev, newAnswerRecord]);
      setLastEvaluationResult(newAnswerRecord);

      toast({ title: "Feedback Ready!", description: "Check the feedback for your previous answer." });

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setPhase("inProgress");
      } else {
        setPhase("finished");
        toast({ title: "Interview Complete!", description: "View your summary below." });
      }
    } catch (error: any) {
      console.error("Failed to evaluate answer:", error);
      toast({ title: "Evaluation Failed", description: error.message || "Could not evaluate your answer. You can try answering again or move to the next question if available.", variant: "destructive" });
      if (currentQuestionIndex < questions.length - 1) {
         setPhase("inProgress"); 
      } else {
         setPhase("finished"); 
      }
    }
  };

  const handleRestartInterview = () => {
    setPhase("setup");
    setTargetJobRoleContext("");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setRecordedAnswers([]);
    setLastEvaluationResult(null);
  };
  
  const renderContent = () => {
    switch (phase) {
      case "setup":
        return <MockInterviewSetup onSubmit={handleSetupSubmit} isLoading={false} />;
      case "generatingQuestions":
        return (
          <div className="flex flex-col items-center justify-center space-y-3 p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Preparing your interview questions for {targetJobRoleContext}...</p>
          </div>
        );
      case "inProgress":
      case "evaluatingAnswer": 
        return (
          <MockInterviewInProgress
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            onAnswerSubmit={handleAnswerSubmit}
            isEvaluating={phase === "evaluatingAnswer"}
            lastEvaluationResult={lastEvaluationResult}
          />
        );
      case "finished":
        return <MockInterviewSummary answers={recordedAnswers} targetJobRole={targetJobRoleContext} onRestart={handleRestartInterview} />;
      default:
        return <p>Something went wrong. Please refresh.</p>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-primary mb-2">AI Mock Interview</h1>
      <p className="text-muted-foreground mb-8 text-lg text-center max-w-2xl">
        Practice your interviewing skills with AI-driven questions and feedback tailored to your target role.
      </p>
      {phase !== "setup" && phase !== "generatingQuestions" && (
        <Separator className="my-6 w-full max-w-3xl" />
      )}
      {renderContent()}
    </div>
  );
}
