'use server';
/**
 * @fileOverview Rewrites and reformats resume text into a structured, ATS-friendly format.
 *
 * - rewriteResume - A function that processes the resume text.
 * - RewriteResumeInput - The input type for the rewriteResume function.
 * - RewriteResumeOutput - The return type for the rewriteResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteResumeInputSchema = z.object({
  rawResumeText: z.string().min(100, {message: "Resume text must be at least 100 characters."}).max(15000, {message: "Resume text must be less than 15000 characters."})
    .describe('The raw, unformatted text content of the user\'s resume.'),
});
export type RewriteResumeInput = z.infer<typeof RewriteResumeInputSchema>;

const WorkExperienceSchema = z.object({
  role: z.string().describe('The job title or role.'),
  company: z.string().describe('The name of the company.'),
  dates: z.string().describe('Employment dates (e.g., "Jan 2020 - Present" or "May 2018 - Aug 2019").'),
  responsibilities: z.string().describe('A bullet-point list of key responsibilities and achievements, starting each point with an action verb. Each bullet point should be on a new line, prefixed with a hyphen or asterisk.'),
});
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;

const EducationSchema = z.object({
  degree: z.string().describe('The degree obtained (e.g., "B.S. in Computer Science").'),
  institution: z.string().describe('The name of the educational institution.'),
  dates: z.string().describe('Graduation date or dates of attendance (e.g., "Graduated May 2018" or "Aug 2014 - May 2018").'),
  details: z.string().optional().describe('Optional: Relevant coursework, honors, or GPA if noteworthy. Presented as a short bullet list if multiple items.'),
});
export type Education = z.infer<typeof EducationSchema>;

const RewriteResumeOutputSchema = z.object({
  fullName: z.string().optional().describe("The user's full name, extracted or inferred if possible."),
  contactInfo: z.string().optional().describe("Contact information like email, phone, LinkedIn, GitHub, portfolio link. Format as a single string, ideally pipe-separated or on new lines for clarity."),
  summary: z.string().describe('A concise professional summary (3-5 sentences) highlighting key qualifications and career objective, tailored from the resume content.'),
  skills: z.string().describe('A bullet-point list of key technical and soft skills. Each skill or skill category on a new line, prefixed with a hyphen or asterisk.'),
  workExperience: z.array(WorkExperienceSchema).describe('A list of professional experiences, ordered chronologically (most recent first).'),
  education: z.array(EducationSchema).describe('A list of educational qualifications, ordered chronologically (most recent or highest degree first).'),
  certifications: z.string().optional().describe('Optional: A bullet-point list of relevant certifications or licenses, if any. Each on a new line, prefixed with a hyphen or asterisk.'),
});
export type RewriteResumeOutput = z.infer<typeof RewriteResumeOutputSchema>;


export async function rewriteResume(input: RewriteResumeInput): Promise<RewriteResumeOutput> {
  return rewriteResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeRewriterPrompt',
  input: {schema: RewriteResumeInputSchema},
  output: {schema: RewriteResumeOutputSchema},
  prompt: `You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist.
Your task is to take the provided raw resume text, parse it, rewrite it for clarity and impact, and structure it into a professional, ATS-friendly format.

Raw Resume Text:
{{{rawResumeText}}}

Instructions for rewriting and structuring:
1.  **Extract/Infer Full Name and Contact Information**: If identifiable, extract the full name. Extract any contact details (email, phone, LinkedIn, GitHub, portfolio) and format them clearly.
2.  **Professional Summary**: Write a concise (3-5 sentences) professional summary based on the overall experience and skills in the resume. It should highlight key qualifications and career objectives.
3.  **Skills**: Identify and list key technical skills, soft skills, tools, and technologies. Present this as a bullet-point list.
4.  **Work Experience**:
    *   List experiences in reverse chronological order (most recent first).
    *   For each role, include: Job Title, Company Name, Employment Dates.
    *   Rewrite responsibilities and achievements into concise bullet points. Each bullet point should start with a strong action verb. Quantify achievements with numbers whenever possible based on the input text.
5.  **Education**:
    *   List educational qualifications in reverse chronological order (most recent or highest degree first).
    *   Include: Degree, Institution, Graduation Date (or dates of attendance).
    *   Optionally, include relevant coursework, honors, or GPA if significant and present in the input.
6.  **Certifications/Licenses**: If any are mentioned, list them as bullet points. This section is optional.

General Guidelines:
*   **ATS-Friendly**: Use standard fonts and formatting (though you only output text). Avoid tables, columns, or overly complex layouts in your textual representation.
*   **Action Verbs**: Start bullet points in the Work Experience section with strong action verbs.
*   **Quantify**: Emphasize quantifiable achievements.
*   **Conciseness**: Be clear and to the point.
*   **Bullet Points**: Ensure all lists (skills, responsibilities, certifications, education details if multiple) are formatted with hyphens (-) or asterisks (*) as bullet points on new lines.

Generate the structured resume now according to the output schema.
`,
});

const rewriteResumeFlow = ai.defineFlow(
  {
    name: 'rewriteResumeFlow',
    inputSchema: RewriteResumeInputSchema,
    outputSchema: RewriteResumeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to rewrite the resume.");
    }
    return output;
  }
);