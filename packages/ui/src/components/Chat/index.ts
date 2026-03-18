import { ChatContainer } from './ChatContainer';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatTyping } from './ChatTyping';

export * from './Chat.types';

/**
 * Chat component for creating messaging interfaces
 * 
 * @example
 * ```tsx
 * import { Chat } from '@vdailyapp/ui';
 * 
 * const messages = [
 *   {
 *     id: '1',
 *     content: 'Hello!',
 *     sender: { id: 'u1', name: 'John Doe', avatar: '/john.jpg' },
 *     timestamp: new Date(),
 *     isCurrentUser: false
 *   },
 *   {
 *     id: '2',
 *     content: 'Hi there!',
 *     sender: { id: 'u2', name: 'You', avatar: '/you.jpg' },
 *     timestamp: new Date(),
 *     isCurrentUser: true
 *   }
 * ];
 * 
 * function MyChat() {
 *   const handleSend = (message) => {
 *     console.log('Sending:', message);
 *   };
 * 
 *   return (
 *     <Chat.Container messages={messages} height="600px">
 *       <Chat.Input
 *         placeholder="Type a message..."
 *         onSend={handleSend}
 *       />
 *     </Chat.Container>
 *   );
 * }
 * ```
 */
export const Chat = {
  /**
   * Main chat container component
   */
  Container: ChatContainer,
  
  /**
   * Individual message component
   */
  Message: ChatMessage,
  
  /**
   * Message input component with send button
   */
  Input: ChatInput,
  
  /**
   * Typing indicator component
   */
  Typing: ChatTyping,
};
