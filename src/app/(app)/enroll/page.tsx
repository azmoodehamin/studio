
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ShieldCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

type Enrollment = {
    token: string;
    status: 'Pending' | 'Completed';
    server: string;
    expires: string;
};

const bootstrapScript = `curl -sfL https://get.vpncommander.dev/enroll.sh | sudo sh -s -- \\
--token YOUR_TOKEN_HERE \\
--fingerprint ABC:123 \\
--name edge-us-east-1`;


const formSchema = z.object({
  serverName: z.string().min(1, 'Server name is required.'),
  region: z.string().min(1, 'Region is required.'),
  os: z.string().min(1, 'OS is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function EnrollPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serverName: '',
            region: '',
            os: '',
        }
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const newEnrollment: Enrollment = {
            token: `tok_${Math.random().toString(36).substring(2, 10)}`,
            status: 'Pending',
            server: data.serverName,
            expires: '10m',
        };
        setEnrollments(prev => [newEnrollment, ...prev]);
        toast({
            title: "Token Generated",
            description: `A new one-time token has been generated for ${data.serverName}.`,
        });
        form.reset();
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(bootstrapScript);
        toast({
            title: "Script Copied",
            description: "The bootstrap script has been copied to your clipboard.",
        })
    }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Enroll New Server</CardTitle>
                <CardDescription>Generate a one-time token to securely enroll a new server.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="serverName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Server Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., edge-us-east-1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Region/Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a region and role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="us-east-edge">🇺🇸 US East (Edge)</SelectItem>
                                            <SelectItem value="us-west-edge">🇺🇸 US West (Edge)</SelectItem>
                                            <SelectItem value="eu-central-relay">🇩🇪 EU Central (Relay)</SelectItem>
                                            <SelectItem value="eu-west-relay">🇬🇧 EU West (Relay)</SelectItem>
                                            <SelectItem value="ap-south-gateway">🇮🇳 AP South (Gateway)</SelectItem>
                                            <SelectItem value="ap-southeast-gateway">🇦🇺 AP Southeast (Gateway)</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                            <SelectItem value="ubuntu22">Ubuntu 22.04 LTS</SelectItem>
                                            <SelectItem value="debian12">Debian 12</SelectItem>
                                            <SelectItem value="rocky9">Rocky Linux 9</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Generate one-time token</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Bootstrap Script</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    <span>Includes fingerprint binding for security.</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative rounded-md bg-muted/50 p-4 font-mono text-sm">
                    <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7" onClick={handleCopy}>
                        <Copy className="h-4 w-4"/>
                        <span className="sr-only">Copy script</span>
                    </Button>
                    <pre className="overflow-auto whitespace-pre-wrap">{bootstrapScript}</pre>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-5">
        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Token</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Enrolled Server</TableHead>
                            <TableHead>Expires In</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {enrollments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No recent enrollments.
                                </TableCell>
                            </TableRow>
                        ) : (
                            enrollments.map((e, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-mono">{e.token}</TableCell>
                                    <TableCell><Badge variant={e.status === 'Pending' ? 'default' : 'secondary'}>{e.status}</Badge></TableCell>
                                    <TableCell>{e.server}</TableCell>
                                    <TableCell>{e.expires}</TableCell>
                                    <TableCell>
                                        {e.status === 'Pending' && <Button variant="destructive" size="sm">Revoke</Button>}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
