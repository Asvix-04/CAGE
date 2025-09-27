'use client';

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, XCircle, Bot, User, Beaker, Loader2 } from 'lucide-react';
import { testAgentSchema, type TestAgentValues } from '@/lib/schemas';
import { analyzeResponseAction } from '@/app/actions';
import type { AgentData, SetAnalysis, SetIsAnalyzing } from '@/lib/types';
import type { ShouldLimitResponseOutput } from '@/ai/flows/parameter-definition-assistance';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type AgentTesterProps = {
  agentData: AgentData;
  analysis: ShouldLimitResponseOutput | null;
  setAnalysis: SetAnalysis;
  isAnalyzing: boolean;
  setIsAnalyzing: SetIsAnalyzing;
};

export default function AgentTester({ agentData, analysis, setAnalysis, isAnalyzing, setIsAnalyzing }: AgentTesterProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<TestAgentValues>({
    resolver: zodResolver(testAgentSchema),
    defaultValues: { prompt: '', agentResponse: '', parameters: '' },
  });

  const onSubmit = (values: TestAgentValues) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    const { formValues } = agentData;
    const parametersString = `Tone: ${formValues.tone}, Response Length: ${formValues.responseLength}, Expertise: ${formValues.areasOfExpertise}, Boundaries: ${formValues.knowledgeBoundaries}`;
    
    startTransition(async () => {
      const result = await analyzeResponseAction({ ...values, parameters: parametersString });
      if (result.success) {
        setAnalysis(result.data);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
      setIsAnalyzing(false);
    });
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Beaker className="text-primary h-5 w-5" />
        Test Your Agent's Logic
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="p-4 border rounded-lg space-y-4 bg-background/50">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><User className="h-4 w-4" /> User Prompt</FormLabel>
                  <FormControl><Input placeholder="What is your return policy?" {...field} /></FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agentResponse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Bot className="h-4 w-4" /> Hypothetical Agent Response</FormLabel>
                  <FormControl><Textarea placeholder="We offer a 30-day return policy..." {...field} /></FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Beaker className="mr-2 h-4 w-4" />
            )}
            Analyze Response
          </Button>
        </form>
      </Form>
      
      {analysis && (
        <Alert variant={analysis.shouldLimit ? 'destructive' : 'default'} className="mt-4">
          {analysis.shouldLimit ? 
            <XCircle className="h-4 w-4" /> :
            <CheckCircle2 className="h-4 w-4" />
          }
          <AlertTitle>{analysis.shouldLimit ? "Outside Scope" : "Within Scope"}</AlertTitle>
          <AlertDescription>
            {analysis.reason}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
