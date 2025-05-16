
'use server';
/**
 * @fileOverview Generates interview questions for a target job role.
 *
 * - generateInterviewQuestions - Generates a list of interview questions.
 * - InterviewQuestionsInput - Input type for the flow.
 * - InterviewQuestionsOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterviewQuestionsInputSchema = z.object({
  targetJobRole: z.string().min(5, {message: "Target job role must be at least 5 characters."}).max(200, {message: "Target job role must be less than 200 characters."})
    .describe("The target job role, e.g., 'Software Engineer at Google' or 'Marketing Manager'."),
});
export type InterviewQuestionsInput = z.infer<typeof InterviewQuestionsInputSchema>;

const InterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).min(5).max(7)
    .describe("An array of 5-7 relevant interview questions for the target job role."),
});
export type InterviewQuestionsOutput = z.infer<typeof InterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: InterviewQuestionsInput): Promise<InterviewQuestionsOutput> {
  return interviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewQuestionsPrompt',
  input: {schema: InterviewQuestionsInputSchema},
  output: {schema: InterviewQuestionsOutputSchema},
  prompt: `You are an expert interviewer and career coach.
Your task is to generate 5-7 relevant interview questions for the following target job role:
{{targetJobRole}}

The questions should cover a mix of behavioral, situational, and technical (if applicable to the role) aspects. Ensure the questions are distinct and challenging.
Return ONLY the array of questions as specified in the output schema.
`,
});

const interviewQuestionsFlow = ai.defineFlow(
  {
    name: 'interviewQuestionsFlow',
    inputSchema: InterviewQuestionsInputSchema,
    outputSchema: InterviewQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.questions || output.questions.length === 0) {
      throw new Error("AI failed to generate interview questions.");
    }
    return output;
  }
);
