import { useEffect, useState } from 'react';

const keyFor = (id: string) => `ma:read:${id}`;

/**
 * Open-loop closure: restore scroll position for return visitors.
 * Cognitive load research: unfinished loops tax working memory between sessions.
 */
export default function ResumeReading({ noteId }: { noteId: string }) {
  const [offer, setOffer] = useState<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(keyFor(noteId));
    const saved = raw ? Number(raw) : 0;
    if (saved > 240) setOffer(saved);

    let ticking = false;
    const persist = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        localStorage.setItem(keyFor(noteId), String(window.scrollY));
        ticking = false;
      });
    };

    window.addEventListener('scroll', persist, { passive: true });
    return () => window.removeEventListener('scroll', persist);
  }, [noteId]);

  if (offer == null) return null;

  return (
    <div className="resume-toast" role="status">
      <p>前回の続きから読めます</p>
      <button
        type="button"
        onClick={() => {
          window.scrollTo({ top: offer, behavior: 'smooth' });
          setOffer(null);
        }}
      >
        再開
      </button>
      <button
        type="button"
        className="dismiss"
        aria-label="閉じる"
        onClick={() => {
          localStorage.removeItem(keyFor(noteId));
          setOffer(null);
        }}
      >
        ×
      </button>
    </div>
  );
}
