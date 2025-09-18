'use server';

import {
  analyze,
  type AnalyzeInput,
  type AnalyzeOutput,
} from '@/ai/flows/analyze-flow';
import {
  explain,
  type ExplainInput,
  type ExplainOutput,
} from '@/ai/flows/explain-flow';
import { z } from 'zod';

const analyzeFormSchema = z.object({
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
  const parsed = analyzeFormSchema.safeParse(input);
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


const explainFormSchema = z.object({
    findingId: z.string(),
    context: z.object({
      os: z.string().optional(),
      role: z.string().optional(),
    }),
});

export async function explainAction(
  input: ExplainInput
): Promise<{ data: ExplainOutput | null; error: string | null }> {
    const parsed = explainFormSchema.safeParse(input);
    if (!parsed.success) {
        return { data: null, error: 'Invalid input.' };
    }

    try {
        const result = await explain(parsed.data);
        return { data: result, error: null };
    } catch (e: any) {
        console.error(e);
        return { data: null, error: e.message || 'An unexpected error occurred.' };
    }
}
