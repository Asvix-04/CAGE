'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Loader2, Send } from 'lucide-react';

import { answerQuestionAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { testCustomAgentSchema, type TestCustomAgentValues } from '@/lib/schemas';

export default function TestAgentPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [answer, setAnswer] = useState<string | null>(null);

  const form = useForm<TestCustomAgentValues>({
    resolver: zodResolver(testCustomAgentSchema),
    defaultValues: {
      contextData: '',
      question: '',
    },
  });

  const onSubmit = (values: TestCustomAgentValues) => {
    setAnswer(null);
    startTransition(async () => {
      const result = await answerQuestionAction(values);
      if (result.success) {
        setAnswer(result.data.answer);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Bot className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold font-headline text-foreground">
              Test Your Custom Agent
            </CardTitle>
          </div>
          <CardDescription>
            Provide context data and ask a question to see how the agent responds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="contextData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Context Data</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={8}
                        placeholder="Paste the data you want the agent to know about..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="e.g., What is the return policy?" {...field} />
                        <Button
                          type="submit"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          <span className="sr-only">Submit</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {(isPending || answer) && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-2">Agent's Answer</h3>
              {isPending && (
                <div className="flex items-center space-x-2">
                   <Loader2 className="h-5 w-5 animate-spin text-primary" />
                   <p className="text-muted-foreground">Generating answer...</p>
                </div>
              )}
              {answer && (
                <div className="p-4 bg-muted/50 rounded-lg text-sm">
                  {answer}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
