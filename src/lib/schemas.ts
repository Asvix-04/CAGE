import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_TEXT_TYPES = ["text/plain"];

export const agentForgeFormSchema = z.object({
  agentName: z.string().min(2, "Agent name must be at least 2 characters.").max(50, "Agent name is too long."),
  avatar: z.any()
    .refine((files) => files?.length <= 1, "Only one avatar is allowed.")
    .refine((files) => !files || files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => !files || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, and .png files are accepted."
    )
    .optional(),
  introductoryMessage: z.string().min(10, "Introductory message is too short.").max(500, "Message is too long."),
  uploadedData: z.any()
    .refine((files) => files?.length == 1, "Training data file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_TEXT_TYPES.includes(files?.[0]?.type),
      "Only .txt files are accepted."
    ),
  tone: z.string().min(3, "Tone description is too short.").max(100, "Tone is too long."),
  responseLength: z.string(),
  areasOfExpertise: z.string().min(10, "Areas of expertise is too short.").max(1000, "Description is too long."),
  knowledgeBoundaries: z.string().min(10, "Knowledge boundaries is too short.").max(1000, "Description is too long."),
});

export type AgentForgeFormValues = z.infer<typeof agentForgeFormSchema>;

export const agentForgeActionSchema = agentForgeFormSchema.extend({
  avatar: z.string().startsWith('data:image/', "Invalid image data URI."),
  uploadedData: z.string().min(1, "Training data cannot be empty."),
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

export const chatWithAgentSchema = z.object({
  contextData: z.string(),
  question: z.string().min(1, "Question cannot be empty.").max(2000, "Question is too long."),
});

export type ChatWithAgentValues = z.infer<typeof chatWithAgentSchema>;