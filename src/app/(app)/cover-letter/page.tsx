"use client";

import { useState } from "react";
import { CoverLetterForm } from "@/components/cover-letter/CoverLetterForm";
import { CoverLetterDisplay } from "@/components/cover-letter/CoverLetterDisplay";
import { generateCoverLetter } from "@/ai/flows/cover-letter-generator-flow";
import type { GenerateCoverLetterOutput, GenerateCoverLetterInput } from "@/ai/flows/cover-letter-generator-flow";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";


export default function CoverLetterGeneratorPage() {
  const [generatedLetter, setGeneratedLetter] = useState<GenerateCoverLetterOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const initialFormValues: Partial<GenerateCoverLetterInput> = {
    userFullName: user?.displayName || user?.email?.split('@')[0] || "",
  };


  const handleFormSubmit = async (values: GenerateCoverLetterInput) => {
    setIsLoading(true);
    setGeneratedLetter(null); 

    try {
      toast({
        title: "Generating Cover Letter...",
        description: "Crafting your personalized cover letter. This may take a moment.",
      });
      const result = await generateCoverLetter(values);
      setGeneratedLetter(result);
      toast({
        title: "Cover Letter Generated!",
        description: "Your letter is ready below.",
      });
    } catch (error: any) {
      console.error("Cover letter generation failed:", error);
      setGeneratedLetter(null);
      let errorMessage = "Could not generate your cover letter. Please try again.";
      if (error.message && error.message.includes("Failed to generate cover letter from AI")) {
        errorMessage = "The AI failed to generate the letter. This might be due to the input or a temporary issue. Please try again or rephrase your input.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-2">Cover Letter Generator</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Create a tailored cover letter in minutes with AI assistance.
      </p>
      
      <CoverLetterForm onSubmit={handleFormSubmit} isLoading={isLoading} initialData={initialFormValues}/>

      {isLoading && (
        <div className="flex flex-col justify-center items-center my-12 space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Crafting your letter...</p>
        </div>
      )}

      {generatedLetter && !isLoading && (
        <>
          <Separator className="my-12" />
          <CoverLetterDisplay coverLetterText={generatedLetter.coverLetterText} />
        </>
      )}
    </div>
  );
}
