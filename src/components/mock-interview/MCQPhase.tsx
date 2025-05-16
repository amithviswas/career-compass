
"use client";

import { useState } from "react";
import type { MCQQuestion } from "@/ai/flows/mcq-generator-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, CheckSquare } from "lucide-react";

interface MCQPhaseProps {
  mcqQuestions: MCQQuestion[];
  onSubmitMCQs: (answers: (number | null)[]) => void; // Array of selected option indices
}

export function MCQPhase({ mcqQuestions, onSubmitMCQs }: MCQPhaseProps) {
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(mcqQuestions.length).fill(null));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentMCQ = mcqQuestions[currentMCQIndex];

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentMCQIndex] = parseInt(selectedOption, 10);
      setUserAnswers(newAnswers);
    }
    
    if (currentMCQIndex < mcqQuestions.length - 1) {
      setCurrentMCQIndex(prev => prev + 1);
      setSelectedOption(null); // Reset for next question
    } else {
      // This is the last MCQ, submit all answers
      const finalAnswers = [...userAnswers];
      if (selectedOption !== null) { // Ensure last answer is captured
          finalAnswers[currentMCQIndex] = parseInt(selectedOption,10);
      }
      onSubmitMCQs(finalAnswers);
    }
  };

  const progressPercentage = ((currentMCQIndex + 1) / mcqQuestions.length) * 100;

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary">
          Multiple Choice Questions: {currentMCQIndex + 1} of {mcqQuestions.length}
        </CardTitle>
        <Progress value={progressPercentage} className="w-full h-2.5 mt-2" />
        <CardDescription className="pt-4 text-lg font-semibold text-foreground">
          {currentMCQ.questionText}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption ?? ""}
          onValueChange={setSelectedOption}
          className="space-y-3"
        >
          {currentMCQ.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={index.toString()} id={`mcq-${currentMCQIndex}-option-${index}`} />
              <Label htmlFor={`mcq-${currentMCQIndex}-option-${index}`} className="text-sm font-normal flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleNextQuestion} 
          disabled={selectedOption === null}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
        >
          {currentMCQIndex < mcqQuestions.length - 1 ? (
            <>
              Next Question <ChevronRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Finish MCQs & Proceed <CheckSquare className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

