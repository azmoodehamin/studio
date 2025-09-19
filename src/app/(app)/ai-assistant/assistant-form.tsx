
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { analyzeAction, explainAction } from './actions';
import { Loader2, AlertTriangle, ShieldCheck, Wrench, Info, Copy, HelpCircle } from 'lucide-react';
import type { ExplainOutput, Fix, Finding } from '@/types';


import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const formSchema = z.object({
  serverLogs: z.string().min(10, 'Server logs must be at least 10 characters.'),
  serverConfig: z
    .string()
    .min(10, 'Server configuration must be at least 10 characters.'),
  os: z.string().min(1, 'OS is required.'),
  role: z.string().min(1, 'Role is required.'),
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
  
  // State for streaming results
  const [summary, setSummary] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [confidence, setConfidence] = useState<string | null>(null);


  const { toast } = useToast();

  const [isExplainLoading, setIsExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);
  const [explainResult, setExplainResult] = useState<ExplainOutput | null>(null);
  const [isExplainDialogOpen, setIsExplainDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverLogs: '',
      serverConfig: '',
      os: 'Ubuntu 22.04',
      role: 'edge',
    },
  });
  
  const resetAnalysisState = () => {
    setSummary(null);
    setFindings([]);
    setFixes([]);
    setConfidence(null);
    setError(null);
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    resetAnalysisState();

    const result = await analyzeAction({
      serverLogs: data.serverLogs,
      serverConfig: data.serverConfig,
      goal: 'general analysis',
      context: {
        os: data.os,
        role: data.role,
      }
    });

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      // This simulates a stream for now. In a real stream, we would
      // append items as they arrive.
      setSummary(result.data.summary);
      setFindings(result.data.findings || []);
      setFixes(result.data.fixes || []);
      setConfidence(result.data.confidence);
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

  const handleExplain = async (findingId: string) => {
    setIsExplainLoading(true);
    setExplainError(null);
    setExplainResult(null);
    setIsExplainDialogOpen(true);

    const result = await explainAction({
      findingId,
      context: {
        os: form.getValues('os'),
        role: form.getValues('role'),
      }
    });

    if (result.error) {
      setExplainError(result.error);
    } else if (result.data) {
      setExplainResult(result.data);
    }
    setIsExplainLoading(false);
  };


  const hasResults = summary || findings.length > 0 || fixes.length > 0;

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
              <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="os"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating System</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an OS" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Ubuntu 22.04">Ubuntu 22.04</SelectItem>
                            <SelectItem value="Debian 12">Debian 12</SelectItem>
                            <SelectItem value="Rocky 9">Rocky 9</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server Role</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="edge">Edge</SelectItem>
                            <SelectItem value="relay">Relay</SelectItem>
                            <SelectItem value="gateway">Gateway</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

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

      {hasResults && (
        <div className="space-y-8">
          {summary && (
            <Card className="bg-card/50 backdrop-blur-sm">
               <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                  <CardDescription>{summary}</CardDescription>
              </CardHeader>
            </Card>
          )}

          {findings.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Findings</CardTitle>
                 <CardDescription>
                  Identified issues from logs and configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {findings.map(finding => (
                    <div key={finding.id} className="flex items-start gap-4 rounded-md border p-4">
                        <SeverityIcon severity={finding.severity} />
                        <div className="flex-1">
                           <p className="font-semibold">{finding.id}</p>
                           <p className="text-sm text-muted-foreground">{finding.evidence}</p>
                           {finding.requires_check && <Badge variant="outline" className="mt-2">Requires Check</Badge>}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant="secondary" className="capitalize">{finding.type}</Badge>
                            <Button variant="outline" size="sm" onClick={() => handleExplain(finding.id)}>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Explain
                            </Button>
                        </div>
                    </div>
                ))}
              </CardContent>
            </Card>
          )}

          {fixes.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Suggested Fixes</CardTitle>
                <CardDescription>
                  Actionable steps to resolve the identified issues.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fixes.map(fix => (
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

      <Dialog open={isExplainDialogOpen} onOpenChange={setIsExplainDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isExplainLoading ? 'Loading explanation...' : `Explanation for ${explainResult?.findingId}`}
            </DialogTitle>
          </DialogHeader>
          {isExplainLoading && <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
          {explainError && <p className="text-destructive">{explainError}</p>}
          {explainResult && (
            <div className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-4">
              <div>
                <h3 className="font-semibold mb-2">Explanation</h3>
                <p className="text-muted-foreground">{explainResult.explanation}</p>
              </div>

              {explainResult.risks.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Risks</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {explainResult.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                  </ul>
                </div>
              )}

              {explainResult.alternatives.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Alternatives</h3>
                   <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {explainResult.alternatives.map((alt, i) => <li key={i}>{alt}</li>)}
                  </ul>
                </div>
              )}

              {(explainResult.commands.bash?.length || explainResult.commands.powershell?.length) && (
                 <div>
                    <h3 className="font-semibold mb-2">Relevant Commands</h3>
                     {explainResult.commands.bash && explainResult.commands.bash.length > 0 && (
                        <div className="mt-2">
                            <Label className="text-xs">Bash</Label>
                             {explainResult.commands.bash.map((cmd, i) => (
                                <div key={i} className="relative rounded-md bg-muted/50 p-3 font-mono text-xs mt-1">
                                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => handleCopy(cmd, 'Bash command')}>
                                        <Copy className="h-4 w-4"/>
                                    </Button>
                                    <pre className="overflow-auto whitespace-pre-wrap">{cmd}</pre>
                                </div>
                            ))}
                        </div>
                    )}
                    {explainResult.commands.powershell && explainResult.commands.powershell.length > 0 && (
                        <div className="mt-2">
                            <Label className="text-xs">PowerShell</Label>
                             {explainResult.commands.powershell.map((cmd, i) => (
                                <div key={i} className="relative rounded-md bg-muted/50 p-3 font-mono text-xs mt-1">
                                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => handleCopy(cmd, 'PowerShell command')}>
                                        <Copy className="h-4 w-4"/>
                                    </Button>
                                    <pre className="overflow-auto whitespace-pre-wrap">{cmd}</pre>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

    
