'use server';

/**
 * @fileOverview A flow for instant AI agent generation based on uploaded data and defined parameters.
 *
 * - generateAgent - A function that generates the custom AI agent.
 * - GenerateAgentInput - The input type for the generateAgent function.
 * - GenerateAgentOutput - The return type for the generateAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAgentInputSchema = z.object({
  uploadedData: z
    .string()
    .describe('The uploaded data (text, documents, etc.) for training the AI agent.'),
  tone: z.string().describe('The desired tone of the AI agent (e.g., formal, informal, friendly).'),
  responseLength: z
    .string()
    .describe('The desired response length of the AI agent (e.g., short, medium, long).'),
  areasOfExpertise: z.string().describe('The areas of expertise for the AI agent.'),
  knowledgeBoundaries: z
    .string()
    .describe('The boundaries of the AI agent knowledge (what it should not discuss).'),
  agentName: z.string().describe('The name of the AI agent.'),
  avatar: z
    .string()
    .describe(
      'The avatar of the AI agent, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
  introductoryMessage: z.string().describe('The introductory message of the AI agent.'),
});

export type GenerateAgentInput = z.infer<typeof GenerateAgentInputSchema>;

const GenerateAgentOutputSchema = z.object({
  agentDescription: z.string().describe('A description of the generated AI agent.'),
});

export type GenerateAgentOutput = z.infer<typeof GenerateAgentOutputSchema>;

export async function generateAgent(input: GenerateAgentInput): Promise<GenerateAgentOutput> {
  return generateAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAgentPrompt',
  input: {schema: GenerateAgentInputSchema},
  output: {schema: GenerateAgentOutputSchema},
  prompt: `You are an AI agent generator.  You will generate a description of an AI agent based on the following parameters.

Uploaded Data: {{{uploadedData}}}
Tone: {{{tone}}}
Response Length: {{{responseLength}}}
Areas of Expertise: {{{areasOfExpertise}}}
Knowledge Boundaries: {{{knowledgeBoundaries}}}
Agent Name: {{{agentName}}}
Avatar: {{media url=avatar}}
Introductory Message: {{{introductoryMessage}}}

Describe the AI agent.`,
});

const generateAgentFlow = ai.defineFlow(
  {
    name: 'generateAgentFlow',
    inputSchema: GenerateAgentInputSchema,
    outputSchema: GenerateAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
