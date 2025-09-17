'use server';

/**
 * @fileOverview An AI-powered configuration assistance tool for analyzing server logs and configurations.
 * This file is being replaced by analyze-flow.ts, explain-flow.ts, and plan-flow.ts.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeServerConfigInputSchema = z.object({
  serverLogs: z
    .string()
    .describe('The logs from the server to be analyzed.'),
  serverConfig: z
    .string()
    .describe('The current configuration of the server.'),
});
export type AnalyzeServerConfigInput = z.infer<typeof AnalyzeServerConfigInputSchema>;

const AnalyzeServerConfigOutputSchema = z.object({
  suggestedHardeningSettings: z
    .string()
    .describe('Suggested hardening settings for the server.'),
  troubleshootingSuggestions: z
    .string()
    .describe('Troubleshooting suggestions for the server.'),
});
export type AnalyzeServerConfigOutput = z.infer<typeof AnalyzeServerConfigOutputSchema>;

export async function analyzeServerConfig(
  input: AnalyzeServerConfigInput
): Promise<AnalyzeServerConfigOutput> {
  return analyzeServerConfigFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeServerConfigPrompt',
  input: {schema: AnalyzeServerConfigInputSchema},
  output: {schema: AnalyzeServerConfigOutputSchema},
  prompt: `You are an AI tool that analyzes server logs and configurations to suggest optimal hardening settings and troubleshoot issues.

  Analyze the following server logs and configuration and provide suggestions.

  Server Logs:
  {{serverLogs}}

  Server Configuration:
  {{serverConfig}}

  Based on the server logs and configuration, provide suggested hardening settings and troubleshooting suggestions to improve server security and performance.  Be concise and deterministic.
  `,
});

const analyzeServerConfigFlow = ai.defineFlow(
  {
    name: 'analyzeServerConfigFlow',
    inputSchema: AnalyzeServerConfigInputSchema,
    outputSchema: AnalyzeServerConfigOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
