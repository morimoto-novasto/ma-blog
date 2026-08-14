import { useEffect } from 'react';

/**
 * Progressive disclosure of chrome while reading.
 * After a short scroll into the article, chrome fades — reducing extraneous load (Sweller).
 * Press `f` to force focus; move mouse to top to recover.
 */
export default function FocusMode() {
  useEffect(() => {
    let forced = false;
    let idleTimer = 0;

    const setFocus = (on: boolean) => {
      document.body.classList.toggle('is-focus', on);
    };

    const onScroll = () => {
      if (forced) return;
      const article = document.querySelector('[data-article]');
      if (!article) return;
      const top = article.getBoundingClientRect().top;
      setFocus(top < -80 && window.scrollY > 180);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'f' || e.key === 'F') {
        forced = !forced;
        setFocus(forced || window.scrollY > 180);
      }
      if (e.key === 'Escape') {
        forced = false;
        setFocus(false);
      }
      document.body.classList.add('show-kbd');
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => document.body.classList.remove('show-kbd'), 1600);
    };

    const onMove = (e: MouseEvent) => {
      if (e.clientY < 56) {
        forced = false;
        setFocus(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousemove', onMove);
      window.clearTimeout(idleTimer);
      document.body.classList.remove('is-focus', 'show-kbd');
    };
  }, []);

  return null;
}
