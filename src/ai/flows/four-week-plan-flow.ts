
'use server';
/**
 * @fileOverview Generates a 4-week study and networking plan.
 *
 * - generateFourWeekPlan - A function that creates the 4-week plan.
 * - FourWeekPlanInput - The input type for the generateFourWeekPlan function.
 * - FourWeekPlanOutput - The return type for the generateFourWeekPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FourWeekPlanInputSchema = z.object({
  careerGoal: z.string().describe("The user's primary career goal."),
  currentStrengths: z.string().describe("User's current strengths, can be bullet points from previous analysis."),
  areasForImprovement: z.string().describe("User's areas for improvement or weaknesses, can be bullet points from previous analysis."),
  skillsToDevelop: z.string().describe("Specific skills the user needs to develop, can be bullet points from previous analysis."),
});
export type FourWeekPlanInput = z.infer<typeof FourWeekPlanInputSchema>;

const WeeklyPlanSchema = z.object({
  weekNumber: z.number().min(1).max(4).describe('The week number (1, 2, 3, or 4).'),
  studyGoals: z.string().describe('Specific, actionable study goals for the week, focusing on skills to develop and leveraging strengths. Presented as bullet points.'),
  linkedinTips: z.string().describe('Actionable LinkedIn networking tips and profile improvement suggestions for the week, tailored to the career goal. Presented as bullet points.'),
  mockInterviewPrep: z.string().describe('Tasks and focus areas for mock interview preparation for the week, relevant to the career goal. Presented as bullet points.'),
});

const FourWeekPlanOutputSchema = z.object({
  planTitle: z.string().describe("A catchy and motivational title for the 4-week plan, tailored to the user's career goal."),
  weeks: z.array(WeeklyPlanSchema).length(4).describe('A detailed 4-week plan, with specific tasks for each week covering study, LinkedIn, and mock interviews.'),
});
export type FourWeekPlanOutput = z.infer<typeof FourWeekPlanOutputSchema>;

export async function generateFourWeekPlan(input: FourWeekPlanInput): Promise<FourWeekPlanOutput> {
  return fourWeekPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fourWeekPlanPrompt',
  input: {schema: FourWeekPlanInputSchema},
  output: {schema: FourWeekPlanOutputSchema},
  prompt: `You are an expert career coach. Based on the user's profile below, generate a comprehensive and actionable 4-week study and networking plan to help them achieve their career goal.

User's Career Goal: {{careerGoal}}

Leverage these insights from their resume analysis:
Current Strengths:
{{{currentStrengths}}}

Areas for Improvement:
{{{areasForImprovement}}}

Key Skills to Develop:
{{{skillsToDevelop}}}

Create a catchy and motivational title for this 4-week plan.

For each of the four weeks, provide clear, concise, and actionable advice as bullet points for the following categories:
1.  **Study Goals**: Focus on acquiring the 'Skills to Develop'. Suggest specific resources or types of activities if possible (e.g., "Complete 2 modules of an online course on [Skill]", "Read 3 articles on [Topic]", "Practice [Skill] by building a small project").
2.  **LinkedIn Tips**: Include profile enhancements, content strategy, networking outreach (e.g., "Update LinkedIn headline to reflect [careerGoal]", "Share an article about [Industry Trend] and add your insights", "Connect with 5 professionals in [Target Role/Industry] with personalized messages").
3.  **Mock Interview Prep**: Detail specific question types to practice, research areas, or behavioral aspects (e.g., "Prepare 3 STAR method stories for behavioral questions related to [Skill]", "Research common technical questions for [Target Role]", "Practice your 'Tell me about yourself' pitch focusing on [careerGoal]").

Ensure the output strictly follows the provided schema, resulting in an array of 4 distinct weekly plans, each with bulleted lists for studyGoals, linkedinTips, and mockInterviewPrep.
`,
});

const fourWeekPlanFlow = ai.defineFlow(
  {
    name: 'fourWeekPlanFlow',
    inputSchema: FourWeekPlanInputSchema,
    outputSchema: FourWeekPlanOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate 4-week plan from AI.");
    }
    // Ensure each week has a weekNumber if not provided by AI (though schema implies it)
    if (output.weeks && output.weeks.length === 4) {
      output.weeks.forEach((week, index) => {
        if (week.weekNumber === undefined) {
          week.weekNumber = index + 1;
        }
      });
    }
    return output;
  }
);
