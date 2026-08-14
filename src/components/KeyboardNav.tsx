import { useEffect } from 'react';

/**
 * Expertise-reversal accelerators: j/k for adjacent notes (like vim / HN).
 * Novices never see friction; returners get speed.
 */
export default function KeyboardNav({
  prevHref,
  nextHref,
}: {
  prevHref?: string;
  nextHref?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'j' && nextHref) window.location.assign(nextHref);
      if (e.key === 'k' && prevHref) window.location.assign(prevHref);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prevHref, nextHref]);

  return null;
}
