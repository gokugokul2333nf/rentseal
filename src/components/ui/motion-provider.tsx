"use client";

import { MotionConfig } from "framer-motion";

/**
 * Honours the operating system's "reduce motion" setting for every Framer
 * Motion animation on the site.
 *
 * The `prefers-reduced-motion` block in globals.css only neutralises CSS
 * animations and transitions. Framer animates by writing inline styles from
 * JavaScript, so the reveals, staggers and count-ups ran at full strength for
 * users who had explicitly asked them not to.
 *
 * `reducedMotion="user"` makes Framer skip transform and opacity animations for
 * those users and jump straight to the final state, which is what they asked
 * for — the content still arrives, it just does not move.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
