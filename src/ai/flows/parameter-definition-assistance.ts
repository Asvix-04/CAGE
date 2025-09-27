'use server';

/**
 * @fileOverview A flow to assist users in deciding whether to limit their agent's response based on defined parameters.
 *
 * - shouldLimitResponse - A function that determines if the agent's response should be limited.
 * - ShouldLimitResponseInput - The input type for the shouldLimitResponse function.
 * - ShouldLimitResponseOutput - The return type for the shouldLimitResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ShouldLimitResponseInputSchema = z.object({
  parameters: z
    .string()
    .describe('The defined parameters for the AI agent, such as tone, response length, areas of expertise, and knowledge boundaries.'),
  prompt: z.string().describe('The user prompt or question for the AI agent.'),
  agentResponse: z.string().describe('The AI agent’s generated response.'),
});
export type ShouldLimitResponseInput = z.infer<typeof ShouldLimitResponseInputSchema>;

const ShouldLimitResponseOutputSchema = z.object({
  shouldLimit: z
    .boolean()
    .describe(
      'Whether the agent’s response should be limited based on the defined parameters. True if the response is outside the defined scope, false otherwise.'
    ),
  reason: z.string().describe('The reason why the response should or should not be limited.'),
});
export type ShouldLimitResponseOutput = z.infer<typeof ShouldLimitResponseOutputSchema>;

export async function shouldLimitResponse(input: ShouldLimitResponseInput): Promise<ShouldLimitResponseOutput> {
  return shouldLimitResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'shouldLimitResponsePrompt',
  input: {schema: ShouldLimitResponseInputSchema},
  output: {schema: ShouldLimitResponseOutputSchema},
  prompt: `You are an AI assistant helping users determine if an AI agent’s response should be limited based on defined parameters.

Parameters: {{{parameters}}}
Prompt: {{{prompt}}}
Agent Response: {{{agentResponse}}}

Determine if the agent’s response is within the scope of the defined parameters. If the response is outside the scope, set shouldLimit to true and provide a reason. Otherwise, set shouldLimit to false and explain why it is within the scope.

Output your answer in JSON format.`,
});

const shouldLimitResponseFlow = ai.defineFlow(
  {
    name: 'shouldLimitResponseFlow',
    inputSchema: ShouldLimitResponseInputSchema,
    outputSchema: ShouldLimitResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

