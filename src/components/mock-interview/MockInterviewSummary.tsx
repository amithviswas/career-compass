
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Award, MessageSquare, Star, RotateCcw, ClipboardCopy } from "lucide-react";
import type { InterviewAnswerEvalOutput } from "@/ai/flows/interview-answer-eval-flow";
import { useToast } from "@/hooks/use-toast";

interface AnswerRecord extends InterviewAnswerEvalOutput {
  question: string;
  userAnswer: string;
}

interface MockInterviewSummaryProps {
  answers: AnswerRecord[];
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

export function MockInterviewSummary({ answers, targetJobRole, onRestart }: MockInterviewSummaryProps) {
  const { toast } = useToast();
  if (!answers || answers.length === 0) {
    return (
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Interview Summary</CardTitle>
          <CardDescription>No answers recorded for this session.</CardDescription>
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

  const averageScore = answers.reduce((sum, ans) => sum + (ans.score || 0), 0) / answers.length;

  const copySummaryToClipboard = () => {
    let summaryText = `Mock Interview Summary for ${targetJobRole}\n`;
    summaryText += `Overall Average Score: ${averageScore.toFixed(1)}/100\n\n`;
    answers.forEach((ans, index) => {
      summaryText += `Question ${index + 1}: ${ans.question}\n`;
      summaryText += `Your Answer: ${ans.userAnswer}\n`;
      summaryText += `Score: ${ans.score}/100\n`;
      summaryText += `Feedback:\n${ans.feedback}\n`;
      summaryText += `Tips for Improvement:\n${ans.tipsForImprovement}\n\n`;
    });

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
                    Your performance summary for the {targetJobRole} role.
                </CardDescription>
            </div>
            <Button onClick={copySummaryToClipboard} variant="outline" size="sm" className="self-start sm:self-center">
                <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Summary
            </Button>
        </div>
        
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-muted/30">
            <CardHeader>
                <CardTitle className="text-xl text-accent flex items-center">
                    <Star className="mr-2 h-5 w-5"/> Overall Performance
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold text-center text-primary">
                    Average Score: {averageScore.toFixed(1)}/100
                </p>
                <p className="text-sm text-muted-foreground text-center mt-1">
                    Based on {answers.length} question{answers.length === 1 ? '' : 's'}.
                </p>
            </CardContent>
        </Card>

        <Accordion type="multiple" className="w-full space-y-3">
          {answers.map((ans, index) => (
            <AccordionItem value={`answer-${index}`} key={index} className="border rounded-lg shadow-sm bg-card">
              <AccordionTrigger className="text-md hover:no-underline px-4 py-3 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
                <div className="flex justify-between items-center w-full">
                    <span>Question {index + 1}: {ans.question.substring(0,50)}{ans.question.length > 50 ? "..." : ""}</span>
                    <span className="text-primary font-bold">Score: {ans.score}/100</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-background rounded-b-lg border-t border-border space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Your Answer:</h4>
                  <p className="text-sm p-2 border rounded-md bg-muted/20 whitespace-pre-wrap">{ans.userAnswer}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1 text-accent-foreground">AI Feedback:</h4>
                  {renderBulletedText(ans.feedback)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1 text-accent-foreground">Tips for Improvement:</h4>
                  {renderBulletedText(ans.tipsForImprovement)}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button onClick={onRestart} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Mock Interview
        </Button>
      </CardContent>
    </Card>
  );
}
