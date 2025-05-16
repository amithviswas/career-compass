
'use server';
/**
 * @fileOverview Evaluates a user's answer to an interview question.
 *
 * - evaluateInterviewAnswer - Evaluates the answer and provides feedback.
 * - InterviewAnswerEvalInput - Input type for the flow.
 * - InterviewAnswerEvalOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterviewAnswerEvalInputSchema = z.object({
  targetJobRole: z.string().describe("The target job role for context, e.g., 'Software Engineer at Google'."),
  question: z.string().describe("The interview question that was asked."),
  userAnswer: z.string().min(10, {message: "Answer must be at least 10 characters."}).max(5000, {message: "Answer must be less than 5000 characters."})
    .describe("The user's answer to the interview question."),
});
export type InterviewAnswerEvalInput = z.infer<typeof InterviewAnswerEvalInputSchema>;

const InterviewAnswerEvalOutputSchema = z.object({
  feedback: z.string().describe("Constructive feedback on the user's answer. Should be specific and presented as bullet points focusing on clarity, structure, relevance, and examples used."),
  tipsForImprovement: z.string().describe("Actionable tips for improving the answer in the future. Should be presented as bullet points."),
  score: z.number().min(1).max(10).describe("A numerical score from 1 to 10 representing the quality of this specific answer (1 being poor, 10 being excellent)."),
});
export type InterviewAnswerEvalOutput = z.infer<typeof InterviewAnswerEvalOutputSchema>;

export async function evaluateInterviewAnswer(input: InterviewAnswerEvalInput): Promise<InterviewAnswerEvalOutput> {
  return interviewAnswerEvalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewAnswerEvalPrompt',
  input: {schema: InterviewAnswerEvalInputSchema},
  output: {schema: InterviewAnswerEvalOutputSchema},
  prompt: `You are an expert interviewer and career coach specializing in {targetJobRole} roles.
The user was asked the following interview question:
"{{question}}"

The user provided this answer:
"{{{userAnswer}}}"

Your task is to evaluate this answer. Provide:
1.  **Feedback**: Constructive feedback on their answer as a bullet-point list. Focus on aspects like clarity, structure (e.g., STAR method if applicable), relevance to the question, and the quality of examples used.
2.  **Tips for Improvement**: Actionable tips for how the user could improve this specific answer in the future, as a bullet-point list.
3.  **Score**: A numerical score from 1 to 10 reflecting the quality of this specific answer (1 being poor, 10 being excellent).

Ensure your response adheres strictly to the output schema.
`,
});

const interviewAnswerEvalFlow = ai.defineFlow(
  {
    name: 'interviewAnswerEvalFlow',
    inputSchema: InterviewAnswerEvalInputSchema,
    outputSchema: InterviewAnswerEvalOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to evaluate the interview answer.");
    }
    return output;
  }
);

