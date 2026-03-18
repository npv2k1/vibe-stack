'use client';
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
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
      }
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
