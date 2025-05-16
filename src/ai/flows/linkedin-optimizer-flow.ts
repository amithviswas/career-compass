
'use server';
/**
 * @fileOverview Analyzes a user's LinkedIn profile data against their career goal
 * and provides optimization suggestions.
 *
 * - optimizeLinkedInProfile - A function that handles the LinkedIn profile optimization.
 * - LinkedInOptimizerInput - The input type for the optimizeLinkedInProfile function.
 * - LinkedInOptimizerOutput - The return type for the optimizeLinkedInProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LinkedInOptimizerInputSchema = z.object({
  currentHeadline: z.string().max(220).optional().describe("The user's current LinkedIn headline."),
  currentAboutSection: z.string().max(2600).optional().describe("The user's current LinkedIn 'About' section."),
  currentExperience: z.string().max(5000).optional().describe("The user's current LinkedIn experience section text. Can be a summary or key points."),
  currentSkills: z.string().max(1000).optional().describe("A comma-separated list of the user's current skills from LinkedIn."),
  careerGoal: z.string().min(5, {message: "Career goal must be at least 5 characters."}).max(200, {message: "Career goal must be less than 200 characters."}).describe("The user's target job role or career goal (e.g., 'Senior Product Manager at a tech startup')."),
});
export type LinkedInOptimizerInput = z.infer<typeof LinkedInOptimizerInputSchema>;

const LinkedInOptimizerOutputSchema = z.object({
  overallAnalysis: z.string().describe("A brief, 2-3 sentence overall analysis of the current profile's alignment with the career goal."),
  weaknessAnalysis: z.string().describe("A bullet-point analysis of specific weaknesses or areas for improvement in the provided LinkedIn profile sections relative to the career goal."),
  missingKeywords: z.string().describe("A bullet-point list of important keywords relevant to the career goal that seem to be missing or underutilized in the profile."),
  suggestedHeadlines: z.array(z.string().max(220)).min(2).max(5).describe("2-5 specific, optimized LinkedIn headline suggestions tailored to the career goal, incorporating relevant keywords."),
  optimizedAboutSectionAdvice: z.string().describe("Actionable, bullet-point advice on how to improve the 'About' section. This could include a short example snippet or key themes to incorporate."),
  suggestedSkills: z.string().describe("A bullet-point list of additional skills to consider adding or emphasizing on LinkedIn to align with the career goal."),
});
export type LinkedInOptimizerOutput = z.infer<typeof LinkedInOptimizerOutputSchema>;

export async function optimizeLinkedInProfile(input: LinkedInOptimizerInput): Promise<LinkedInOptimizerOutput> {
  return linkedinOptimizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'linkedinOptimizerPrompt',
  input: {schema: LinkedInOptimizerInputSchema},
  output: {schema: LinkedInOptimizerOutputSchema},
  prompt: `You are an expert LinkedIn profile optimization coach.
Your task is to analyze the user's provided LinkedIn profile information (headline, about section, experience, skills) in the context of their stated career goal. Provide actionable suggestions to improve their profile.

User's Career Goal: {{careerGoal}}

Provided LinkedIn Profile Data:
{{#if currentHeadline}}Current Headline: {{currentHeadline}}{{else}}Current Headline: Not provided.{{/if}}
{{#if currentAboutSection}}Current About Section: {{{currentAboutSection}}}{{else}}Current About Section: Not provided.{{/if}}
{{#if currentExperience}}Current Experience: {{{currentExperience}}}{{else}}Current Experience: Not provided.{{/if}}
{{#if currentSkills}}Current Skills: {{currentSkills}}{{else}}Current Skills: Not provided.{{/if}}

Instructions:
1.  **Overall Analysis**: Provide a brief (2-3 sentences) overall analysis of how well the current profile (based on provided sections) aligns with the career goal.
2.  **Weakness Analysis**: Identify specific weaknesses or areas for improvement in the provided sections. Present this as a bullet-point list. If a section is not provided, note that you cannot analyze it.
3.  **Missing Keywords**: List key industry-specific or role-specific keywords relevant to "{{careerGoal}}" that are missing or underrepresented in the provided text. Present as a bullet-point list.
4.  **Suggested Headlines**: Generate 2-5 optimized LinkedIn headline suggestions (max 220 characters each). These should be tailored to "{{careerGoal}}" and incorporate relevant keywords.
5.  **Optimized About Section Advice**: Provide actionable, bullet-point advice for improving the 'About' section (max 2600 characters for the actual section). This advice should guide the user on what to write, perhaps including a short example snippet or key themes. Do not write a full new 'About' section unless the input was empty, then provide a strong template.
6.  **Suggested Skills**: Recommend additional skills (as a bullet-point list) that the user should consider adding or highlighting on their LinkedIn profile to better align with "{{careerGoal}}".

Focus on providing concrete, actionable advice. All lists should be bullet points.
If certain profile sections are not provided by the user, acknowledge this and focus your advice on the provided sections and general best practices for the missing ones in relation to the career goal.
`,
});

const linkedinOptimizerFlow = ai.defineFlow(
  {
    name: 'linkedinOptimizerFlow',
    inputSchema: LinkedInOptimizerInputSchema,
    outputSchema: LinkedInOptimizerOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate LinkedIn profile optimization suggestions from AI.");
    }
    return output;
  }
);

