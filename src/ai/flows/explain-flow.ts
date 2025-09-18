
'use server';

/**
 * @fileOverview AI flow to explain a specific finding or suggested command.
 *
 * - explain - A function that handles the explanation process.
 */

import { ai } from '@/ai/genkit';
import { ExplainInputSchema, ExplainOutputSchema, type ExplainInput, type ExplainOutput } from '@/types';


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
