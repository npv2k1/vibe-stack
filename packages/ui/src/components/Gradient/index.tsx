/** @jsxImportSource @emotion/react */
import React from 'react';
import styled from '@emotion/styled';

interface GradientProps {
  from: string;
  to: string;
  direction?: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

const GradientDiv = styled.div<{
  from: string;
  to: string;
  direction: string;
}>(({ from, to, direction }) => ({
  background: `linear-gradient(${direction}, ${from}, ${to})`,
}));

export const Gradient: React.FC<GradientProps> = ({ from, to, direction = 'to right', style, className, children }) => (
  <GradientDiv from={from} to={to} direction={direction} style={style} className={className} data-testid="gradient">
    {children}
  </GradientDiv>
);
