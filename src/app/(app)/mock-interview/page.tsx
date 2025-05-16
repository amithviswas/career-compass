
"use client";

import { useState } from "react";
import { MockInterviewSetup } from "@/components/mock-interview/MockInterviewSetup";
import type { SetupFormValues } from "@/components/mock-interview/MockInterviewSetup";
import { MCQPhase } from "@/components/mock-interview/MCQPhase";
import type { MCQQuestion } from "@/ai/flows/mcq-generator-flow";
import { generateMCQQuestions } from "@/ai/flows/mcq-generator-flow";
import type { MCQGeneratorInput } from "@/ai/flows/mcq-generator-flow";
import { MockInterviewInProgress } from "@/components/mock-interview/MockInterviewInProgress";
import { MockInterviewSummary } from "@/components/mock-interview/MockInterviewSummary";
import { generateInterviewQuestions } from "@/ai/flows/interview-questions-flow";
import type { InterviewQuestionsInput } from "@/ai/flows/interview-questions-flow";
import { evaluateInterviewAnswer } from "@/ai/flows/interview-answer-eval-flow";
import type { InterviewAnswerEvalInput, InterviewAnswerEvalOutput } from "@/ai/flows/interview-answer-eval-flow";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type InterviewStage = 
  | "setup" 
  | "generatingMCQs" 
  | "mcqInProgress" 
  | "generatingDescriptive" 
  | "descriptiveInProgress" 
  | "evaluatingAnswer" 
  | "finished";

interface DescriptiveAnswerRecord extends InterviewAnswerEvalOutput {
  question: string;
  userAnswer: string;
}

interface MCQUserAnswer {
  questionIndex: number;
  selectedOptionIndex: number | null;
  isCorrect?: boolean;
}

export default function MockInterviewPage() {
  const [stage, setStage] = useState<InterviewStage>("setup");
  const [targetJobRoleContext, setTargetJobRoleContext] = useState(""); 
  
  // MCQ state
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [userMCQAnswers, setUserMCQAnswers] = useState<MCQUserAnswer[]>([]);
  
  // Descriptive state
  const [descriptiveQuestions, setDescriptiveQuestions] = useState<string[]>([]);
  const [currentDescriptiveQuestionIndex, setCurrentDescriptiveQuestionIndex] = useState(0);
  const [recordedDescriptiveAnswers, setRecordedDescriptiveAnswers] = useState<DescriptiveAnswerRecord[]>([]);
  const [lastDescriptiveEvaluationResult, setLastDescriptiveEvaluationResult] = useState<DescriptiveAnswerRecord | null>(null);
  
  const { toast } = useToast();

  const NUM_MCQS = 15;
  const NUM_DESCRIPTIVE_QUESTIONS = 7;

  const handleSetupSubmit = async (values: SetupFormValues) => {
    setStage("generatingMCQs");
    
    let jobRole = values.selectedJobRole === "Other" ? values.customJobRole : values.selectedJobRole;
    let company = values.selectedCompany === "Other" ? values.customCompany : values.selectedCompany;
    const combinedTarget = `${jobRole}${company && company !== "Startup (General)" && company !== "Mid-size Tech Company" && company !== "Other" ? ` at ${company}` : (company === "Other" && values.customCompany ? ` at ${values.customCompany}` : '')}`;
    
    setTargetJobRoleContext(combinedTarget);
    setMcqQuestions([]);
    setUserMCQAnswers([]);
    setDescriptiveQuestions([]);
    setRecordedDescriptiveAnswers([]);
    setLastDescriptiveEvaluationResult(null);
    setCurrentDescriptiveQuestionIndex(0);

    try {
      toast({ title: "Generating MCQ Questions...", description: `Preparing MCQs for ${combinedTarget}. This may take a moment.` });
      const mcqInput: MCQGeneratorInput = { targetJobRoleAndCompany: combinedTarget, numberOfQuestions: NUM_MCQS };
      const mcqResult = await generateMCQQuestions(mcqInput);

      if (mcqResult.mcqs && mcqResult.mcqs.length > 0) {
        setMcqQuestions(mcqResult.mcqs);
        setStage("mcqInProgress");
        toast({ title: "MCQs Ready!", description: `Generated ${mcqResult.mcqs.length} MCQs for ${combinedTarget}.` });
      } else {
        throw new Error("No MCQ questions were generated.");
      }
    } catch (error: any) {
      console.error("Failed to generate MCQ questions:", error);
      toast({ title: "MCQ Generation Failed", description: error.message || "Could not start the interview. Please try again.", variant: "destructive" });
      setStage("setup");
    }
  };

  const handleSubmitMCQs = async (mcqAnswersIndices: (number | null)[]) => {
    const evaluatedMCQAnswers = mcqQuestions.map((mcq, index) => ({
        questionIndex: index,
        selectedOptionIndex: mcqAnswersIndices[index],
        isCorrect: mcqAnswersIndices[index] === mcq.correctAnswerIndex
    }));
    setUserMCQAnswers(evaluatedMCQAnswers);

    setStage("generatingDescriptive");
    try {
      toast({ title: "Generating Descriptive Questions...", description: "Preparing the next part of your interview." });
      const descriptiveInput: InterviewQuestionsInput = { targetJobRole: targetJobRoleContext, numberOfQuestions: NUM_DESCRIPTIVE_QUESTIONS };
      const result = await generateInterviewQuestions(descriptiveInput);
      if (result.questions && result.questions.length > 0) {
        setDescriptiveQuestions(result.questions);
        setStage("descriptiveInProgress");
        toast({ title: "Descriptive Questions Ready!", description: `Generated ${result.questions.length} descriptive questions.` });
      } else {
        throw new Error("No descriptive questions were generated.");
      }
    } catch (error: any) {
      console.error("Failed to generate descriptive questions:", error);
      toast({ title: "Question Generation Failed", description: error.message || "Could not generate descriptive questions. Please try again or restart.", variant: "destructive" });
      setStage("finished"); // Go to summary even if this fails, to show MCQ results
    }
  };

  const handleDescriptiveAnswerSubmit = async (userAnswer: string) => {
    setStage("evaluatingAnswer");
    const currentQuestion = descriptiveQuestions[currentDescriptiveQuestionIndex];
    try {
      toast({ title: "Evaluating Your Answer...", description: "The AI is reviewing your response." });
      const evalInput: InterviewAnswerEvalInput = {
        targetJobRole: targetJobRoleContext,
        question: currentQuestion,
        userAnswer,
      };
      const evaluationResult = await evaluateInterviewAnswer(evalInput);
      
      const newAnswerRecord: DescriptiveAnswerRecord = {
        question: currentQuestion,
        userAnswer,
        ...evaluationResult,
      };
      setRecordedDescriptiveAnswers(prev => [...prev, newAnswerRecord]);
      setLastDescriptiveEvaluationResult(newAnswerRecord);

      toast({ title: "Feedback Ready!", description: "Check the feedback for your previous answer." });

      if (currentDescriptiveQuestionIndex < descriptiveQuestions.length - 1) {
        setCurrentDescriptiveQuestionIndex(prev => prev + 1);
        setStage("descriptiveInProgress");
      } else {
        setStage("finished");
        toast({ title: "Interview Complete!", description: "View your summary below." });
      }
    } catch (error: any) {
      console.error("Failed to evaluate answer:", error);
      toast({ title: "Evaluation Failed", description: error.message || "Could not evaluate your answer. You can try answering again or move to the next question if available.", variant: "destructive" });
      if (currentDescriptiveQuestionIndex < descriptiveQuestions.length - 1) {
         setStage("descriptiveInProgress"); 
      } else {
         setStage("finished"); 
      }
    }
  };

  const handleRestartInterview = () => {
    setStage("setup");
    setTargetJobRoleContext("");
    setMcqQuestions([]);
    setUserMCQAnswers([]);
    setDescriptiveQuestions([]);
    setCurrentDescriptiveQuestionIndex(0);
    setRecordedDescriptiveAnswers([]);
    setLastDescriptiveEvaluationResult(null);
  };
  
  const renderContent = () => {
    switch (stage) {
      case "setup":
        return <MockInterviewSetup onSubmit={handleSetupSubmit} isLoading={false} />;
      case "generatingMCQs":
        return (
          <div className="flex flex-col items-center justify-center space-y-3 p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Preparing your MCQ questions for {targetJobRoleContext}...</p>
          </div>
        );
      case "mcqInProgress":
        return <MCQPhase mcqQuestions={mcqQuestions} onSubmitMCQs={handleSubmitMCQs} />;
      case "generatingDescriptive":
        return (
          <div className="flex flex-col items-center justify-center space-y-3 p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Preparing your descriptive questions...</p>
          </div>
        );
      case "descriptiveInProgress":
      case "evaluatingAnswer": 
        return (
          <MockInterviewInProgress
            questions={descriptiveQuestions}
            currentQuestionIndex={currentDescriptiveQuestionIndex}
            onAnswerSubmit={handleDescriptiveAnswerSubmit}
            isEvaluating={stage === "evaluatingAnswer"}
            lastEvaluationResult={lastDescriptiveEvaluationResult}
          />
        );
      case "finished":
        return <MockInterviewSummary 
                  mcqQuestions={mcqQuestions}
                  userMCQAnswers={userMCQAnswers}
                  descriptiveAnswers={recordedDescriptiveAnswers} 
                  targetJobRole={targetJobRoleContext} 
                  onRestart={handleRestartInterview} 
                />;
      default:
        return <p>Something went wrong. Please refresh.</p>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-primary mb-2">AI Mock Interview</h1>
      <p className="text-muted-foreground mb-8 text-lg text-center max-w-2xl">
        Practice with AI-driven MCQs and descriptive questions tailored to your target role.
      </p>
      {stage !== "setup" && stage !== "generatingMCQs" && stage !== "generatingDescriptive" && (
        <Separator className="my-6 w-full max-w-3xl" />
      )}
      {renderContent()}
    </div>
  );
}

