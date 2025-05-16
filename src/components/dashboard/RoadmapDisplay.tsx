"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, XCircle, Target, Lightbulb, Award } from "lucide-react";
import type { AnalyzeResumeAndRecommendOutput } from "@/ai/flows/resume-analyzer";

interface RoadmapDisplayProps {
  analysis: AnalyzeResumeAndRecommendOutput | null;
}

export function RoadmapDisplay({ analysis }: RoadmapDisplayProps) {
  if (!analysis) {
    return null;
  }

  // Helper function to render text with potential bullet points
  const renderBulletedText = (text: string) => {
    const lines = text.split("\\n"); // Split by newline character if AI returns it
    if (lines.length > 1 || text.startsWith("- ") || text.startsWith("* ")) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {lines.map((line, index) => (
            <li key={index}>{line.replace(/^[-*]\s*/, "")}</li> // Remove leading bullet characters if present
          ))}
        </ul>
      );
    }
    return <p className="whitespace-pre-line">{text}</p>;
  };


  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Your Personalized Roadmap</CardTitle>
        <CardDescription>
          Based on your resume and career goals, here&apos;s your AI-generated analysis and learning path.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg hover:no-underline">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Strengths
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-4 bg-secondary/30 rounded-md whitespace-pre-line">
              {renderBulletedText(analysis.strengths)}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg hover:no-underline">
              <div className="flex items-center">
                <XCircle className="mr-2 h-5 w-5 text-red-500" /> Weaknesses / Areas for Improvement
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-4 bg-secondary/30 rounded-md whitespace-pre-line">
              {renderBulletedText(analysis.weaknesses)}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg hover:no-underline">
              <div className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-blue-500" /> Missing Skills
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-4 bg-secondary/30 rounded-md whitespace-pre-line">
              {renderBulletedText(analysis.missingSkills)}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg hover:no-underline">
              <div className="flex items-center">
                 <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" /> Learning Resources
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-4 bg-secondary/30 rounded-md whitespace-pre-line">
              {renderBulletedText(analysis.learningResources)}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg hover:no-underline">
              <div className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-indigo-500" /> Benchmark Feedback & Resume Optimization
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-4 bg-secondary/30 rounded-md space-y-3">
              {analysis.benchmarkFeedback && analysis.benchmarkFeedback.score !== undefined && (
                <p className="font-semibold">
                  Overall Suitability Score: <span className="text-primary text-lg">{analysis.benchmarkFeedback.score}/100</span>
                </p>
              )}
              <div className="whitespace-pre-line">
                {analysis.benchmarkFeedback?.feedbackText}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
