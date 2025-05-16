// use server'
'use server';
/**
 * @fileOverview Analyzes a user's resume against their career goals to identify strengths,
 * weaknesses, and missing skills, and recommends targeted learning resources.
 *
 * - analyzeResumeAndRecommend - A function that analyzes the resume and recommends learning resources.
 * - AnalyzeResumeAndRecommendInput - The input type for the analyzeResumeAndRecommend function.
 * - AnalyzeResumeAndRecommendOutput - The return type for the analyzeResumeAndRecommend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeAndRecommendInputSchema = z.object({
  resumeText: z.string().describe('The text content of the user\'s resume.'),
  careerGoals: z.string().describe('The user\'s career goals.'),
});
export type AnalyzeResumeAndRecommendInput = z.infer<typeof AnalyzeResumeAndRecommendInputSchema>;

const AnalyzeResumeAndRecommendOutputSchema = z.object({
  strengths: z.string().describe('A bullet-point summary of the user\'s strengths based on their resume.'),
  weaknesses: z.string().describe('A bullet-point summary of the user\'s weaknesses or skill gaps based on their resume and career goals.'),
  missingSkills: z.string().describe('A bullet-point list of specific skills the user is missing to achieve their career goals.'),
  learningResources: z
    .string()
    .describe('A bullet-point list of specific recommendations for courses (free or paid), certifications, or other learning resources from platforms like Coursera, edX, YouTube, etc., to help the user acquire the missing skills. Each recommendation should be targeted to a specific missing skill.'),
  benchmarkFeedback: z.object({
    feedbackText: z
      .string()
      .describe('Qualitative feedback to optimize their profiles for specific roles, including resume suggestions.'),
    score: z
      .number()
      .min(0)
      .max(100)
      .describe('A numerical score from 0 to 100 representing the resume\'s suitability for the target roles, based on the benchmark.'),
  }).describe('Feedback and score to optimize their profiles for specific roles, including resume suggestions and a suitability score.'),
});
export type AnalyzeResumeAndRecommendOutput = z.infer<typeof AnalyzeResumeAndRecommendOutputSchema>;

export async function analyzeResumeAndRecommend(input: AnalyzeResumeAndRecommendInput): Promise<AnalyzeResumeAndRecommendOutput> {
  return analyzeResumeAndRecommendFlow(input);
}

const analyzeResumeAndRecommendPrompt = ai.definePrompt({
  name: 'analyzeResumeAndRecommendPrompt',
  input: {schema: AnalyzeResumeAndRecommendInputSchema},
  output: {schema: AnalyzeResumeAndRecommendOutputSchema},
  prompt: `You are a career advisor. Analyze the following resume and provide feedback based on the user's career goals.

Resume:
{{resumeText}}

Career Goals:
{{careerGoals}}

Please format your response as follows:
- Strengths: Provide a bullet-point summary of the user's strengths.
- Weaknesses: Provide a bullet-point summary of the user's weaknesses or skill gaps.
- Missing Skills: Provide a bullet-point list of specific skills the user is missing.
- Learning Resources: Provide a bullet-point list of specific recommendations for courses (both free and paid options if relevant), certifications, or other learning resources to help the user acquire the identified 'Missing Skills'. For each missing skill, suggest targeted resources from platforms like Coursera, edX, YouTube, or other reputable sources (e.g., "For improving Python skills: 'Python for Everybody Specialization' on Coursera (paid) or 'freeCodeCamp's Python tutorial' on YouTube (free)"). Clearly link the resource to the skill it addresses.
- Benchmark Feedback: 
  - Provide qualitative feedback with resume suggestions.
  - Provide a numerical score from 0 to 100 representing the resume's suitability for the target roles.

Your response must be structured according to the provided output schema. Ensure the score is part of the 'benchmarkFeedback' object and that strengths, weaknesses, missing skills, and learning resources are presented as bullet points.`,
});

const analyzeResumeAndRecommendFlow = ai.defineFlow(
  {
    name: 'analyzeResumeAndRecommendFlow',
    inputSchema: AnalyzeResumeAndRecommendInputSchema,
    outputSchema: AnalyzeResumeAndRecommendOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumeAndRecommendPrompt(input);
    return output!;
  }
);

