import React, { forwardRef } from 'react';

import { cn } from '../utils';

import { ChatTypingProps } from './Chat.types';

/**
 * Typing indicator component for chat
 *
 * @example
 * ```tsx
 * <Chat.Typing users={['John', 'Jane']} />
 * <Chat.Typing isAI />
 * ```
 */
export const ChatTyping = forwardRef<HTMLDivElement, ChatTypingProps>(function ChatTyping(
  { users = [], isAI = false, className, renderTyping, ...props },
  ref,
) {
  if (users.length === 0 && !isAI && !renderTyping) {
    return null;
  }

  if (renderTyping) {
    return (
      <div ref={ref} className={className} {...props}>
        {renderTyping(users)}
      </div>
    );
  }

  if (isAI) {
    return (
      <div ref={ref} className={cn('flex items-center gap-3', className)} {...props}>
        <div className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-20" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        </div>
        <span className="text-sm font-medium text-blue-600 animate-pulse">AI is thinking...</span>
      </div>
    );
  }

  const typingText =
    users.length === 1
      ? `${users[0]} is typing...`
      : users.length === 2
        ? `${users[0]} and ${users[1]} are typing...`
        : `${users[0]} and ${users.length - 1} others are typing...`;

  return (
    <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
      {/* Typing Dots Animation */}
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
      </div>

      {/* Typing Text */}
      <span className="text-sm text-gray-500">{typingText}</span>
    </div>
  );
});
