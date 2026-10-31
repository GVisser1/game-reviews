import { SignInLink } from "./SignInLink";

type SignInPromptProps = {
  message: string;
};

export const SignInPrompt = ({ message }: SignInPromptProps): React.JSX.Element => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-sm text-muted">{message}</span>
    <SignInLink />
  </div>
);
