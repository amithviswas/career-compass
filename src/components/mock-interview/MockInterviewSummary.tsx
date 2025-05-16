
"use client";

import type { MCQQuestion } from "@/ai/flows/mcq-generator-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Award, MessageSquare, Star, RotateCcw, ClipboardCopy, ThumbsUp, AlertTriangle, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import type { InterviewAnswerEvalOutput } from "@/ai/flows/interview-answer-eval-flow";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface DescriptiveAnswerRecord extends InterviewAnswerEvalOutput {
  question: string;
  userAnswer: string;
}

interface MCQUserAnswer {
  questionIndex: number;
  selectedOptionIndex: number | null;
  isCorrect?: boolean;
}

interface MockInterviewSummaryProps {
  mcqQuestions: MCQQuestion[];
  userMCQAnswers: MCQUserAnswer[];
  descriptiveAnswers: DescriptiveAnswerRecord[];
  targetJobRole: string;
  onRestart: () => void;
}

const renderBulletedText = (text: string | undefined | null, defaultText = "No details provided.") => {
    if (!text) return <p className="text-sm text-muted-foreground">{defaultText}</p>;
    const lines = text.split(/\n\s*(?:[-*]\s*)?|\r\n\s*(?:[-*]\s*)?/)
      .map(line => line.trim())
      .filter(line => line.length > 0 && line !== '-' && line !== '*');
  
    if (lines.length > 0) {
      return (
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          {lines.map((line, index) => (
            <li key={index}>{line.replace(/^[-*]\s*/, "")}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-sm whitespace-pre-line">{text}</p>;
};

export function MockInterviewSummary({ 
    mcqQuestions, 
    userMCQAnswers, 
    descriptiveAnswers, 
    targetJobRole, 
    onRestart 
}: MockInterviewSummaryProps) {
  const { toast } = useToast();

  const numMCQsCorrect = userMCQAnswers.filter(ans => ans.isCorrect).length;
  const totalMCQs = mcqQuestions.length;
  const mcqScoreString = totalMCQs > 0 ? `${numMCQsCorrect}/${totalMCQs}` : "N/A";

  const averageDescriptiveScore = descriptiveAnswers.length > 0 
    ? descriptiveAnswers.reduce((sum, ans) => sum + (ans.score || 0), 0) / descriptiveAnswers.length
    : 0;

  if ((!mcqQuestions || mcqQuestions.length === 0) && (!descriptiveAnswers || descriptiveAnswers.length === 0)) {
    return (
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Interview Summary</CardTitle>
          <CardDescription>No answers recorded for this session for {targetJobRole}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRestart} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <RotateCcw className="mr-2 h-4 w-4" />
            Start New Interview
          </Button>
        </CardContent>
      </Card>
    );
  }

  const copySummaryToClipboard = () => {
    let summaryText = `Mock Interview Summary for ${targetJobRole}\n\n`;
    
    if (totalMCQs > 0) {
      summaryText += `MCQ Performance: ${mcqScoreString} correct\n`;
      mcqQuestions.forEach((mcq, index) => {
        const userAnswer = userMCQAnswers.find(ua => ua.questionIndex === index);
        summaryText += `  MCQ ${index + 1}: ${mcq.questionText}\n`;
        summaryText += `    Correct Answer: ${mcq.options[mcq.correctAnswerIndex]}\n`;
        summaryText += `    Your Answer: ${userAnswer && userAnswer.selectedOptionIndex !== null ? mcq.options[userAnswer.selectedOptionIndex] : "Not answered"}\n`;
        summaryText += `    Result: ${userAnswer?.isCorrect ? "Correct" : "Incorrect"}\n`;
      });
      summaryText += `\n`;
    }

    if (descriptiveAnswers.length > 0) {
      summaryText += `Descriptive Questions Average Score: ${averageDescriptiveScore.toFixed(1)}/10\n\n`;
      descriptiveAnswers.forEach((ans, index) => {
        summaryText += `Descriptive Question ${index + 1}: ${ans.question}\n`;
        summaryText += `  Your Answer: ${ans.userAnswer}\n`;
        summaryText += `  Score: ${ans.score}/10\n`;
        summaryText += `  Feedback:\n${ans.feedback}\n`;
        summaryText += `  Tips for Improvement:\n${ans.tipsForImprovement}\n\n`;
      });
    }

    navigator.clipboard.writeText(summaryText)
      .then(() => toast({ title: "Summary Copied!", description: "Full interview summary copied to clipboard." }))
      .catch(() => toast({ title: "Copy Failed", description: "Could not copy summary.", variant: "destructive" }));
  };

  return (
    <Card className="w-full max-w-3xl shadow-xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle className="text-2xl text-primary flex items-center">
                    <Award className="mr-2 h-7 w-7" /> Mock Interview Report
                </CardTitle>
                <CardDescription className="mt-1">
                    Your performance summary for: {targetJobRole}.
                </CardDescription>
            </div>
            <Button onClick={copySummaryToClipboard} variant="outline" size="sm" className="self-start sm:self-center">
                <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Summary
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {totalMCQs > 0 && (
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-xl text-accent flex items-center">
                        <HelpCircle className="mr-2 h-5 w-5"/> MCQ Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-center text-primary">
                        Score: {mcqScoreString}
                    </p>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                        Based on {totalMCQs} multiple-choice questions.
                    </p>
                </CardContent>
            </Card>
        )}

        {descriptiveAnswers.length > 0 && (
             <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-xl text-accent flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5"/> Descriptive Questions Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-center text-primary">
                        Average Score: {averageDescriptiveScore.toFixed(1)}/10
                    </p>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                        Based on {descriptiveAnswers.length} question{descriptiveAnswers.length === 1 ? '' : 's'}.
                    </p>
                </CardContent>
            </Card>
        )}
        
        {userMCQAnswers.length > 0 && totalMCQs > 0 && (
          <>
            <Separator />
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">MCQ Detailed Breakdown:</h3>
            <Accordion type="multiple" className="w-full space-y-3">
              {mcqQuestions.map((mcq, index) => {
                const userAnswer = userMCQAnswers.find(ua => ua.questionIndex === index);
                const isCorrect = userAnswer?.isCorrect;
                const selectedOptionIndex = userAnswer?.selectedOptionIndex;
                return (
                  <AccordionItem value={`mcq-answer-${index}`} key={`mcq-${index}`} className="border rounded-lg shadow-sm bg-card">
                    <AccordionTrigger className="text-md hover:no-underline px-4 py-3 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
                      <div className="flex justify-between items-center w-full">
                          <span className="truncate pr-2 text-left">MCQ {index + 1}: {mcq.questionText.substring(0,40)}{mcq.questionText.length > 40 ? "..." : ""}</span>
                          {isCorrect ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-background rounded-b-lg border-t border-border space-y-3">
                      <p className="text-sm font-medium">{mcq.questionText}</p>
                      <ul className="space-y-1 text-sm">
                        {mcq.options.map((opt, optIndex) => (
                          <li key={optIndex} className={`flex items-center p-1.5 rounded-sm ${optIndex === mcq.correctAnswerIndex ? 'text-green-700 font-semibold' : ''} ${selectedOptionIndex === optIndex && optIndex !== mcq.correctAnswerIndex ? 'text-red-700 line-through' : ''}`}>
                            {optIndex === mcq.correctAnswerIndex && <CheckCircle className="mr-2 h-4 w-4 text-green-500 shrink-0" />}
                            {selectedOptionIndex === optIndex && optIndex !== mcq.correctAnswerIndex && <XCircle className="mr-2 h-4 w-4 text-red-500 shrink-0" />}
                            {selectedOptionIndex !== optIndex && optIndex !== mcq.correctAnswerIndex && <span className="mr-2 h-4 w-4 shrink-0"></span>}
                            {opt}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground">Your answer was {isCorrect ? "correct." : "incorrect."}</p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </>
        )}


        {descriptiveAnswers.length > 0 && (
          <>
            <Separator />
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Descriptive Questions Detailed Breakdown:</h3>
            <Accordion type="multiple" className="w-full space-y-3">
              {descriptiveAnswers.map((ans, index) => (
                <AccordionItem value={`descriptive-answer-${index}`} key={`desc-${index}`} className="border rounded-lg shadow-sm bg-card">
                  <AccordionTrigger className="text-md hover:no-underline px-4 py-3 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
                    <div className="flex justify-between items-center w-full">
                        <span className="truncate pr-2 text-left">Q{index + 1}: {ans.question.substring(0,40)}{ans.question.length > 40 ? "..." : ""}</span>
                        <span className="text-primary font-bold flex items-center whitespace-nowrap">
                            <Star className="mr-1 h-4 w-4 text-yellow-500 fill-yellow-500" /> {ans.score}/10
                        </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-background rounded-b-lg border-t border-border space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Your Answer:</h4>
                      <p className="text-sm p-2 border rounded-md bg-muted/20 whitespace-pre-wrap">{ans.userAnswer}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1 text-primary flex items-center"><ThumbsUp className="mr-1.5 h-4 w-4"/>AI Feedback:</h4>
                      {renderBulletedText(ans.feedback)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1 text-accent flex items-center"><AlertTriangle className="mr-1.5 h-4 w-4"/>Tips for Improvement:</h4>
                      {renderBulletedText(ans.tipsForImprovement)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
        <Button onClick={onRestart} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Mock Interview
        </Button>
      </CardContent>
    </Card>
  );
}

