'use server';
/**
 * @fileOverview Analyzes text input to detect soft skills, infer working style,
 * and suggest ideal job roles or environments.
 *
 * - analyzeSoftSkillsAndPersonality - A function that performs the analysis.
 * - SoftSkillsAnalyzerInput - The input type.
 * - SoftSkillsAnalyzerOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SoftSkillsAnalyzerInputSchema = z.object({
  inputText: z.string().min(100, { message: "Input text must be at least 100 characters." }).max(10000, { message: "Input text must be less than 10000 characters." })
    .describe('The text content to be analyzed, typically a resume or answers to behavioral questions.'),
});
export type SoftSkillsAnalyzerInput = z.infer<typeof SoftSkillsAnalyzerInputSchema>;

const SoftSkillsAnalyzerOutputSchema = z.object({
  detectedSoftSkills: z.string().describe('A bullet-point list of key soft skills detected from the input text (e.g., Communication, Teamwork, Problem-Solving, Leadership, Adaptability). Aim for 5-7 distinct skills.'),
  workingStyleSummary: z.string().describe('A concise paragraph (3-5 sentences) summarizing the user\'s inferred working style and personality traits based on the text (e.g., collaborative, analytical, proactive, detail-oriented).'),
  suggestedRolesAndEnvironments: z.string().describe('A bullet-point list of 3-5 ideal job roles or work environments that would suit the detected soft skills and working style (e.g., "Roles requiring strong analytical skills and independent work," "Fast-paced, collaborative startup environments," "Customer-facing positions leveraging strong communication skills").'),
});
export type SoftSkillsAnalyzerOutput = z.infer<typeof SoftSkillsAnalyzerOutputSchema>;

export async function analyzeSoftSkillsAndPersonality(input: SoftSkillsAnalyzerInput): Promise<SoftSkillsAnalyzerOutput> {
  return softSkillsAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'softSkillsAnalyzerPrompt',
  input: {schema: SoftSkillsAnalyzerInputSchema},
  output: {schema: SoftSkillsAnalyzerOutputSchema},
  prompt: `You are an expert career coach and HR analyst specializing in behavioral analysis and talent assessment.
Analyze the following input text, which could be a resume or answers to behavioral questions:

{{{inputText}}}

Based on this text, perform the following analysis:

1.  **Detected Soft Skills**: Identify and list 5-7 key soft skills evident in the text. Present this as a bullet-point list. Examples: Communication, Teamwork, Problem-Solving, Leadership, Adaptability, Critical Thinking, Creativity, Time Management.

2.  **Working Style Summary**: Infer the user's primary working style and prominent personality traits. Summarize this in a concise paragraph (3-5 sentences). Consider aspects like:
    *   Approach to tasks (e.g., analytical, proactive, methodical, creative).
    *   Interaction with others (e.g., collaborative, independent, mentoring, leading).
    *   Work pace preference (e.g., fast-paced, structured, reflective).
    *   Key motivators or drivers if discernible.

3.  **Suggested Roles and Environments**: Based on the detected soft skills and working style, suggest 3-5 types of job roles or work environments where this individual might thrive. Present this as a bullet-point list. Be specific about why these suggestions are suitable. Examples:
    *   "Project management roles in tech companies, leveraging strong organizational and communication skills."
    *   "Research-oriented positions in academia or think tanks, suiting an analytical and detail-oriented style."
    *   "Dynamic startup environments requiring adaptability and proactive problem-solving."

Ensure your entire response strictly adheres to the defined output schema with bullet points for lists.
`,
});

const softSkillsAnalyzerFlow = ai.defineFlow(
  {
    name: 'softSkillsAnalyzerFlow',
    inputSchema: SoftSkillsAnalyzerInputSchema,
    outputSchema: SoftSkillsAnalyzerOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to analyze soft skills and personality.");
    }
    return output;
  }
);
