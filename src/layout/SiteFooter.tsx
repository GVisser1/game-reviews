import { Link } from "@tanstack/react-router";

export const SiteFooter = (): React.JSX.Element => (
  <footer className="border-t p-4 text-sm text-gray-600">
    <Link to="/privacy" className="hover:underline">
      Privacy
    </Link>
  </footer>
);
