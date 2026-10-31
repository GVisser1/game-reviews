import { PreviewSection } from "../../dev/PreviewSection";
import { SignInPrompt } from "../SignInPrompt";

export const title = "Sign-in prompt";
export const group = "Components";
export const description = "Asks visitors who aren't signed in to sign in, with a link that brings them back.";

const SignInPromptPreview = (): React.JSX.Element => (
  <PreviewSection title="Default">
    <SignInPrompt message="Sign in to rate this game." />
  </PreviewSection>
);

export default SignInPromptPreview;
