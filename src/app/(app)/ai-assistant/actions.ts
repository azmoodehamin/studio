
'use server';

import {
  analyze
} from '@/ai/flows/analyze-flow';
import {
  explain
} from '@/ai/flows/explain-flow';
import { AnalyzeInputSchema, type AnalyzeInput, type AnalyzeOutput, ExplainInputSchema, type ExplainInput, type ExplainOutput } from '@/types';

export async function analyzeAction(
  input: AnalyzeInput
): Promise<{ data: AnalyzeOutput | null; error: string | null }> {
  const parsed = AnalyzeInputSchema.safeParse(input);
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

export async function explainAction(
  input: ExplainInput
): Promise<{ data: ExplainOutput | null; error: string | null }> {
    const parsed = ExplainInputSchema.safeParse(input);
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
