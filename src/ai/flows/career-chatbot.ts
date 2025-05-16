'use server';

/**
 * @fileOverview An AI chatbot for answering career-related questions and providing motivational support.
 *
 * - careerChatbot - A function that handles the chatbot interaction.
 * - CareerChatbotInput - The input type for the careerChatbot function.
 * - CareerChatbotOutput - The return type for the careerChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type CareerChatbotInput = z.infer<typeof CareerChatbotInputSchema>;

const CareerChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
});
export type CareerChatbotOutput = z.infer<typeof CareerChatbotOutputSchema>;

export async function careerChatbot(input: CareerChatbotInput): Promise<CareerChatbotOutput> {
  return careerChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerChatbotPrompt',
  input: {schema: CareerChatbotInputSchema},
  output: {schema: CareerChatbotOutputSchema},
  prompt: `You are a career advisor chatbot designed to answer career-related questions and provide motivational support to students and professionals.

  Respond to the following user message:
  {{message}}

  Your response should be informative, helpful, and encouraging.
  If the user asks a question, provide a clear and concise answer. If the user expresses doubts or concerns, offer motivational support and guidance.
`,
});

const careerChatbotFlow = ai.defineFlow(
  {
    name: 'careerChatbotFlow',
    inputSchema: CareerChatbotInputSchema,
    outputSchema: CareerChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
