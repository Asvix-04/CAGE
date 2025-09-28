'use client';

import React from 'react';
import Image from 'next/image';
import { Bot, User, Wand2 } from 'lucide-react';
import type { AgentData } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Chatbot from './chatbot';

type AgentPreviewProps = {
  agentData: AgentData | null;
  isLoading: boolean;
};

export default function AgentPreview({ agentData, isLoading }: AgentPreviewProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!agentData) {
    return <EmptyState />;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center items-center">
        <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/20">
          <AvatarImage src={agentData.formValues.avatar} alt={agentData.formValues.agentName} data-ai-hint="abstract robot" />
          <AvatarFallback>
            <Bot className="h-10 w-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-2xl">{agentData.formValues.agentName}</CardTitle>
        <CardDescription className="italic">"{agentData.formValues.introductoryMessage}"</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2 text-primary">Agent Description</h4>
          <p className="text-sm text-muted-foreground">{agentData.agentDescription}</p>
        </div>
        <Chatbot
            agentName={agentData.formValues.agentName}
            contextData={agentData.contextData}
            introMessage={agentData.formValues.introductoryMessage}
          />
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="shadow-lg animate-pulse">
      <CardHeader className="text-center items-center">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-64 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-10 border-dashed">
      <div className="rounded-full border-4 border-dashed border-border p-6">
        <Wand2 className="h-16 w-16 text-muted-foreground" />
      </div>
      <CardTitle className="mt-6 font-headline text-xl">Agent Preview</CardTitle>
      <CardDescription className="mt-2">Your generated AI agent will appear here once it's been forged.</CardDescription>
    </Card>
  );
}