'use server';

/**
 * @fileOverview AI flow to explain a specific finding or suggested command.
 *
 * - explain - A function that handles the explanation process.
 * - ExplainInput - The input type for the explain function.
 * - ExplainOutput - The return type for the explain function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Finding, Fix } from '@/types';

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
    powershell: z.array(z.string()).optional().describe('Relevant PowerShell commands.'),
  }),
});
export type ExplainOutput = z.infer<typeof ExplainOutputSchema>;


export async function explain(input: ExplainInput): Promise<ExplainOutput> {
  return explainFlow(input);
}

const systemPrompt = `You are the Server Provision Assistant for a VPN platform.
Return concise, actionable steps. Prefer minimal, safe changes.
Never output secrets or destructive commands.
When uncertain, set "requires_check": true.
Output must be valid JSON for the given schema.
Provide both bash and PowerShell when commands are requested.`;


const explainPrompt = ai.definePrompt({
  name: 'explainPrompt',
  system: systemPrompt,
  input: { schema: ExplainInputSchema },
  output: { schema: ExplainOutputSchema },
  prompt: `Explain the finding with ID '{{findingId}}' in the context of a server with OS '{{context.os}}' and role '{{context.role}}'. Be clear and provide actionable advice.`,
});


const explainFlow = ai.defineFlow(
  {
    name: 'explainFlow',
    inputSchema: ExplainInputSchema,
    outputSchema: ExplainOutputSchema,
  },
  async (input) => {
    const { output } = await explainPrompt(input);
    return output!;
  }
);
