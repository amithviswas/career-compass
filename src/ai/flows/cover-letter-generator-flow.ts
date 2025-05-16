'use server';
/**
 * @fileOverview Generates a personalized cover letter.
 *
 * - generateCoverLetter - A function that creates the cover letter.
 * - GenerateCoverLetterInput - The input type.
 * - GenerateCoverLetterOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
  resumeText: z.string().min(100, { message: "Resume text must be at least 100 characters." }).max(10000, { message: "Resume text must be less than 10000 characters." })
    .describe('The text content of the user\'s resume.'),
  jobDetails: z.string().min(10, { message: "Job details must be at least 10 characters." }).max(1000, { message: "Job details must be less than 1000 characters." })
    .describe('The job title, job description, or key responsibilities for the target role.'),
  userFullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(100, { message: "Full name must be less than 100 characters." })
    .describe("The user's full name."),
  hiringManagerName: z.string().max(100).optional()
    .describe("The hiring manager's name, if known (e.g., Mr. Smith, Ms. Jones, Dr. Lee)."),
  companyName: z.string().min(1, { message: "Company name is required." }).max(100, { message: "Company name must be less than 100 characters." })
    .describe('The name of the company the user is applying to.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetterText: z.string().describe('The generated personalized cover letter, approximately 200-300 words.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return coverLetterGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coverLetterGeneratorPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are an expert career coach specializing in writing compelling cover letters.
Your task is to generate a professional, concise, and personalized cover letter for a job application. The cover letter should be approximately 200-300 words.

User's Full Name: {{userFullName}}
Company Applying To: {{companyName}}
{{#if hiringManagerName}}Hiring Manager's Name: {{hiringManagerName}}{{/if}}

Job Details (Title/Description/Responsibilities):
{{{jobDetails}}}

User's Resume Text:
{{{resumeText}}}

Instructions:
1.  **Salutation**:
    *   If a hiring manager's name is provided (e.g., "Mr. Smith", "Ms. Jones"), use it: "Dear {{hiringManagerName}},".
    *   If no hiring manager name is provided, use a general salutation: "Dear Hiring Manager," or "Dear {{companyName}} Team,".
2.  **Opening Paragraph**: Briefly introduce the user ({{userFullName}}) and state the position they are applying for at {{companyName}}.
3.  **Body Paragraphs (2-3 paragraphs)**:
    *   Highlight 2-3 key achievements, skills, or experiences from the user's resume ({{{resumeText}}}) that are most relevant to the provided job details ({{{jobDetails}}}).
    *   Quantify achievements with numbers or specific outcomes whenever possible, based on the resume.
    *   Explain *why* the user is a good fit for this specific role and company. Show genuine interest in {{companyName}}.
4.  **Closing Paragraph**: Reiterate interest in the role and the company. Express enthusiasm for the opportunity to discuss their qualifications further. Mention availability for an interview.
5.  **Closing**: Use a professional closing like "Sincerely," or "Regards," followed by the user's full name ({{userFullName}}).
6.  **Tone**: Maintain a professional, confident, and enthusiastic tone.
7.  **Conciseness**: Strictly adhere to an approximate word count of 200-300 words. Be impactful and to the point.
8.  **Formatting**: Ensure the output is a single block of text representing the cover letter. Use paragraph breaks appropriately.

Generate the cover letter now.
`,
});

const coverLetterGeneratorFlow = ai.defineFlow(
  {
    name: 'coverLetterGeneratorFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate cover letter from AI.");
    }
    return output;
  }
);
