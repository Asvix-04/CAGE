'use server';

import { generateAgent, type GenerateAgentOutput } from '@/ai/flows/instant-agent-generation';
import { shouldLimitResponse, type ShouldLimitResponseOutput } from '@/ai/flows/parameter-definition-assistance';
import { answerQuestion, type AnswerQuestionInput } from '@/ai/flows/custom-agent';
import { agentForgeActionSchema, testAgentSchema, testCustomAgentSchema, chatWithAgentSchema, type ChatWithAgentValues } from '@/lib/schemas';
import { z } from 'zod';

export async function forgeAgentAction(
  values: z.infer<typeof agentForgeActionSchema>
): Promise<{ success: true; data: GenerateAgentOutput } | { success: false; error: string }> {
  const validatedFields = agentForgeActionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields.' };
  }

  try {
    const agentDescription = await generateAgent(validatedFields.data);
    return { success: true, data: agentDescription };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate agent. Please try again.' };
  }
}

export async function analyzeResponseAction(
  values: z.infer<typeof testAgentSchema>
): Promise<{ success: true; data: ShouldLimitResponseOutput } | { success: false; error: string }> {
  const validatedFields = testAgentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields.' };
  }

  try {
    const analysis = await shouldLimitResponse(validatedFields.data);
    return { success: true, data: analysis };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to analyze response. Please try again.' };
  }
}

export async function answerQuestionAction(values: AnswerQuestionInput) {
  const validatedFields = testCustomAgentSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields.' };
  }
  try {
    const result = await answerQuestion(validatedFields.data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get answer. Please try again.' };
  }
}

export async function chatWithAgentAction(values: ChatWithAgentValues) {
  const validatedFields = chatWithAgentSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields.' };
  }
  try {
    const result = await answerQuestion(validatedFields.data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get answer. Please try again.' };
  }
}