
"use client";

import type { LinkedInOptimizerOutput } from "@/ai/flows/linkedin-optimizer-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, CheckCircle, AlertTriangle, Target, ListChecks, Edit3 } from "lucide-react";

interface LinkedInOptimizationDisplayProps {
  result: LinkedInOptimizerOutput | null;
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

const renderArrayAsList = (items: string[] | undefined | null, title: string) => {
  if (!items || items.length === 0) return <p className="text-sm text-muted-foreground">No {title.toLowerCase()} suggested.</p>;
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-sm">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export function LinkedInOptimizationDisplay({ result }: LinkedInOptimizationDisplayProps) {
  if (!result) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
        <div className="flex items-center gap-3 text-primary">
            <Lightbulb className="h-7 w-7" />
            <CardTitle className="text-2xl">Your LinkedIn Optimization Report</CardTitle>
        </div>
        <CardDescription>
          Actionable suggestions to enhance your LinkedIn profile for your career goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result.overallAnalysis && (
            <div className="mb-6 p-4 border rounded-md bg-muted/30">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Overall Analysis
                </h3>
                <p className="text-sm text-muted-foreground">{result.overallAnalysis}</p>
            </div>
        )}
        <Accordion type="multiple" defaultValue={["weaknesses", "keywords", "headlines"]} className="w-full space-y-2">
          <AccordionItem value="weaknesses" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                <AlertTriangle className="mr-3 h-5 w-5 text-yellow-500" /> Weakness Analysis & Improvements
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              {renderBulletedText(result.weaknessAnalysis, "No specific weaknesses identified or section not provided.")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="keywords" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                <Target className="mr-3 h-5 w-5 text-blue-500" /> Missing Keywords
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              {renderBulletedText(result.missingKeywords, "No specific missing keywords identified.")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="headlines" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                <Edit3 className="mr-3 h-5 w-5 text-purple-500" /> Suggested Headlines
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              {renderArrayAsList(result.suggestedHeadlines, "Headlines")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="about-section" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                 <Edit3 className="mr-3 h-5 w-5 text-teal-500" /> 'About' Section Advice
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              {renderBulletedText(result.optimizedAboutSectionAdvice, "No specific advice for the 'About' section.")}
            </AccordionContent>
          </AccordionItem>

           <AccordionItem value="skills" className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
              <div className="flex items-center">
                <ListChecks className="mr-3 h-5 w-5 text-indigo-500" /> Suggested Skills
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border">
              {renderBulletedText(result.suggestedSkills, "No additional skills suggested.")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

