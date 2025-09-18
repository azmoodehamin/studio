
'use server';

import {
  plan,
} from '@/ai/flows/plan-flow';
import { PlanInputSchema, type PlanInput, type PlanOutput } from '@/types';

export async function planAction(
  input: PlanInput
): Promise<{ data: PlanOutput | null; error: string | null }> {
  const parsed = PlanInputSchema.safeParse(input);
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
