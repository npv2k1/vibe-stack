import React, { forwardRef, useEffect, useRef } from 'react';

import { cn } from '../utils';

import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { ChatContainerProps } from './Chat.types';

/**
 * Main Chat Container component
 *
 * @example
 * ```tsx
 * <Chat.Container messages={messages} height="500px">
 *   <Chat.Input onSend={handleSend} />
 * </Chat.Container>
 * ```
 */
export const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(function ChatContainer(
  {
    messages = [],
    children,
    className,
    height = '600px',
    showTyping = false,
    typingIndicator,
    autoScroll = true,
    onReactionClick,
    onReplyClick,
    onApplyCode,
    showReactions = true,
    showReplyButton = true,
    ...props
  },
  ref,
) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll, showTyping]);

  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      ref={ref}
      className={cn('flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm', className)}
      style={{ height: heightStyle }}
      {...props}
    >
      {/* Messages Area */}
      <div ref={containerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessageComponent
            key={message.id}
            message={message}
            isCurrentUser={message.isCurrentUser}
            showAvatar
            showTimestamp
            onReactionClick={onReactionClick}
            onReplyClick={onReplyClick}
            onApplyCode={onApplyCode}
            showReactions={showReactions}
            showReplyButton={showReplyButton}
          />
        ))}

        {showTyping && typingIndicator && <div className="flex items-center space-x-2">{typingIndicator}</div>}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area or Custom Children */}
      {children && <div className="border-t bg-gray-50 p-4">{children}</div>}
    </div>
  );
});
