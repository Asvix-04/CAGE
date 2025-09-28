import { z } from 'zod';

export const agentForgeFormSchema = z.object({
  agentName: z.string().min(2, "Agent name must be at least 2 characters.").max(50, "Agent name is too long."),
  avatar: z.any().optional(), // FileList, validated in component
  introductoryMessage: z.string().min(10, "Introductory message is too short.").max(500, "Message is too long."),
  uploadedData: z.string().min(50, "Please provide at least 50 characters of training data.").max(5000, "Training data is too long."),
  tone: z.string().min(3, "Tone description is too short.").max(100, "Tone is too long."),
  responseLength: z.string(),
  areasOfExpertise: z.string().min(10, "Areas of expertise is too short.").max(1000, "Description is too long."),
  knowledgeBoundaries: z.string().min(10, "Knowledge boundaries is too short.").max(1000, "Description is too long."),
});

export type AgentForgeFormValues = z.infer<typeof agentForgeFormSchema>;

export const agentForgeActionSchema = agentForgeFormSchema.extend({
  avatar: z.string().startsWith('data:image/', "Invalid image data URI."),
});

export const testAgentSchema = z.object({
  parameters: z.string(),
  prompt: z.string().min(1, "Prompt cannot be empty.").max(1000, "Prompt is too long."),
  agentResponse: z.string().min(1, "Agent response cannot be empty.").max(2000, "Response is too long."),
});

export type TestAgentValues = z.infer<typeof testAgentSchema>;

export const testCustomAgentSchema = z.object({
  contextData: z.string().min(1, "Context data cannot be empty."),
  question: z.string().min(1, "Question cannot be empty."),
});

export type TestCustomAgentValues = z.infer<typeof testCustomAgentSchema>;
