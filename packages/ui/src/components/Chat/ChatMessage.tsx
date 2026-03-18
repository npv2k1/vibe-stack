import React, { forwardRef, useState } from 'react';

import { cn } from '../utils';
import { Avatar } from '../Avatar';
import { MarkdownPreview } from '../MarkdownPreview';

import { ChatMessageProps, ChatMessage as ChatMessageType } from './Chat.types';

/**
 * Individual Chat Message component
 *
 * @example
 * ```tsx
 * <Chat.Message
 *   message={messageData}
 *   isCurrentUser={true}
 *   showAvatar
 *   showTimestamp
 * />
 * ```
 */
export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(function ChatMessage(
  {
    message,
    isCurrentUser = false,
    className,
    showAvatar = true,
    showTimestamp = true,
    renderContent,
    renderAvatar,
    children,
    onReactionClick,
    onReplyClick,
    onApplyCode,
    showReactions = true,
    showReplyButton = true,
    ...props
  },
  ref,
) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  if (!message && !children) {
    return null;
  }

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleReactionClick = (emoji: string) => {
    if (message && onReactionClick) {
      onReactionClick(message.id, emoji);
    }
    setShowReactionPicker(false);
  };

  const defaultRenderContent = (msg: ChatMessageType) => {
    if (isCurrentUser) {
      return <div className="whitespace-pre-wrap">{msg.content}</div>;
    }
    return (
      <div className="flex flex-col gap-1">
        <MarkdownPreview value={msg.content} onApplyCode={onApplyCode} className="prose-sm !text-inherit" />
        {msg.isStreaming && <span className="inline-block h-4 w-1 animate-pulse bg-blue-500 ml-1 align-middle" />}
      </div>
    );
  };

  return (
    <div ref={ref} className={cn('flex gap-3', isCurrentUser ? 'flex-row-reverse' : 'flex-row', className)} {...props}>
      {/* Avatar */}
      {showAvatar && message && (
        <div className="flex-shrink-0">
          {renderAvatar ? (
            renderAvatar(message.sender)
          ) : message.sender.avatar ? (
            <Avatar src={message.sender.avatar} title={message.sender.name} size="sm" showBorder={false} />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
              {message.sender.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={cn('flex max-w-[85%] flex-col', isCurrentUser ? 'items-end' : 'items-start')}>
        {/* Sender Name (only for non-current user) */}
        {!isCurrentUser && message && (
          <span className="mb-1 text-xs font-medium text-gray-600">{message.sender.name}</span>
        )}

        {/* Message Bubble */}
        <div className="relative group w-full">
          <div
            className={cn(
              'break-words rounded-lg px-4 py-2 shadow-sm',
              isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900',
            )}
          >
            {/* Reply Indicator */}
            {message?.replyTo && (
              <div
                className={cn(
                  'mb-2 border-l-2 pl-2 text-xs opacity-75',
                  isCurrentUser ? 'border-white' : 'border-gray-400',
                )}
              >
                <div className="font-medium">{message.replyTo.senderName}</div>
                <div className="truncate">{message.replyTo.content}</div>
              </div>
            )}

            {/* Message Content */}
            {children || (message && (renderContent ? renderContent(message) : defaultRenderContent(message)))}

            {/* Attachments */}
            {message?.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className={cn(
                      'flex items-center gap-2 rounded border p-2 text-sm',
                      isCurrentUser ? 'border-white/20 bg-white/10' : 'border-gray-300 bg-white',
                    )}
                  >
                    {attachment.type.startsWith('image/') && attachment.url ? (
                      <img src={attachment.url} alt={attachment.name} className="max-h-48 rounded" />
                    ) : (
                      <>
                        <span className="font-medium">📎</span>
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{attachment.name}</div>
                          <div className="text-xs opacity-75">{formatFileSize(attachment.size)}</div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {message && (showReplyButton || showReactions) && !message.isStreaming && (
            <div className="absolute -top-2 right-2 hidden group-hover:flex items-center gap-1 bg-white rounded-full shadow-md border px-1 py-0.5">
              {showReactions && (
                <button
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className="p-1 hover:bg-gray-100 rounded text-sm"
                  aria-label="React to message"
                >
                  😊
                </button>
              )}
              {showReplyButton && onReplyClick && (
                <button
                  onClick={() => onReplyClick(message)}
                  className="p-1 hover:bg-gray-100 rounded text-sm"
                  aria-label="Reply to message"
                >
                  ↩️
                </button>
              )}
            </div>
          )}

          {/* Reaction Picker */}
          {showReactionPicker && (
            <div className="absolute top-0 right-0 mt-8 bg-white rounded-lg shadow-lg border p-2 flex gap-1 z-10">
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reactions Display */}
        {message?.reactions && message.reactions.length > 0 && showReactions && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction, idx) => (
              <button
                key={idx}
                onClick={() => handleReactionClick(reaction.emoji)}
                className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors',
                  reaction.reacted
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200',
                )}
              >
                <span>{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        {showTimestamp && message && (
          <span className="mt-1 text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
        )}
      </div>
    </div>
  );
});
