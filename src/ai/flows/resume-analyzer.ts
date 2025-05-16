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
  strengths: z.string().describe('A summary of the user\'s strengths based on their resume.'),
  weaknesses: z.string().describe('A summary of the user\'s weaknesses or skill gaps based on their resume and career goals.'),
  missingSkills: z.string().describe('A list of specific skills the user is missing to achieve their career goals.'),
  learningResources: z
    .string()
    .describe('Recommendations for courses, certifications, or other resources to help the user acquire the missing skills.'),
  benchmarkFeedback: z
    .string()
    .describe('Feedback to optimize their profiles for specific roles, including resume suggestions.'),
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

Identify the user's strengths, weaknesses, and missing skills relative to their career goals.  Recommend specific learning resources (courses, certifications, etc.) to acquire the missing skills. Also provide feedback to optimize their profiles for specific roles, including resume suggestions.

Strengths:
{{$jsonValue strengths}}

Weaknesses:
{{$jsonValue weaknesses}}

Missing Skills:
{{$jsonValue missingSkills}}

Learning Resources:
{{$jsonValue learningResources}}

Benchmark Feedback:
{{$jsonValue benchmarkFeedback}}`,
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
