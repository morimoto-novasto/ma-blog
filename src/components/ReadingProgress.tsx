import { useEffect, useRef } from 'react';

/**
 * Peak–end aware reading progress.
 * Progress eases slightly near the end so the finish feels quicker (HCI + Kahneman).
 */
export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = document.querySelector<HTMLDivElement>('[data-progress]');
    if (!bar) return;

    const easeNearEnd = (t: number) => {
      // ease-out cubic that accelerates perceived completion in the last 20%
      if (t < 0.8) return t * 0.92;
      const local = (t - 0.8) / 0.2;
      return 0.736 + (1 - Math.pow(1 - local, 3)) * 0.264;
    };

    const update = () => {
      const article = document.querySelector<HTMLElement>('[data-article]');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const raw = total <= 0 ? 1 : scrolled / total;
      bar.style.width = `${easeNearEnd(raw) * 100}%`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return <div ref={barRef} hidden />;
}
