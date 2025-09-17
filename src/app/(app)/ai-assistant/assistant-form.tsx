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
import { analyzeAction } from './actions';
import { Loader2, AlertTriangle, ShieldCheck, Wrench, Info, Copy } from 'lucide-react';
import type { AnalyzeOutput } from '@/ai/flows/analyze-flow';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  serverLogs: z.string().min(10, 'Server logs must be at least 10 characters.'),
  serverConfig: z
    .string()
    .min(10, 'Server configuration must be at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;


const SeverityIcon = ({ severity }: { severity: 'low' | 'medium' | 'high' }) => {
  switch (severity) {
    case 'high':
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case 'medium':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'low':
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const impactColor = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export function AssistantForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeOutput | null>(null);
  const { toast } = useToast();

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

    const result = await analyzeAction({
      serverLogs: data.serverLogs,
      serverConfig: data.serverConfig,
      goal: 'general analysis',
    });

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setAnalysisResult(result.data);
    }

    setIsLoading(false);
  };
  
  const handleCopy = (text: string, subject: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: `${subject} Copied`,
        description: "The command has been copied to your clipboard.",
    })
  }

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
        <div className="space-y-8">
          <Card className="bg-card/50 backdrop-blur-sm">
             <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
                <CardDescription>{analysisResult.summary}</CardDescription>
            </CardHeader>
          </Card>

          {analysisResult.findings && analysisResult.findings.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Findings</CardTitle>
                 <CardDescription>
                  Identified issues from logs and configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResult.findings.map(finding => (
                    <div key={finding.id} className="flex items-start gap-4 rounded-md border p-4">
                        <SeverityIcon severity={finding.severity} />
                        <div className="flex-1">
                           <p className="font-semibold">{finding.id}</p>
                           <p className="text-sm text-muted-foreground">{finding.evidence}</p>
                           {finding.requires_check && <Badge variant="outline" className="mt-2">Requires Check</Badge>}
                        </div>
                        <Badge variant="secondary" className="capitalize">{finding.type}</Badge>
                    </div>
                ))}
              </CardContent>
            </Card>
          )}

          {analysisResult.fixes && analysisResult.fixes.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Suggested Fixes</CardTitle>
                <CardDescription>
                  Actionable steps to resolve the identified issues.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResult.fixes.map(fix => (
                    <div key={fix.id} className="rounded-md border p-4">
                       <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <p className="font-semibold flex items-center gap-2">
                                  <Wrench className="h-4 w-4 text-primary"/>
                                  {fix.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">ID: {fix.id}</p>
                            </div>
                           <Badge className={cn("capitalize", impactColor[fix.impact])}>
                            {fix.impact} Impact
                           </Badge>
                       </div>
                       
                        {fix.bash && (
                             <div className="mt-4">
                                <Label className="text-xs">Bash</Label>
                                <div className="relative rounded-md bg-muted/50 p-3 font-mono text-xs mt-1">
                                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => handleCopy(fix.bash, 'Bash command')}>
                                        <Copy className="h-4 w-4"/>
                                        <span className="sr-only">Copy Bash Command</span>
                                    </Button>
                                    <pre className="overflow-auto whitespace-pre-wrap">{fix.bash}</pre>
                                </div>
                            </div>
                        )}
                         {fix.powershell && (
                             <div className="mt-2">
                                <Label className="text-xs">PowerShell</Label>
                                <div className="relative rounded-md bg-muted/50 p-3 font-mono text-xs mt-1">
                                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => handleCopy(fix.powershell, 'PowerShell command')}>
                                        <Copy className="h-4 w-4"/>
                                        <span className="sr-only">Copy PowerShell Command</span>
                                    </Button>
                                    <pre className="overflow-auto whitespace-pre-wrap">{fix.powershell}</pre>
                                </div>
                            </div>
                        )}
                        {fix.revert && (
                             <div className="mt-2">
                                <Label className="text-xs">Revert Command</Label>
                                <div className="relative rounded-md bg-muted/50 p-3 font-mono text-xs mt-1">
                                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => handleCopy(fix.revert, 'Revert command')}>
                                        <Copy className="h-4 w-4"/>
                                        <span className="sr-only">Copy Revert Command</span>
                                    </Button>
                                    <pre className="overflow-auto whitespace-pre-wrap">{fix.revert}</pre>
                                </div>
                            </div>
                        )}
                        {fix.references && fix.references.length > 0 && (
                             <div className="mt-3">
                                 <h4 className="text-xs font-semibold">References</h4>
                                 <ul className="list-disc list-inside text-xs mt-1">
                                    {fix.references.map((ref, i) => (
                                        <li key={i}><a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{ref}</a></li>
                                    ))}
                                 </ul>
                             </div>
                        )}
                    </div>
                ))}
              </CardContent>
            </Card>
          )}

        </div>
      )}
    </div>
  );
}
