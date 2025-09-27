'use server';

import { generateAgent, type GenerateAgentOutput } from '@/ai/flows/instant-agent-generation';
import { shouldLimitResponse, type ShouldLimitResponseOutput } from '@/ai/flows/parameter-definition-assistance';
import { agentForgeActionSchema, testAgentSchema } from '@/lib/schemas';
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
