'use server';
/**
 * @fileOverview AI flow to generate a hardening checklist based on a desired security level and server context.
 *
 * - plan - A function that handles the plan generation process.
 * - PlanInput - The input type for the plan function.
 * - PlanOutput - The return type for the plan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { HardeningTask } from '@/types';
import { createAiSession, savePlanResult, saveSessionUserInput } from '@/services/ai-sessions';


export const PlanInputSchema = z.object({
  level: z.enum(['moderate', 'strict']).describe('The desired hardening level.'),
  context: z.object({
    os: z.string().describe('Operating System, e.g., "Ubuntu 22.04".'),
    role: z.string().describe('Server role, e.g., "edge".'),
    features: z.array(z.string()).describe('A list of features enabled on the server, e.g., ["wireguard"].'),
  }),
});
export type PlanInput = z.infer<typeof PlanInputSchema>;

export const PlanOutputSchema = z.object({
  planId: z.string().describe('A unique identifier for the generated plan, e.g., "hp_3a7b…"'),
  tasks: z.array(z.object({
    id: z.string().describe('A unique identifier for the task, e.g., "H-SSH-KeyOnly".'),
    title: z.string().describe('A short, descriptive title for the task, e.g., "SSH key-only".'),
    bash: z.string().describe('The bash command to perform the task.'),
    impact: z.enum(['low', 'medium', 'high']).describe('The potential impact of applying the task.'),
  })).describe('A checklist of hardening tasks with explicit commands.'),
});
export type PlanOutput = z.infer<typeof PlanOutputSchema>;


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
          output.planId = `hp_${Math.random().toString(36).substring(2, 8)}`;
          await savePlanResult(sessionId, output, latencyMs);
        }

        return output!;
    }
);
