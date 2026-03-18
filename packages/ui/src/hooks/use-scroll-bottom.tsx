import { useCallback, useRef } from 'react';

export function useScrollBottom() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    if (!ref.current) return;
    const scroll = Number(ref.current?.scrollHeight) - Number(ref.current?.clientHeight);
    ref.current?.scrollTo(0, scroll + 2000);
  }, [ref]);

  return { ref, scrollToBottom };
}
