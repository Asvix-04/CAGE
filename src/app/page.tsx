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
  
  // This state is no longer used by AgentPreview, but we'll keep it for now
  // in case we want to re-introduce response analysis in a different way.
  const [analysis, setAnalysis] = useState<ShouldLimitResponseOutput | null>(null);

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
              // Pass a setter that does nothing for now
              setAnalysis={() => {}}
              key={agentData ? 'loaded' : 'initial'}
            />
          </div>
          <div className="lg:col-span-2 sticky top-24">
            <AgentPreview
              agentData={agentData}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}