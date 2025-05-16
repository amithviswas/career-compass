"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoverLetterDisplayProps {
  coverLetterText: string | null;
}

export function CoverLetterDisplay({ coverLetterText }: CoverLetterDisplayProps) {
  const { toast } = useToast();

  if (!coverLetterText) {
    return null;
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(coverLetterText)
      .then(() => {
        toast({ title: "Copied to clipboard!" });
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
        toast({ title: "Failed to copy", description: "Could not copy text to clipboard.", variant: "destructive" });
      });
  };

  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-primary">Your Generated Cover Letter</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard} className="gap-2">
                <ClipboardCopy className="h-4 w-4" />
                Copy
            </Button>
        </div>
        <CardDescription>
          Review the generated letter below. You can copy it and make further edits as needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted/30">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {coverLetterText}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
