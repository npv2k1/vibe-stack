import { ReactNode, HTMLAttributes, FormEvent } from 'react';

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}

export interface ChatReaction {
  emoji: string;
  count: number;
  users: string[];
  reacted?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date | string;
  isCurrentUser?: boolean;
  /** Whether the message is currently being streamed/typed by AI */
  isStreaming?: boolean;
  attachments?: ChatAttachment[];
  reactions?: ChatReaction[];
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
}

export interface ChatCommand {
  command: string;
  description: string;
  icon?: ReactNode;
}

export interface ChatContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Messages to display in the chat */
  messages?: ChatMessage[];
  /** Children components (for custom layouts) */
  children?: ReactNode;
  /** Custom className for the container */
  className?: string;
  /** Height of the chat container */
  height?: string | number;
  /** Whether to show typing indicator */
  showTyping?: boolean;
  /** Custom typing indicator component */
  typingIndicator?: ReactNode;
  /** Whether to auto-scroll to bottom on new messages */
  autoScroll?: boolean;
  /** Callback when reaction is clicked */
  onReactionClick?: (messageId: string, emoji: string) => void;
  /** Callback when reply is clicked */
  onReplyClick?: (message: ChatMessage) => void;
  /** Callback when "Apply Code" is clicked in a code block */
  onApplyCode?: (code: string, language?: string) => void;
  /** Show reactions on messages */
  showReactions?: boolean;
  /** Show reply button on messages */
  showReplyButton?: boolean;
}

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Message data to display */
  message?: ChatMessage;
  /** Whether this is the current user's message */
  isCurrentUser?: boolean;
  /** Custom className for the message */
  className?: string;
  /** Show avatar next to message */
  showAvatar?: boolean;
  /** Show timestamp on message */
  showTimestamp?: boolean;
  /** Custom render function for message content */
  renderContent?: (message: ChatMessage) => ReactNode;
  /** Custom render function for avatar */
  renderAvatar?: (sender: ChatMessage['sender']) => ReactNode;
  /** Children content (overrides message prop) */
  children?: ReactNode;
  /** Callback when reaction is clicked */
  onReactionClick?: (messageId: string, emoji: string) => void;
  /** Callback when reply is clicked */
  onReplyClick?: (message: ChatMessage) => void;
  /** Callback when "Apply Code" is clicked in a code block */
  onApplyCode?: (code: string, language?: string) => void;
  /** Show reactions */
  showReactions?: boolean;
  /** Show reply button */
  showReplyButton?: boolean;
}

export interface ChatInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Placeholder text for input */
  placeholder?: string;
  /** Value of the input (controlled) */
  value?: string;
  /** Callback when input value changes */
  onChange?: (value: string) => void;
  /** Callback when message is sent */
  onSend?: (message: string, attachments?: ChatAttachment[]) => void;
  /** List of available slash commands */
  commands?: ChatCommand[];
  /** Callback when a command is selected */
  onCommandSelect?: (command: string) => void;
  /** Custom className for the input container */
  className?: string;
  /** Disable the input */
  disabled?: boolean;
  /** Maximum length of message */
  maxLength?: number;
  /** Show send button */
  showSendButton?: boolean;
  /** Custom send button text/icon */
  sendButtonContent?: ReactNode;
  /** Whether to allow multiline input */
  multiline?: boolean;
  /** Number of rows for multiline input */
  rows?: number;
  /** Allow file attachments */
  allowAttachments?: boolean;
  /** Callback when files are attached */
  onAttachmentsChange?: (attachments: ChatAttachment[]) => void;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Accepted file types */
  acceptedFileTypes?: string[];
  /** Message being replied to */
  replyingTo?: ChatMessage;
  /** Callback when reply is cancelled */
  onCancelReply?: () => void;
}

export interface ChatTypingProps extends HTMLAttributes<HTMLDivElement> {
  /** Names of users currently typing */
  users?: string[];
  /** Whether the typing indicator is for an AI */
  isAI?: boolean;
  /** Custom className for typing indicator */
  className?: string;
  /** Custom render function for typing indicator */
  renderTyping?: (users: string[]) => ReactNode;
}
