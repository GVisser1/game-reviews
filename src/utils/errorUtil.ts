import { FunctionsHttpError } from "@supabase/supabase-js";

type FunctionErrorBody = {
  error?: string;
};

export const toErrorMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error));

// supabase-js only reports "non-2xx status code"; the edge function's own message is in the response body.
export const toFunctionError = async (error: Error): Promise<Error> => {
  if (!(error instanceof FunctionsHttpError)) {
    return error;
  }
  const body: FunctionErrorBody = await error.context.json().catch(() => ({}));
  return new Error(body.error ?? error.message);
};
