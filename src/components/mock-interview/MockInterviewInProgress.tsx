
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Send, CheckCircle, AlertCircle, Info } from "lucide-react";
import type { InterviewAnswerEvalOutput } from "@/ai/flows/interview-answer-eval-flow";
import { Progress } from "@/components/ui/progress";

interface AnswerRecord extends InterviewAnswerEvalOutput {
  question: string;
  userAnswer: string;
}

interface MockInterviewInProgressProps {
  questions: string[];
  currentQuestionIndex: number;
  onAnswerSubmit: (answer: string) => Promise<void>;
  isEvaluating: boolean;
  lastEvaluationResult: AnswerRecord | null;
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

export function MockInterviewInProgress({
  questions,
  currentQuestionIndex,
  onAnswerSubmit,
  isEvaluating,
  lastEvaluationResult,
}: MockInterviewInProgressProps) {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || isEvaluating) return;
    await onAnswerSubmit(currentAnswer);
    setCurrentAnswer(""); // Clear textarea for next question if needed, or keep for review
  };

  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;


  return (
    <div className="w-full max-w-2xl space-y-6">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl text-primary">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </CardTitle>
                 <Progress value={progressPercentage} className="w-full h-2.5 mt-2" />
                <CardDescription className="pt-4 text-lg font-semibold text-foreground">
                    {currentQuestion}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    placeholder="Type your answer here..."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="min-h-[150px] resize-y text-sm"
                    disabled={isEvaluating}
                />
                <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90" disabled={isEvaluating || !currentAnswer.trim()}>
                    {isEvaluating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Evaluating...
                    </>
                    ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Answer
                    </>
                    )}
                </Button>
                </form>
            </CardContent>
        </Card>

      {lastEvaluationResult && lastEvaluationResult.question === questions[currentQuestionIndex-1] && (
        <Card className="shadow-md mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-accent">Feedback for Your Previous Answer</CardTitle>
            <CardDescription>Question: {lastEvaluationResult.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["feedback-score", "feedback-details"]} className="w-full space-y-2">
              <AccordionItem value="feedback-score" className="border-b-0 rounded-lg shadow-sm bg-card">
                 <AccordionTrigger className="text-md hover:no-underline px-4 py-3 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
                    <div className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Score: {lastEvaluationResult.score}/100
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm p-4 bg-background rounded-b-lg border-t border-border">
                     <p className="text-sm text-muted-foreground">This score reflects the AI's evaluation of your answer to the previous question.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="feedback-details" className="border-b-0 rounded-lg shadow-sm bg-card">
                <AccordionTrigger className="text-md hover:no-underline px-4 py-3 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
                    <div className="flex items-center">
                        <Info className="mr-2 h-5 w-5 text-blue-500" /> Detailed Feedback
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm p-4 bg-background rounded-b-lg border-t border-border space-y-3">
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Strengths & Feedback:</h4>
                    {renderBulletedText(lastEvaluationResult.feedback)}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Tips for Improvement:</h4>
                    {renderBulletedText(lastEvaluationResult.tipsForImprovement)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
