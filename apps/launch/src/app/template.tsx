import { ViewTransition } from "react";

/**
 * Soft cross-fade between pages using React's <ViewTransition> (the browser
 * View Transitions API). Browsers without support navigate normally, and the
 * animation is disabled for visitors who prefer reduced motion (globals.css).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <ViewTransition>{children}</ViewTransition>;
}
