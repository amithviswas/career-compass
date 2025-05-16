
'use server';
/**
 * @fileOverview Analyzes a user's resume against a target job title and company,
 * generates a sample job description, and provides a match score with improvement suggestions.
 *
 * - analyzeJobMatch - A function that performs the job match analysis.
 * - JobMatchAnalyzerInput - The input type for the analyzeJobMatch function.
 * - JobMatchAnalyzerOutput - The return type for the analyzeJobMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const JobMatchAnalyzerInputSchema = z.object({
  resumeText: z.string().min(100, { message: "Resume text must be at least 100 characters." }).max(10000, { message: "Resume text must be less than 10000 characters." })
    .describe('The text content of the user\'s resume.'),
  targetJobTitleAndCompany: z.string().min(5, {message: "Target job title and company must be at least 5 characters."}).max(200, {message: "Target job title and company must be less than 200 characters."})
    .describe('The user\'s target job title and company (e.g., "Data Analyst at Google").'),
});
export type JobMatchAnalyzerInput = z.infer<typeof JobMatchAnalyzerInputSchema>;

export const JobMatchAnalyzerOutputSchema = z.object({
  sampleJobDescription: z.string().describe("The sample job description generated and used for the analysis."),
  matchingKeywords: z.string().describe("A bullet-point list of keywords and phrases found in both the resume and the sample job description."),
  missingSkills: z.string().describe("A bullet-point list of key skills, qualifications, or experiences from the sample job description that are missing or underdeveloped in the resume."),
  matchPercentage: z.number().min(0).max(100).describe("A numerical score (0-100) representing the resume's match to the generated sample job description."),
  suggestedImprovements: z.string().describe("Exactly 3 actionable, bullet-point suggestions to improve the resume for this specific job description and increase the match rate."),
});
export type JobMatchAnalyzerOutput = z.infer<typeof JobMatchAnalyzerOutputSchema>;

export async function analyzeJobMatch(input: JobMatchAnalyzerInput): Promise<JobMatchAnalyzerOutput> {
  return jobMatchAnalyzerFlow(input);
}

const jobMatchAnalyzerPrompt = ai.definePrompt({
  name: 'jobMatchAnalyzerPrompt',
  input: {schema: JobMatchAnalyzerInputSchema},
  output: {schema: JobMatchAnalyzerOutputSchema},
  prompt: `You are an expert career advisor and resume analyst.
Your task is to help a user understand how well their resume matches a specific job title and company.

User's Resume Text:
{{{resumeText}}}

Target Job Title and Company:
{{targetJobTitleAndCompany}}

Follow these steps meticulously:

1.  **Generate a Sample Job Description**: Based on the 'Target Job Title and Company' (e.g., '{{targetJobTitleAndCompany}}'), create a concise, typical job description. This sample should include common responsibilities, required skills, and qualifications for such a role. This is for internal comparison; do not state that you are generating it in the user-facing output for this field.

2.  **Compare and Analyze**:
    *   Thoroughly compare the 'User's Resume Text' against the 'Sample Job Description' you generated.
    *   **Matching Keywords**: Identify and list specific keywords and phrases (like skills, technologies, or experiences) present in *both* the resume and the sample job description. Format as a bullet-point list.
    *   **Missing Skills**: Identify and list key skills, qualifications, or experiences mentioned in the sample job description that are *missing or significantly underdeveloped* in the user's resume. Format as a bullet-point list.

3.  **Score the Match**:
    *   Provide a **Match Percentage Score** (an integer between 0 and 100) representing how well the user's resume aligns with the generated sample job description. A higher score indicates a better match.

4.  **Suggest Improvements**:
    *   Provide **exactly 3 actionable and specific bullet-point suggestions** for how the user can improve their resume to better align with the sample job description and increase their match rate. These suggestions should be concrete (e.g., "Quantify your achievement in project X by adding metrics like 'increased efficiency by 15%'." or "Add a 'Projects' section showcasing your experience with [Missing Skill Y].").

5.  **Output Structure**: Ensure your entire response strictly adheres to the defined output schema. The generated sample job description should be included in the \`sampleJobDescription\` field. All lists should be bullet points.
`,
});

const jobMatchAnalyzerFlow = ai.defineFlow(
  {
    name: 'jobMatchAnalyzerFlow',
    inputSchema: JobMatchAnalyzerInputSchema,
    outputSchema: JobMatchAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await jobMatchAnalyzerPrompt(input);
    if (!output) {
        throw new Error("Failed to get analysis from AI.");
    }
    return output;
  }
);
