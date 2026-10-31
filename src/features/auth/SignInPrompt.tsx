import { SignInLink } from "./SignInLink";

type SignInPromptProps = {
  /** Says what signing in is for, like "Sign in to rate this game." */
  message: string;
};

export const SignInPrompt = ({ message }: SignInPromptProps): React.JSX.Element => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-small text-muted">{message}</span>
    <SignInLink />
  </div>
);
