
"use client";

import type { JobSuggestionOutput } from "@/ai/flows/job-suggestion-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, CheckCircle, Lightbulb } from "lucide-react";

interface JobSuggestionDisplayProps {
  result: JobSuggestionOutput | null;
}

export function JobSuggestionDisplay({ result }: JobSuggestionDisplayProps) {
  if (!result || !result.suggestions || result.suggestions.length === 0) {
    return (
      <Card className="w-full shadow-lg mt-8">
        <CardHeader>
          <div className="flex items-center gap-3 text-primary">
            <Lightbulb className="h-7 w-7" />
            <CardTitle className="text-2xl">Job Role Suggestions</CardTitle>
          </div>
          <CardDescription>
            No job role suggestions could be generated at this time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please try again with different resume text or check back later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
        <div className="flex items-center gap-3 text-primary">
            <Lightbulb className="h-7 w-7" />
            <CardTitle className="text-2xl">Your Suggested Job Roles</CardTitle>
        </div>
        <CardDescription>
          Based on your resume, here are some career paths you might be well-suited for.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={result.suggestions.length > 0 ? [`suggestion-0`] : []} className="w-full space-y-3">
          {result.suggestions.map((suggestion, index) => (
            <AccordionItem value={`suggestion-${index}`} key={index} className="border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
              <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 font-semibold text-foreground data-[state=open]:bg-muted/50 rounded-t-lg data-[state=open]:border-b">
                <div className="flex items-center">
                  <Briefcase className="mr-3 h-5 w-5 text-primary" /> {suggestion.suggestedRole}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm p-6 bg-background rounded-b-lg border-t border-border space-y-3">
                <div>
                  <h4 className="font-semibold mb-2 text-md text-muted-foreground flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Why this might be a good fit:
                  </h4>
                  <p className="whitespace-pre-line">{suggestion.reasoning}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
