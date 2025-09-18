
'use server';

/**
 * @fileOverview AI flow to analyze server logs and configuration based on a user's goal.
 * It identifies findings and suggests actionable fixes.
 *
 * - analyze - A function that handles the server analysis process.
 */

import { ai } from '@/ai/genkit';
import { createAiSession, saveAnalysisResult, saveSessionUserInput } from '@/services/ai-sessions';
import { AnalyzeInputSchema, AnalyzeOutputSchema, type AnalyzeInput, type AnalyzeOutput } from '@/types';

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
