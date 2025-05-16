"use client";

import { useState } from "react";
import { ResumeInputForm } from "@/components/resume-rewriter/ResumeInputForm";
import { EditableResumeDisplay } from "@/components/resume-rewriter/EditableResumeDisplay";
import { rewriteResume, type RewriteResumeOutput, type RewriteResumeInput } from "@/ai/flows/resume-rewriter-flow";
import { generateResumeHtml } from "@/lib/resume-template";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResumeRewriterPage() {
  const [rewrittenResume, setRewrittenResume] = useState<RewriteResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (values: RewriteResumeInput) => {
    setIsLoading(true);
    setRewrittenResume(null);

    try {
      toast({
        title: "Building Your ATS Resume...",
        description: "The AI is working its magic. This may take a moment.",
      });
      const result = await rewriteResume(values);
      setRewrittenResume(result);
      toast({
        title: "ATS Resume Built!",
        description: "Your AI-enhanced resume is ready below for editing.",
      });
    } catch (error: any) {
      console.error("Resume rewriting failed:", error);
      setRewrittenResume(null);
      let errorMessage = "Could not build your ATS resume. Please try again.";
      if (error.message && error.message.includes("AI failed to rewrite")) {
        errorMessage = "The AI failed to process your resume. This might be due to the input or a temporary issue. Please try again or rephrase your input.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Building Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpdate = (updatedResume: RewriteResumeOutput) => {
    setRewrittenResume(updatedResume);
  };
  
  const handlePrepareForPdf = () => {
    if (!rewrittenResume) {
      toast({ title: "No resume data", description: "Please generate or load a resume first.", variant: "destructive" });
      return;
    }
    try {
      const resumeHtml = generateResumeHtml(rewrittenResume);
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(resumeHtml);
        newWindow.document.close(); // Important for some browsers
        toast({ title: "Resume Ready for PDF", description: "Use your browser's 'Print to PDF' function in the new tab." });
      } else {
        toast({ title: "Popup Blocked?", description: "Could not open new tab. Please disable popup blocker and try again.", variant: "destructive" });
      }
    } catch (error) {
        console.error("Failed to generate HTML for PDF:", error);
        toast({ title: "Error Preparing PDF", description: "Could not generate HTML for PDF.", variant: "destructive"});
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-2">AI-Powered ATS Resume Maker</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Transform your raw resume text into a polished, ATS-friendly document. Edit and then prepare for PDF.
      </p>
      
      <ResumeInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="flex flex-col justify-center items-center my-12 space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Crafting your enhanced resume...</p>
        </div>
      )}

      {rewrittenResume && !isLoading && (
        <>
          <Separator className="my-12" />
          <div className="flex justify-end mb-6">
            <Button onClick={handlePrepareForPdf} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <FileText className="mr-2 h-4 w-4" />
              Prepare for PDF
            </Button>
          </div>
          <EditableResumeDisplay 
            initialData={rewrittenResume} 
            onUpdate={handleResumeUpdate} 
          />
           <div className="flex justify-end mt-6">
            <Button onClick={handlePrepareForPdf} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <FileText className="mr-2 h-4 w-4" />
              Prepare for PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
