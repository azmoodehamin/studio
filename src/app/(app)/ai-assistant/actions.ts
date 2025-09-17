'use server';

import {
  analyzeServerConfig,
  type AnalyzeServerConfigInput,
  type AnalyzeServerConfigOutput,
} from '@/ai/flows/ai-powered-configuration-assistance';
import { z } from 'zod';

const formSchema = z.object({
  serverLogs: z.string(),
  serverConfig: z.string(),
});

export async function analyzeServerConfigAction(
  input: AnalyzeServerConfigInput
): Promise<{ data: AnalyzeServerConfigOutput | null; error: string | null }> {
  const parsed = formSchema.safeParse(input);
  if (!parsed.success) {
    return { data: null, error: 'Invalid input.' };
  }

  try {
    const result = await analyzeServerConfig(parsed.data);
    return { data: result, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unexpected error occurred.' };
  }
}
