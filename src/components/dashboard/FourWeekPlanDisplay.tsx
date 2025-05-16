
"use client";

import type { FourWeekPlanOutput } from "@/ai/flows/four-week-plan-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Linkedin, Users, CalendarDays } from "lucide-react";

interface FourWeekPlanDisplayProps {
  plan: FourWeekPlanOutput | null;
}

const renderBulletedText = (text: string | undefined | null) => {
  if (!text) return <p className="text-sm text-muted-foreground">No details provided.</p>;
  
  // Split by newlines, or newlines followed by common bullet point markers (* or -)
  // Also handles cases where AI might just use \n for new lines without explicit bullets
  const lines = text.split(/\n\s*(?:[-*]\s*)?|\r\n\s*(?:[-*]\s*)?/)
    .map(line => line.trim()) // Trim whitespace from each line
    .filter(line => line.length > 0); // Remove empty lines

  if (lines.length > 0) {
    return (
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {lines.map((line, index) => (
          <li key={index}>{line.replace(/^[-*]\s*/, "")}</li> // Remove leading bullet character if AI added one
        ))}
      </ul>
    );
  }
  return <p className="text-sm whitespace-pre-line">{text}</p>;
};

export function FourWeekPlanDisplay({ plan }: FourWeekPlanDisplayProps) {
  if (!plan || !plan.weeks || plan.weeks.length === 0) {
    return (
        <Card className="w-full shadow-lg mt-8">
            <CardHeader>
                 <div className="flex items-center gap-2 text-primary">
                    <CalendarDays className="h-6 w-6" />
                    <CardTitle className="text-2xl">4-Week Plan</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">The 4-week plan could not be generated or is empty.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <CalendarDays className="h-6 w-6" />
          <CardTitle className="text-2xl">{plan.planTitle || "Your 4-Week Career Kickstarter Plan"}</CardTitle>
        </div>
        <CardDescription>
          A structured plan to guide your study, networking, and interview preparation over the next four weeks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['week-1']} className="w-full space-y-4">
          {plan.weeks.map((week, index) => (
            <AccordionItem value={`week-${week.weekNumber || index + 1}`} key={index} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="text-lg hover:no-underline px-6 py-4 bg-muted/50 hover:bg-muted/75 rounded-t-lg data-[state=open]:rounded-b-none data-[state=open]:border-b">
                <div className="flex items-center font-semibold">
                  Week {week.weekNumber || index + 1}
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 space-y-6 bg-background rounded-b-lg border border-t-0">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-md font-semibold text-primary">
                    <BookOpen className="h-5 w-5" />
                    <span>Study Goals</span>
                  </div>
                  {renderBulletedText(week.studyGoals)}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-3 text-md font-semibold text-primary">
                    <Linkedin className="h-5 w-5" />
                    <span>LinkedIn Tips</span>
                  </div>
                  {renderBulletedText(week.linkedinTips)}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-3 text-md font-semibold text-primary">
                    <Users className="h-5 w-5" />
                    <span>Mock Interview Prep</span>
                  </div>
                  {renderBulletedText(week.mockInterviewPrep)}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
