
'use server';
/**
 * @fileOverview Generates multiple-choice questions for a mock interview.
 *
 * - generateMCQQuestions - Generates a list of MCQs.
 * - MCQGeneratorInput - Input type for the flow.
 * - MCQGeneratorOutput - Output type for the flow.
 * - MCQQuestionSchema - Schema for a single MCQ question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MCQQuestionSchema = z.object({
  questionText: z.string().describe("The text of the multiple-choice question."),
  options: z.array(z.string()).length(4).describe("An array of exactly four answer options."),
  correctAnswerIndex: z.number().min(0).max(3).describe("The 0-based index of the correct answer in the 'options' array."),
  // explanation: z.string().optional().describe("A brief explanation for why the correct answer is right, if applicable."),
});
export type MCQQuestion = z.infer<typeof MCQQuestionSchema>;

const MCQGeneratorInputSchema = z.object({
  targetJobRoleAndCompany: z.string().min(5, {message: "Target job role and company must be at least 5 characters."}).max(200)
    .describe("The target job role and company, e.g., 'Software Engineer at Google' or 'Marketing Manager at Netflix'."),
  numberOfQuestions: z.number().min(5).max(20).default(15).describe("The number of MCQs to generate."),
});
export type MCQGeneratorInput = z.infer<typeof MCQGeneratorInputSchema>;

const MCQGeneratorOutputSchema = z.object({
  mcqs: z.array(MCQQuestionSchema).describe("An array of generated multiple-choice questions."),
});
export type MCQGeneratorOutput = z.infer<typeof MCQGeneratorOutputSchema>;

export async function generateMCQQuestions(input: MCQGeneratorInput): Promise<MCQGeneratorOutput> {
  return mcqGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mcqGeneratorPrompt',
  input: {schema: MCQGeneratorInputSchema},
  output: {schema: MCQGeneratorOutputSchema},
  prompt: `You are an expert interviewer and question designer.
Your task is to generate {{numberOfQuestions}} relevant multiple-choice questions (MCQs) for a mock interview for the following target:
Target: {{targetJobRoleAndCompany}}

For each MCQ, provide:
1.  'questionText': The question itself.
2.  'options': An array of exactly four distinct answer options. Ensure one is clearly correct and others are plausible distractors.
3.  'correctAnswerIndex': The 0-based index of the correct answer within the 'options' array.

The questions should cover a range of topics relevant to the role and company, potentially including:
-   Technical skills (if applicable)
-   Problem-solving scenarios
-   Company knowledge (if a well-known company is specified)
-   Industry-specific knowledge
-   Situational judgment

Ensure the questions are clear, concise, and appropriate for an interview context.
Return ONLY the array of MCQ objects as specified in the output schema.
`,
});

const mcqGeneratorFlow = ai.defineFlow(
  {
    name: 'mcqGeneratorFlow',
    inputSchema: MCQGeneratorInputSchema,
    outputSchema: MCQGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.mcqs || output.mcqs.length === 0) {
      throw new Error("AI failed to generate MCQ questions.");
    }
    // Ensure the number of questions matches the request, or at least is close.
    // Sometimes the model might not return the exact number.
    if (output.mcqs.length > input.numberOfQuestions) {
        output.mcqs = output.mcqs.slice(0, input.numberOfQuestions);
    }
    return output;
  }
);

