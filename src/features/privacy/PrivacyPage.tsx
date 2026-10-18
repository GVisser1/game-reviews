import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const LAST_UPDATED = "October 18, 2026";
const CONTACT_URL = "https://github.com/GVisser1";

type SectionProps = {
  title: string;
  children: ReactNode;
};

const Section = ({ title, children }: SectionProps): React.JSX.Element => (
  <section className="flex flex-col gap-2">
    <h2 className="text-xl font-bold">{title}</h2>
    {children}
  </section>
);

export const PrivacyPage = (): React.JSX.Element => (
  <main className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
    <Link to="/" className="self-start text-sm hover:underline">
      ← Home
    </Link>
    <h1 className="text-3xl font-bold">Privacy</h1>
    <p>
      Game Reviews is a personal project. This page explains what it stores about you, why, and how to delete it. Last
      updated {LAST_UPDATED}.
    </p>

    <Section title="What's stored">
      <ul className="flex list-disc flex-col gap-2 pl-5">
        <li>
          <strong>When you browse:</strong> an anonymous session, so the app can load games for you. It contains no name
          or other personal details. Your browser keeps it in local storage.
        </li>
        <li>
          <strong>When you sign in with Twitch:</strong> your Twitch account ID, display name, profile picture and the
          email address Twitch shares at sign-in. Your name and picture are shown next to your reviews. Your email is
          never shown and isn't used for anything else.
        </li>
        <li>
          <strong>Your ratings and reviews:</strong> shown publicly on each game&apos;s page with your name and picture.
          Your ratings also count towards each game&apos;s average rating.
        </li>
      </ul>
    </Section>

    <Section title="Who handles it">
      <ul className="flex list-disc flex-col gap-2 pl-5">
        <li>
          <strong>Supabase</strong> stores the data and runs sign-in and the server functions.
        </li>
        <li>
          <strong>Twitch</strong> handles signing in. Game information comes from <strong>IGDB</strong>, which Twitch
          owns. Searches go to IGDB through this app&apos;s server, without any personal details.
        </li>
        <li>
          <strong>Cloudflare Turnstile</strong> checks that you&apos;re not a bot when you first open the app. It looks
          at technical details of your browser and connection, such as your IP address, but not your account.
        </li>
      </ul>
    </Section>

    <Section title="Cookies and tracking">
      <p>
        There are no ads, no analytics and no tracking. The only thing stored in your browser is what&apos;s needed to
        keep you signed in.
      </p>
    </Section>

    <Section title="How long it's kept, and deleting it">
      <p>
        Your data is kept until you delete your account. You can do that yourself on the{" "}
        <Link to="/app/account" className="underline">
          Account page
        </Link>
        : it immediately deletes your profile, email address, ratings and reviews.
      </p>
      <p>
        To also remove the app&apos;s access to your Twitch account, disconnect it in Twitch under Settings →
        Connections.
      </p>
      <p>
        For anything else about your data, contact the developer via{" "}
        <a href={CONTACT_URL} className="underline">
          GitHub
        </a>
        .
      </p>
    </Section>
  </main>
);
