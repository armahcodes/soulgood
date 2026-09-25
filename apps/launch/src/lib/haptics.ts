/**
 * A light tap of haptic feedback where supported (Android browsers). No-ops on
 * iOS/desktop and when the visitor prefers reduced motion.
 */
export function haptic(pattern: number | number[] = 8): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  navigator.vibrate(pattern);
}
