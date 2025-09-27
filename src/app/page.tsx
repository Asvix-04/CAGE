'use client';

import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import AgentBuilderForm from '@/components/agent-builder-form';
import AgentPreview from '@/components/agent-preview';
import type { AgentData } from '@/lib/types';
import type { ShouldLimitResponseOutput } from '@/ai/flows/parameter-definition-assistance';

export default function Home() {
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ShouldLimitResponseOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="p-4 border-b border-border/40 bg-card/20 backdrop-blur-lg sticky top-0 z-20">
        <div className="container mx-auto flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-foreground">
            AgentForge
          </h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <AgentBuilderForm
              setAgentData={setAgentData}
              setIsLoading={setIsLoading}
              setAnalysis={setAnalysis}
              key={agentData ? 'loaded' : 'initial'} // Re-mount form on successful creation
            />
          </div>
          <div className="lg:col-span-2 sticky top-24">
            <AgentPreview
              agentData={agentData}
              isLoading={isLoading}
              setAnalysis={setAnalysis}
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
