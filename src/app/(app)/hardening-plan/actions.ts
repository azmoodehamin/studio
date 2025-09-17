'use server';

import {
  plan,
  type PlanInput,
  type PlanOutput,
} from '@/ai/flows/plan-flow';
import { z } from 'zod';

const formSchema = z.object({
  level: z.enum(['moderate', 'strict']),
  context: z.object({
    os: z.string(),
    role: z.string(),
    features: z.array(z.string()),
  }),
});

export async function planAction(
  input: PlanInput
): Promise<{ data: PlanOutput | null; error: string | null }> {
  const parsed = formSchema.safeParse(input);
  if (!parsed.success) {
    return { data: null, error: 'Invalid input.' };
  }

  try {
    const result = await plan(parsed.data);
    return { data: result, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unexpected error occurred.' };
  }
}
