'use client';

import React, { useState, useTransition, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrainCircuit, Loader2, Send, User } from 'lucide-react';

import { chatWithAgentAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { chatWithAgentSchema, type ChatWithAgentValues } from '@/lib/schemas';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

type Message = {
  role: 'user' | 'agent';
  content: string;
};

type ChatbotProps = {
  agentName: string;
  contextData: string;
  introMessage: string;
};

export default function Chatbot({ agentName, contextData, introMessage }: ChatbotProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', content: introMessage },
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<{ question: string }>({
    resolver: zodResolver(chatWithAgentSchema.pick({ question: true })),
    defaultValues: {
      question: '',
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const onSubmit = (values: { question: string }) => {
    const userMessage: Message = { role: 'user', content: values.question };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    startTransition(async () => {
      const chatValues: ChatWithAgentValues = {
        contextData,
        question: values.question,
      };
      const result = await chatWithAgentAction(chatValues);
      if (result.success) {
        const agentMessage: Message = { role: 'agent', content: result.data.answer };
        setMessages((prev) => [...prev, agentMessage]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        // Remove the user's message if the API call fails
        setMessages((prev) => prev.slice(0, prev.length - 1));
      }
    });
  };

  return (
    <div className="space-y-4 pt-4 border-t">
       <h3 className="text-lg font-semibold flex items-center gap-2">
        <BrainCircuit className="text-primary h-5 w-5" />
        Chat with {agentName}
      </h3>
      <div className="p-4 border rounded-lg space-y-4 bg-background/50">
        <ScrollArea className="h-64 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'agent' && (
                  <div className="bg-primary text-primary-foreground p-2 rounded-full">
                    <BrainCircuit className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary/20 text-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                 {message.role === 'user' && (
                  <div className="bg-muted text-foreground p-2 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
             {isPending && (
                <div className="flex items-start gap-3">
                   <div className="bg-primary text-primary-foreground p-2 rounded-full">
                    <BrainCircuit className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg px-3 py-2 text-sm bg-muted flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
          </div>
        </ScrollArea>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Ask a question..."
                        {...field}
                        autoComplete="off"
                        disabled={isPending}
                      />
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
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
