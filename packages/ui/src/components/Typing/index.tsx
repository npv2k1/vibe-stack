import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

interface TypingProps {
  text: string;
  speed?: number; // milliseconds per character
  cursor?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const TypingWrapper = styled.span`
  display: inline-block;
  white-space: pre;
  font-family: inherit;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 1ch;
  animation: blink 1s steps(2, start) infinite;

  @keyframes blink {
    to {
      visibility: hidden;
    }
  }
`;

export const Typing: React.FC<TypingProps> = ({ text, speed = 50, cursor = true, className, style }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');

    const interval = setInterval(() => {
      setDisplayed((prev) => {
        if (prev.length < text.length) {
          return text.slice(0, prev.length + 1); // ← dùng slice, không cần biến i
        }
        clearInterval(interval); // ← dừng khi đủ
        return prev;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <TypingWrapper className={className} style={style} data-testid="typing">
      {displayed}
      {cursor && displayed.length < text.length && <Cursor>|</Cursor>}
    </TypingWrapper>
  );
};
