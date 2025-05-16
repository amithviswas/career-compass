
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckSquare, ListChecks, SearchX, Percent, TrendingUp, FileText } from "lucide-react";
import type { JobMatchAnalyzerOutput } from "@/ai/flows/job-match-analyzer-flow";
import { Progress } from "@/components/ui/progress";

interface JobMatchResultDisplayProps {
  analysis: JobMatchAnalyzerOutput | null;
}

// Helper function to render text with potential bullet points
const renderBulletedText = (text: string | undefined | null) => {
  if (!text) return <p className="text-sm text-muted-foreground">No details provided.</p>;
  
  const lines = text.split(/\n\s*(?:[-*]\s*)?|\r\n\s*(?:[-*]\s*)?/)
    .map(line => line.trim()) 
    .filter(line => line.length > 0); 

  if (lines.length > 0) {
    return (
      <ul className="list-disc pl-5 space-y-1.5 text-sm">
        {lines.map((line, index) => (
          <li key={index}>{line.replace(/^[-*]\s*/, "")}</li> 
        ))}
      </ul>
    );
  }
  // Fallback for non-bulleted text or if AI fails to use bullets
  return <p className="text-sm whitespace-pre-wrap">{text}</p>;
};


export function JobMatchResultDisplay({ analysis }: JobMatchResultDisplayProps) {
  if (!analysis) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Job Match Analysis Report</CardTitle>
        <CardDescription>
          Here's how your resume stacks up against the target job, along with suggestions for improvement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 text-primary">
              <Percent className="h-6 w-6" />
              <CardTitle className="text-xl">Overall Match Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-4xl font-bold text-center text-primary">{analysis.matchPercentage}%</p>
            <Progress value={analysis.matchPercentage} className="w-full h-3" />
            <p className="text-sm text-muted-foreground text-center">
              This score reflects the alignment of your resume with the generated sample job description.
            </p>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={["item-improvements", "item-sample-jd"]} className="w-full space-y-2">
          <AccordionItem value="item-improvements" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                <TrendingUp className="mr-3 h-5 w-5 text-green-500" /> Suggested Improvements
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              {renderBulletedText(analysis.suggestedImprovements)}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-matching-keywords" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                <ListChecks className="mr-3 h-5 w-5 text-blue-500" /> Matching Keywords
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              {renderBulletedText(analysis.matchingKeywords)}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-missing-skills" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                <SearchX className="mr-3 h-5 w-5 text-red-500" /> Missing Skills & Qualifications
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              {renderBulletedText(analysis.missingSkills)}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-sample-jd" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                <FileText className="mr-3 h-5 w-5 text-indigo-500" /> Sample Job Description Used
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              <p className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/30 p-4 rounded-md border">
                {analysis.sampleJobDescription || "No sample job description was generated."}
              </p>
              <p className="text-xs mt-2 text-muted-foreground">
                Note: This is a sample job description generated by AI for analysis purposes and may not perfectly reflect an actual job posting.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
