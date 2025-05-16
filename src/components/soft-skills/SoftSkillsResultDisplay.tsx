
"use client";

import type { SoftSkillsAnalyzerOutput } from "@/ai/flows/soft-skills-analyzer-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, UserCheck, Briefcase, ThumbsUp } from "lucide-react";

interface SoftSkillsResultDisplayProps {
  result: SoftSkillsAnalyzerOutput | null;
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

export function SoftSkillsResultDisplay({ result }: SoftSkillsResultDisplayProps) {
  if (!result) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
        <div className="flex items-center gap-3 text-primary">
            <Sparkles className="h-7 w-7" />
            <CardTitle className="text-2xl">Your Soft Skills & Personality Insights</CardTitle>
        </div>
        <CardDescription>
          Here's what the AI discovered about your strengths and potential career paths.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["soft-skills", "working-style"]} className="w-full space-y-3">
          <AccordionItem value="soft-skills" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                <ThumbsUp className="mr-3 h-5 w-5 text-green-500" /> Detected Soft Skills
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              {renderBulletedText(result.detectedSoftSkills, "No specific soft skills were prominently detected.")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="working-style" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                <UserCheck className="mr-3 h-5 w-5 text-blue-500" /> Working Style Summary
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              <p className="whitespace-pre-line">{result.workingStyleSummary || "Working style could not be determined."}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="roles-env" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                 <Briefcase className="mr-3 h-5 w-5 text-purple-500" /> Suggested Roles & Environments
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              {renderBulletedText(result.suggestedRolesAndEnvironments, "No specific roles or environments could be suggested based on the input.")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
