
'use server';
/**
 * @fileOverview Analyzes resume text to suggest suitable job roles and career paths.
 *
 * - suggestJobRoles - A function that performs the analysis and suggestion.
 * - JobSuggestionInput - The input type for the suggestJobRoles function.
 * - JobSuggestionOutput - The return type for the suggestJobRoles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobSuggestionInputSchema = z.object({
  resumeText: z.string().min(100, { message: "Resume text must be at least 100 characters." }).max(10000, { message: "Resume text must be less than 10000 characters." })
    .describe('The text content of the user\'s resume.'),
});
export type JobSuggestionInput = z.infer<typeof JobSuggestionInputSchema>;

const SuggestedRoleSchema = z.object({
  suggestedRole: z.string().describe('A specific job role or career path suggested for the candidate.'),
  reasoning: z.string().describe('A brief explanation (2-3 sentences) of why this role is a good fit, referencing specific skills or experiences from the resume.'),
});

const JobSuggestionOutputSchema = z.object({
  suggestions: z.array(SuggestedRoleSchema).min(3).max(5).describe('An array of 3-5 job role suggestions, each with a role title and reasoning.'),
});
export type JobSuggestionOutput = z.infer<typeof JobSuggestionOutputSchema>;

export async function suggestJobRoles(input: JobSuggestionInput): Promise<JobSuggestionOutput> {
  return jobSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobSuggestionPrompt',
  input: {schema: JobSuggestionInputSchema},
  output: {schema: JobSuggestionOutputSchema},
  prompt: `You are an expert career counselor and resume analyst.
Analyze the following resume text to identify the candidate's key skills, experiences, and education.

Resume Text:
{{{resumeText}}}

Based on this analysis, your task is to:
1.  Predict and list 3-5 top job roles or career paths that would be best suited for this candidate.
2.  For each suggested job role, provide a brief explanation (2-3 sentences) of why the candidate is a good fit. This explanation MUST reference specific skills, experiences, or educational qualifications found in the resume text.

Format your response strictly according to the output schema, providing an array of suggestions where each object contains 'suggestedRole' and 'reasoning'.
`,
});

const jobSuggestionFlow = ai.defineFlow(
  {
    name: 'jobSuggestionFlow',
    inputSchema: JobSuggestionInputSchema,
    outputSchema: JobSuggestionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.suggestions || output.suggestions.length === 0) {
      throw new Error("AI failed to generate job role suggestions.");
    }
    return output;
  }
);
