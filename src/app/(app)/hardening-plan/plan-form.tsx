
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { planAction } from './actions';
import { Loader2, Copy, ShieldCheck } from 'lucide-react';
import type { PlanOutput } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  level: z.enum(['moderate', 'strict']),
  os: z.string().min(1, 'OS is required.'),
  role: z.string().min(1, 'Role is required.'),
  features: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const impactColor = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export function HardeningPlanForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planResult, setPlanResult] = useState<PlanOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: 'moderate',
      os: 'Ubuntu 22.04',
      role: 'edge',
      features: 'wireguard, netdata',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setPlanResult(null);

    const result = await planAction({
      level: data.level,
      context: {
        os: data.os,
        role: data.role,
        features: data.features.split(',').map(f => f.trim()).filter(Boolean),
      }
    });

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setPlanResult(result.data);
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
          <CardTitle>Generate Hardening Plan</CardTitle>
          <CardDescription>
            Create a security hardening checklist based on your server's context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Hardening Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="moderate" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Moderate
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="strict" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Strict
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="gateway">Gateway</Keterangan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enabled Features</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., wireguard, netdata" {...field} />
                    </FormControl>
                     <CardDescription>Comma-separated list of features.</CardDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Plan
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
      
      {planResult && (
        <Card>
            <CardHeader>
                <CardTitle>Hardening Checklist</CardTitle>
                <CardDescription>Plan ID: {planResult.planId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {planResult.tasks.map(task => (
                    <div key={task.id} className="rounded-md border p-4">
                       <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <p className="font-semibold flex items-center gap-2">
                                  <ShieldCheck className="h-4 w-4 text-primary"/>
                                  {task.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">ID: {task.id}</p>
                            </div>
                           <Badge className={cn("capitalize", impactColor[task.impact])}>
                            {task.impact} Impact
                           </Badge>
                       </div>
                       
                        {task.bash && (
                             <div className="mt-4">
                                <Label className="text-xs">Bash Command</Label>
                                <div className="relative rounded-md bg-muted/50 p-3 font-mono text-xs mt-1">
                                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => handleCopy(task.bash, 'Bash command')}>
                                        <Copy className="h-4 w-4"/>
                                        <span className="sr-only">Copy Bash Command</span>
                                    </Button>
                                    <pre className="overflow-auto whitespace-pre-wrap">{task.bash}</pre>
                                </div>
                            </div>
                        )}
                         {task.powershell && (
                             <div className="mt-2">
                                <Label className="text-xs">PowerShell</Label>
                                <div className="relative rounded-md bg-muted/50 p-3 font-mono text-xs mt-1">
                                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => handleCopy(task.powershell, 'PowerShell command')}>
                                        <Copy className="h-4 w-4"/>
                                        <span className="sr-only">Copy PowerShell Command</span>
                                    </Button>
                                    <pre className="overflow-auto whitespace-pre-wrap">{task.powershell}</pre>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
      )}

    </div>
  );
}
