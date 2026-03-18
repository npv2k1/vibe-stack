import React, { forwardRef, useState, KeyboardEvent, FormEvent, useRef, ClipboardEvent, useEffect } from 'react';

import { cn } from '../utils';
import { Button } from '../Button';
import { Command, CommandGroup, CommandItem, CommandList } from '../../shadcn/command';

import { ChatInputProps, ChatAttachment } from './Chat.types';

/**
 * Chat Input component with send button and slash command support
 *
 * @example
 * ```tsx
 * <Chat.Input
 *   placeholder="Type a message..."
 *   commands={[{ command: '/help', description: 'Show help' }]}
 *   onSend={(message) => console.log(message)}
 * />
 * ```
 */
export const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(function ChatInput(
  {
    placeholder = 'Type a message...',
    value: controlledValue,
    onChange,
    onSend,
    commands = [],
    onCommandSelect,
    className,
    disabled = false,
    maxLength = 1000,
    showSendButton = true,
    sendButtonContent,
    multiline = false,
    rows = 1,
    allowAttachments = true,
    onAttachmentsChange,
    maxFileSize = 10 * 1024 * 1024, // 10MB
    acceptedFileTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
    replyingTo,
    onCancelReply,
    ...props
  },
  ref,
) {
  const [internalValue, setInternalValue] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [showCommands, setShowCommands] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    // Show commands if the message starts with / and we have commands
    if (value.startsWith('/') && commands.length > 0 && !value.includes(' ')) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  }, [value, commands]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  };

  const processFiles = async (files: FileList | File[]): Promise<ChatAttachment[]> => {
    const fileArray = Array.from(files);
    const processedFiles: ChatAttachment[] = [];

    for (const file of fileArray) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize / 1024 / 1024}MB`);
        continue;
      }

      const attachment: ChatAttachment = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      };

      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        attachment.url = URL.createObjectURL(file);
      }

      processedFiles.push(attachment);
    }

    return processedFiles;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments = await processFiles(e.target.files);
      const updatedAttachments = [...attachments, ...newAttachments];
      setAttachments(updatedAttachments);
      onAttachmentsChange?.(updatedAttachments);
    }
  };

  const handlePaste = async (e: ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items || !allowAttachments) return;

    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      const newAttachments = await processFiles(files);
      const updatedAttachments = [...attachments, ...newAttachments];
      setAttachments(updatedAttachments);
      onAttachmentsChange?.(updatedAttachments);
    }
  };

  const removeAttachment = (id: string) => {
    const attachment = attachments.find((a) => a.id === id);
    if (attachment?.url) {
      URL.revokeObjectURL(attachment.url);
    }
    const updatedAttachments = attachments.filter((a) => a.id !== id);
    setAttachments(updatedAttachments);
    onAttachmentsChange?.(updatedAttachments);
  };

  const handleSend = () => {
    if ((value.trim() || attachments.length > 0) && onSend) {
      onSend(value.trim(), attachments.length > 0 ? attachments : undefined);
      if (!isControlled) {
        setInternalValue('');
      }
      onChange?.('');
      setAttachments([]);
      onAttachmentsChange?.([]);
      setShowCommands(false);
    }
  };

  const handleCommandSelect = (cmd: string) => {
    const newValue = cmd + ' ';
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    onCommandSelect?.(cmd);
    setShowCommands(false);
    // Focus back to input
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (showCommands) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        // The first command will be selected by cmdk default if we use it correctly
        // but since we want to handle it ourselves for better control:
        const matchingCommand = commands.find((c) => c.command.toLowerCase().startsWith(value.toLowerCase()));
        if (matchingCommand) {
          handleCommandSelect(matchingCommand.command);
        }
        return;
      }
      if (e.key === 'Escape') {
        setShowCommands(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Enter' && e.shiftKey && multiline) {
      // Allow Shift+Enter for new line in multiline mode
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey && multiline) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div ref={ref} className={cn('relative flex flex-col gap-2', className)} {...props}>
      {/* Slash Commands Suggestions */}
      {showCommands && (
        <div className="absolute bottom-full left-0 mb-2 w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl z-50">
          <Command className="w-full">
            <CommandList className="max-h-64 overflow-y-auto">
              <CommandGroup heading="Available Commands">
                {commands.map((cmd) => (
                  <CommandItem
                    key={cmd.command}
                    value={cmd.command}
                    onSelect={() => handleCommandSelect(cmd.command)}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
                  >
                    {cmd.icon && <span className="flex-shrink-0 text-gray-500">{cmd.icon}</span>}
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-gray-900 truncate">{cmd.command}</span>
                      <span className="text-xs text-gray-500 truncate">{cmd.description}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}

      {/* Reply Indicator */}
      {replyingTo && (
        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2 text-sm">
          <div className="flex-1">
            <div className="font-medium text-gray-700">Replying to {replyingTo.sender.name}</div>
            <div className="text-gray-600 truncate">{replyingTo.content}</div>
          </div>
          {onCancelReply && (
            <button onClick={onCancelReply} className="ml-2 p-1 hover:bg-gray-200 rounded" aria-label="Cancel reply">
              ✕
            </button>
          )}
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="relative group flex items-center gap-2 bg-gray-100 rounded-lg p-2 max-w-xs"
            >
              {attachment.type.startsWith('image/') && attachment.url ? (
                <img src={attachment.url} alt={attachment.name} className="h-20 w-20 object-cover rounded" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📎</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{attachment.name}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(attachment.size)}</div>
                  </div>
                </div>
              )}
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                aria-label="Remove attachment"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-1 items-end gap-2">
        {/* File Attachment Button */}
        {allowAttachments && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedFileTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className={cn(
                'p-2 rounded-lg hover:bg-gray-100 transition-colors',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
              aria-label="Attach file"
            >
              📎
            </button>
          </>
        )}

        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={cn(
              'flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors',
              'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
            )}
            aria-label="Message input"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={cn(
              'flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors',
              'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
            )}
            aria-label="Message input"
          />
        )}

        {showSendButton && (
          <Button
            type="submit"
            disabled={disabled || (!value.trim() && attachments.length === 0)}
            className="shrink-0"
            aria-label="Send message"
          >
            {sendButtonContent || 'Send'}
          </Button>
        )}
      </form>

      {maxLength && (
        <span className="text-xs text-gray-500">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
});
