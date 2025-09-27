import type { ShouldLimitResponseOutput } from "@/ai/flows/parameter-definition-assistance";
import type { GenerateAgentOutput } from "@/ai/flows/instant-agent-generation";

export type AgentData = {
  formValues: {
    agentName: string;
    avatar: string; // data URI
    introductoryMessage: string;
    tone: string;
    responseLength: string;
    areasOfExpertise: string;
    knowledgeBoundaries: string;
  };
  agentDescription: GenerateAgentOutput['agentDescription'];
};

export type SetAgentData = React.Dispatch<React.SetStateAction<AgentData | null>>;
export type SetIsLoading = React.Dispatch<React.SetStateAction<boolean>>;
export type SetAnalysis = React.Dispatch<React.SetStateAction<ShouldLimitResponseOutput | null>>;
export type SetIsAnalyzing = React.Dispatch<React.SetStateAction<boolean>>;
