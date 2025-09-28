'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { UploadCloud, Sparkles, Loader2, Wand2, FileText } from 'lucide-react';
import { agentForgeFormSchema, type AgentForgeFormValues } from '@/lib/schemas';
import { forgeAgentAction } from '@/app/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { SetAgentData, SetIsLoading, SetAnalysis } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const fileToText = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


type AgentBuilderFormProps = {
  setAgentData: SetAgentData;
  setIsLoading: SetIsLoading;
  setAnalysis: SetAnalysis;
};

export default function AgentBuilderForm({ setAgentData, setIsLoading, setAnalysis }: AgentBuilderFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(PlaceHolderImages.find(p => p.id === 'default-avatar')?.imageUrl ?? null);
  const [fileName, setFileName] = useState<string>('');


  const form = useForm<AgentForgeFormValues>({
    resolver: zodResolver(agentForgeFormSchema),
    defaultValues: {
      agentName: '',
      introductoryMessage: '',
      uploadedData: undefined,
      tone: '',
      responseLength: 'medium',
      areasOfExpertise: '',
      knowledgeBoundaries: '',
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem('agent-forge-form');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Don't restore file inputs
        const { avatar, uploadedData, ...rest } = parsed;
        form.reset(rest);
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      // Don't save file inputs to local storage
      const { avatar, uploadedData, ...rest } = value;
      localStorage.setItem('agent-forge-form', JSON.stringify(rest));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (values: AgentForgeFormValues) => {
    setIsLoading(true);
    setAgentData(null);
    setAnalysis(null);

    startTransition(async () => {
      let avatarDataUri = PlaceHolderImages.find(p => p.id === 'default-avatar')?.imageUrl!;

      if (values.avatar && values.avatar.length > 0) {
        try {
          avatarDataUri = await toBase64(values.avatar[0]);
        } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not process avatar image.' });
          setIsLoading(false);
          return;
        }
      }
      
      let trainingData = '';
      if (values.uploadedData && values.uploadedData.length > 0) {
         try {
           trainingData = await fileToText(values.uploadedData[0]);
         } catch(e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not read the uploaded file.' });
            setIsLoading(false);
            return;
         }
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Please upload training data.' });
        setIsLoading(false);
        return;
      }


      const actionValues = { ...values, uploadedData: trainingData, avatar: avatarDataUri };

      const result = await forgeAgentAction(actionValues);
      
      if (result.success) {
        setAgentData({
          formValues: {
            ...values,
            avatar: avatarDataUri,
          },
          contextData: trainingData,
          agentDescription: result.data.agentDescription,
        });
        toast({ title: 'Success!', description: 'Your AI agent has been forged.' });
        form.reset();
        localStorage.removeItem('agent-forge-form');
        setAvatarPreview(PlaceHolderImages.find(p => p.id === 'default-avatar')?.imageUrl ?? null);
        setFileName('');
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
        setAgentData(null);
      }
      setIsLoading(false);
    });
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const field = form.getFieldState('avatar');
      if (field.error) {
         setAvatarPreview(null);
      } else {
        setAvatarPreview(URL.createObjectURL(file));
      }
    } else {
      setAvatarPreview(PlaceHolderImages.find(p => p.id === 'default-avatar')?.imageUrl ?? null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('uploadedData', e.target.files);
    } else {
      setFileName('');
      form.setValue('uploadedData', undefined);
    }
  };

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Create Your Agent</CardTitle>
        <CardDescription>Fill out the details below to forge your custom AI assistant.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-6">
              <h3 className="text-xl font-headline font-semibold flex items-center gap-2">
                <Wand2 className="text-primary h-5 w-5" />
                1. Customization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem className="md:col-span-1 flex flex-col items-center gap-2">
                        <FormLabel>Avatar</FormLabel>
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={avatarPreview ?? undefined} data-ai-hint="abstract robot" />
                          <AvatarFallback>
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept="image/png, image/jpeg, image/webp"
                            className="text-xs file:mr-2 file:text-xs"
                            onChange={(e) => {
                                field.onChange(e.target.files);
                                handleAvatarChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <div className="space-y-6 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="agentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agent Name</FormLabel>
                        <FormControl><Input placeholder="e.g., SupportBot 3000" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="introductoryMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Introductory Message</FormLabel>
                        <FormControl><Textarea placeholder="Hello! I'm here to help you with..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>
            
            <Separator />
            
            <section className="space-y-4">
              <h3 className="text-xl font-headline font-semibold flex items-center gap-2">
                <UploadCloud className="text-primary h-5 w-5" />
                2. Data Source
              </h3>
               <FormField
                  control={form.control}
                  name="uploadedData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Data</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            accept=".txt"
                            className="hidden"
                            id="file-upload"
                            onChange={handleFileChange}
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center w-full h-32 px-4 transition bg-transparent border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary/80 focus:outline-none"
                          >
                            {fileName ? (
                              <div className="flex items-center space-x-2 text-foreground">
                                <FileText className="h-6 w-6" />
                                <span className="font-medium">{fileName}</span>
                              </div>
                            ) : (
                              <span className="flex items-center space-x-2 text-muted-foreground">
                                <UploadCloud className="h-6 w-6" />
                                <span className="font-medium">Click to upload a .txt file</span>
                              </span>
                            )}
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Provide the knowledge base for your agent.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </section>
            
            <Separator />
            
            <section className="space-y-6">
              <h3 className="text-xl font-headline font-semibold flex items-center gap-2">
                <Sparkles className="text-primary h-5 w-5" />
                3. Behavior Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <FormControl><Input placeholder="Friendly and helpful" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="responseLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a length" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="areasOfExpertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas of Expertise</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Customer support for e-commerce, technical troubleshooting..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="knowledgeBoundaries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Knowledge Boundaries</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Should not discuss pricing, avoid making legal claims..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            
            <Button type="submit" size="lg" className="w-full font-bold text-lg" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Forge Agent
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}