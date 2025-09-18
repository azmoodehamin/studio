
import { z } from 'zod';

export type Server = {
  id: string;
  hostname: string;
  region: string;
  role: 'edge' | 'relay' | 'gateway';
  status: 'Ready' | 'Provisioning' | 'Failed';
  engines: string[];
  public_ip: string;
  os: string;
  arch: string;
};

export type ProvisionRun = {
  id:string;
  serverId: string;
  serverHostname: string;
  plan: string;
  status: 'Ready' | 'Provisioning' | 'Failed' | 'Pending';
  startedAt: string;
  correlationId: string;
  steps: { name: string; status: 'Completed' | 'InProgress' | 'Failed' | 'Pending'; log: string }[];
};

export type ProvisionPlan = {
  id: string;
  name: string;
  steps: string[];
  osFamily: string;
  versionPins: { name: string; version: string }[];
  hardeningLevel: 'strict' | 'moderate';
};


// AI Assistant Schemas and Types

export const AnalyzeInputSchema = z.object({
  serverLogs: z.string().describe('The raw, masked logs from the server.'),
  serverConfig: z.string().describe('The raw, masked configuration from the server (e.g., wg0.conf, sysctl).'),
  goal: z.string().describe("The user's stated goal, e.g., \"reduce RTT\", \"fix acme\", \"strict hardening\"."),
  context: z.object({
    os: z.string().optional().describe('Operating System, e.g., "Ubuntu 22.04".'),
    role: z.string().optional().describe('Server role, e.g., "edge".'),
    region: z.string().optional().describe('Server region, e.g., "US: NY".'),
    plan: z.string().optional().describe('The name of the provisioning plan applied, e.g., "Standard WireGuard Edge".'),
  }).optional(),
});
export type AnalyzeInput = z.infer<typeof AnalyzeInputSchema>;

export const FindingSchema = z.object({
    id: z.string().describe('A unique identifier for the finding, e.g., "F-ACME-HTTP01".'),
    type: z.enum(['misconfig', 'policy', 'perf', 'security']).describe('The category of the finding.'),
    severity: z.enum(['low', 'medium', 'high']).describe('The severity of the finding.'),
    evidence: z.string().describe('The evidence from the logs or config that supports the finding, e.g., "acme: connection refused :80".'),
    requires_check: z.boolean().describe('Set to true if the finding is uncertain and requires manual verification.'),
});
export type Finding = z.infer<typeof FindingSchema>;

export const FixSchema = z.object({
    id: z.string().describe('A unique identifier for the fix, e.g., "FX-UFW-80".'),
    title: z.string().describe('A short, descriptive title for the fix, e.g., "Open HTTP-01 temporarily".'),
    bash: z.string().describe('The bash command to apply the fix.'),
    powershell: z.string().describe('The PowerShell command to apply the fix.'),
    revert: z.string().describe('A command to revert the fix.'),
    impact: z.enum(['low', 'medium', 'high']).describe('The potential impact of applying the fix.'),
    references: z.array(z.string().url()).describe('A list of URLs for further documentation.'),
});
export type Fix = z.infer<typeof FixSchema>;

export const AnalyzeOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the analysis, e.g., "WireGuard up, ACME failing due to HTTP-01 port block."'),
  findings: z.array(FindingSchema).describe('A list of identified issues or potential improvements.'),
  fixes: z.array(FixSchema).describe('A list of actionable fixes for the findings.'),
  confidence: z.enum(['low', 'medium', 'high']).describe('The overall confidence in the analysis.'),
});
export type AnalyzeOutput = z.infer<typeof AnalyzeOutputSchema>;


export const ExplainInputSchema = z.object({
  findingId: z.string().describe('The ID of the finding to explain, e.g., "F-ACME-HTTP01".'),
  context: z.object({
    os: z.string().optional().describe('Operating System, e.g., "Ubuntu 22.04".'),
    role: z.string().optional().describe('Server role, e.g., "edge".'),
  }),
});
export type ExplainInput = z.infer<typeof ExplainInputSchema>;

export const ExplainOutputSchema = z.object({
  findingId: z.string(),
  explanation: z.string().describe("A detailed explanation of the finding, e.g., \"HTTP-01 requires inbound TCP/80 from Let's Encrypt…\""),
  risks: z.array(z.string()).describe('Potential risks associated with the finding or its fix.'),
  alternatives: z.array(z.string()).describe('Alternative solutions or approaches.'),
  commands: z.object({
    bash: z.array(z.string()).optional().describe('Relevant bash commands.'),
    powershell: z.array(z_string()).optional().describe('Relevant PowerShell commands.'),
  }),
});
export type ExplainOutput = z.infer<typeof ExplainOutputSchema>;

export const PlanInputSchema = z.object({
  level: z.enum(['moderate', 'strict']).describe('The desired hardening level.'),
  context: z.object({
    os: z.string().describe('Operating System, e.g., "Ubuntu 22.04".'),
    role: z.string().describe('Server role, e.g., "edge".'),
    features: z.array(z.string()).describe('A list of features enabled on the server, e.g., ["wireguard"].'),
  }),
});
export type PlanInput = z.infer<typeof PlanInputSchema>;

export const HardeningTaskSchema = z.object({
    id: z.string().describe('A unique identifier for the task, e.g., "H-SSH-KeyOnly".'),
    title: z.string().describe('A short, descriptive title for the task, e.g., "SSH key-only".'),
    bash: z.string().describe('The bash command to perform the task.'),
    powershell: z.string().describe('The PowerShell command to apply the fix.'),
    impact: z.enum(['low', 'medium', 'high']).describe('The potential impact of applying the task.'),
  });
export type HardeningTask = z.infer<typeof HardeningTaskSchema>;

export const PlanOutputSchema = z.object({
  planId: z.string().describe('A unique identifier for the generated plan, e.g., "hp_3a7b…"'),
  tasks: z.array(HardeningTaskSchema).describe('A checklist of hardening tasks with explicit commands.'),
});
export type PlanOutput = z.infer<typeof PlanOutputSchema>;
