import type { ShouldLimitResponseOutput } from "@/ai/flows/parameter-definition-assistance";
import type { GenerateAgentOutput } from "@/ai/flows/instant-agent-generation";
import { AgentForgeFormValues } from "./schemas";

export type AgentData = {
  formValues: AgentForgeFormValues;
  agentDescription: GenerateAgentOutput['agentDescription'];
  contextData: string;
};

export type SetAgentData = React.Dispatch<React.SetStateAction<AgentData | null>>;
export type SetIsLoading = React.Dispatch<React.SetStateAction<boolean>>;
export type SetAnalysis = React.Dispatch<React.SetStateAction<ShouldLimitResponseOutput | null>>;
export type SetIsAnalyzing = React.Dispatch<React.SetStateAction<boolean>>;