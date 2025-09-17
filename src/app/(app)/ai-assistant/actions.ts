'use server';

import {
  analyze,
  type AnalyzeInput,
  type AnalyzeOutput,
} from '@/ai/flows/analyze-flow';
import { z } from 'zod';

const formSchema = z.object({
  serverLogs: z.string(),
  serverConfig: z.string(),
  goal: z.string().optional(),
  context: z.object({
    os: z.string().optional(),
    role: z.string().optional(),
    region: z.string().optional(),
    plan: z.string().optional(),
  }).optional(),
});

export async function analyzeAction(
  input: AnalyzeInput
): Promise<{ data: AnalyzeOutput | null; error: string | null }> {
  const parsed = formSchema.safeParse(input);
  if (!parsed.success) {
    return { data: null, error: 'Invalid input.' };
  }

  try {
    const result = await analyze(parsed.data);
    return { data: result, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unexpected error occurred.' };
  }
}
