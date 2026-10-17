import { FunctionsHttpError } from "@supabase/supabase-js";

type FunctionErrorBody = {
  error?: string;
};

// supabase-js only reports "non-2xx status code"; the edge function's own message is in the response body.
export const toFunctionError = async (error: Error): Promise<Error> => {
  if (!(error instanceof FunctionsHttpError)) {
    return error;
  }
  const body: FunctionErrorBody = await error.context.json().catch(() => ({}));
  return new Error(body.error ?? error.message);
};
