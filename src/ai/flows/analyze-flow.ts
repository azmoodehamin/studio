'use server';

/**
 * @fileOverview AI flow to analyze server logs and configuration based on a user's goal.
 * It identifies findings and suggests actionable fixes.
 *
 * - analyze - A function that handles the server analysis process.
 * - AnalyzeInput - The input type for the analyze function.
 * - AnalyzeOutput - The return type for the analyze function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { createAiSession, saveAnalysisResult, saveSessionUserInput } from '@/services/ai-sessions';
import type { Finding, Fix } from '@/types';


export const AnalyzeInputSchema = z.object({
  serverLogs: z.string().describe('The raw, masked logs from the server.'),
  serverConfig: z.string().describe('The raw, masked configuration from the server (e.g., wg0.conf, sysctl).'),
  goal: z.string().describe('The user\'s stated goal, e.g., "reduce RTT", "fix acme", "strict hardening".'),
  context: z.object({
    os: z.string().optional().describe('Operating System, e.g., "Ubuntu 22.04".'),
    role: z.string().optional().describe('Server role, e.g., "edge".'),
    region: z.string().optional().describe('Server region, e.g., "US: NY".'),
    plan: z.string().optional().describe('The name of the provisioning plan applied, e.g., "Standard WireGuard Edge".'),
  }).optional(),
});
export type AnalyzeInput = z.infer<typeof AnalyzeInputSchema>;

const FindingSchema = z.object({
    id: z.string().describe('A unique identifier for the finding, e.g., "F-ACME-HTTP01".'),
    type: z.enum(['misconfig', 'policy', 'perf', 'security']).describe('The category of the finding.'),
    severity: z.enum(['low', 'medium', 'high']).describe('The severity of the finding.'),
    evidence: z.string().describe('The evidence from the logs or config that supports the finding, e.g., "acme: connection refused :80".'),
    requires_check: z.boolean().describe('Set to true if the finding is uncertain and requires manual verification.'),
});

const FixSchema = z.object({
    id: z.string().describe('A unique identifier for the fix, e.g., "FX-UFW-80".'),
    title: z.string().describe('A short, descriptive title for the fix, e.g., "Open HTTP-01 temporarily".'),
    bash: z.string().describe('The bash command to apply the fix.'),
    powershell: z.string().describe('The PowerShell command to apply the fix.'),
    revert: z.string().describe('A command to revert the fix.'),
    impact: z.enum(['low', 'medium', 'high']).describe('The potential impact of applying the fix.'),
    references: z.array(z.string().url()).describe('A list of URLs for further documentation.'),
});

export const AnalyzeOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the analysis, e.g., "WireGuard up, ACME failing due to HTTP-01 port block."'),
  findings: z.array(FindingSchema).describe('A list of identified issues or potential improvements.'),
  fixes: z.array(FixSchema).describe('A list of actionable fixes for the findings.'),
  confidence: z.enum(['low', 'medium', 'high']).describe('The overall confidence in the analysis.'),
});
export type AnalyzeOutput = z.infer<typeof AnalyzeOutputSchema>;

export async function analyze(input: AnalyzeInput): Promise<AnalyzeOutput> {
  return analyzeFlow(input);
}

const systemPrompt = `You are the Server Provision Assistant for a VPN platform.
Return concise, actionable steps. Prefer minimal, safe changes.
Never output secrets or destructive commands.
When uncertain, set "requires_check": true.
Output must be valid JSON for the given schema.
Provide both bash and PowerShell when commands are requested.`;

const analyzePrompt = ai.definePrompt({
  name: 'analyzePrompt',
  system: systemPrompt,
  input: { schema: AnalyzeInputSchema },
  output: { schema: AnalyzeOutputSchema },
  prompt: `Context:
- OS: {{context.os}}, Role: {{context.role}}, Region: {{context.region}}, Plan: {{context.plan}}
Goal: {{goal}}

Inputs:
- Server Logs (masked): <<<LOGS_START>>>{{serverLogs}}<<<LOGS_END>>>
- Server Config (masked): <<<CONF_START>>>{{serverConfig}}<<<CONF_END>>>

Constraints:
- Idempotent fixes when possible.
- Use safe defaults and reference docs if needed.
`,
});

const analyzeFlow = ai.defineFlow(
  {
    name: 'analyzeFlow',
    inputSchema: AnalyzeInputSchema,
    outputSchema: AnalyzeOutputSchema,
  },
  async (input) => {
    // Note: The userId would typically come from the authenticated session.
    const fakeUserId = 'user_placeholder_123';
    const sessionId = await createAiSession(fakeUserId, input.goal || 'general analysis', input.context, 'gemini-1.5-flash');

    await saveSessionUserInput(sessionId, input);

    const startTime = Date.now();
    const { output } = await analyzePrompt(input);
    const latencyMs = Date.now() - startTime;

    if (output) {
      await saveAnalysisResult(sessionId, output, latencyMs);
    }
    
    return output!;
  }
);
