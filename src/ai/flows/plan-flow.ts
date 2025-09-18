
'use server';
/**
 * @fileOverview AI flow to generate a hardening checklist based on a desired security level and server context.
 *
 * - plan - A function that handles the plan generation process.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { PlanInputSchema, PlanOutputSchema, type PlanInput, type PlanOutput } from '@/types';
import { createAiSession, savePlanResult, saveSessionUserInput } from '@/services/ai-sessions';


export async function plan(input: PlanInput): Promise<PlanOutput> {
    return planFlow(input);
}

const systemPrompt = `You are the Server Provision Assistant for a VPN platform.
Return concise, actionable steps. Prefer minimal, safe changes.
Never output secrets or destructive commands.
When uncertain, set "requires_check": true.
Output must be valid JSON for the given schema.
Provide both bash and PowerShell when commands are requested.`;


const planPrompt = ai.definePrompt({
    name: 'planPrompt',
    system: systemPrompt,
    input: { schema: PlanInputSchema },
    output: { schema: PlanOutputSchema },
    prompt: `Context: OS {{context.os}}, Role {{context.role}}, Level {{level}}, Features {{context.features}}
Return a hardened checklist with explicit commands.`,
    model: googleAI.model('gemini-1.5-pro'),
});

const planFlow = ai.defineFlow(
    {
        name: 'planFlow',
        inputSchema: PlanInputSchema,
        outputSchema: PlanOutputSchema,
    },
    async (input) => {
        // Note: The userId would typically come from the authenticated session.
        const fakeUserId = 'user_placeholder_123';
        const goal = `Generate ${input.level} hardening plan.`;
        const sessionId = await createAiSession(fakeUserId, goal, input.context, 'gemini-1.5-pro');

        await saveSessionUserInput(sessionId, input);

        const startTime = Date.now();
        const { output } = await planPrompt(input);
        const latencyMs = Date.now() - startTime;
        
        if (output) {
          if (!output.planId) {
            output.planId = `hp_${Math.random().toString(36).substring(2, 8)}`;
          }
          await savePlanResult(sessionId, output, latencyMs);
        }

        return output!;
    }
);
