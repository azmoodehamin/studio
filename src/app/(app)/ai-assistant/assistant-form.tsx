'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { analyzeServerConfigAction } from './actions';
import { Loader2, Server, ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  serverLogs: z.string().min(10, 'Server logs must be at least 10 characters.'),
  serverConfig: z
    .string()
    .min(10, 'Server configuration must be at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;
type AnalysisResult = {
  suggestedHardeningSettings: string;
  troubleshootingSuggestions: string;
} | null;

export function AssistantForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverLogs: '',
      serverConfig: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const result = await analyzeServerConfigAction(data);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setAnalysisResult(result.data);
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>AI-Powered Configuration Assistance</CardTitle>
          <CardDescription>
            Analyze server logs and configurations to get optimal hardening
            settings and troubleshooting advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="serverLogs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Logs</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your server logs here..."
                        className="min-h-[200px] font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serverConfig"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Configuration</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your server configuration (e.g., wg0.conf) here..."
                        className="min-h-[200px] font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Analyze
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">An Error Occurred</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex-row items-start gap-4">
              <ShieldCheck className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <CardTitle>Hardening Suggestions</CardTitle>
                <CardDescription>
                  Recommendations to improve server security.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap font-sans bg-muted/30 p-4 rounded-md">
                {analysisResult.suggestedHardeningSettings}
              </pre>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex-row items-start gap-4">
              <Server className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>
                  Suggestions to resolve potential issues.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap font-sans bg-muted/30 p-4 rounded-md">
                {analysisResult.troubleshootingSuggestions}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
