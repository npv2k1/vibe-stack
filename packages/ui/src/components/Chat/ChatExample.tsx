import React, { useState } from 'react';

import { Chat } from './index';
import { ChatMessage } from './Chat.types';

/**
 * Example Chat component demonstrating usage
 */
export const ChatExample: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hey! How are you doing?',
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: false,
    },
    {
      id: '2',
      content: "I'm doing great! Just working on some new features.",
      sender: {
        id: 'user2',
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      timestamp: new Date(Date.now() - 3000000),
      isCurrentUser: true,
    },
    {
      id: '3',
      content: 'That sounds awesome! What are you building?',
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      timestamp: new Date(Date.now() - 2400000),
      isCurrentUser: false,
    },
    {
      id: '4',
      content: "A new chat component for our UI library. It's coming along nicely!",
      sender: {
        id: 'user2',
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      timestamp: new Date(Date.now() - 1800000),
      isCurrentUser: true,
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (message: string) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}`,
      content: message,
      sender: {
        id: 'user2',
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      timestamp: new Date(),
      isCurrentUser: true,
    };

    setMessages([...messages, newMessage]);

    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: ChatMessage = {
          id: `${Date.now() + 1}`,
          content: 'Thanks for your message! This is an automated response.',
          sender: {
            id: 'user1',
            name: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?img=1',
          },
          timestamp: new Date(),
          isCurrentUser: false,
        };
        setMessages((prev) => [...prev, response]);
      }, 2000);
    }, 500);
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Chat Component Example</h1>
      
      <Chat.Container
        messages={messages}
        height="500px"
        showTyping={isTyping}
        typingIndicator={<Chat.Typing users={['John Doe']} />}
      >
        <Chat.Input
          placeholder="Type your message..."
          onSend={handleSend}
          multiline
          rows={2}
          maxLength={500}
        />
      </Chat.Container>

      {/* Standalone Components Example */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Standalone Components</h2>
        
        <div className="space-y-4 rounded-lg border p-4">
          <Chat.Message
            message={{
              id: 'demo-1',
              content: 'This is a standalone message component',
              sender: {
                id: 'demo-user',
                name: 'Demo User',
              },
              timestamp: new Date(),
              isCurrentUser: false,
            }}
            showAvatar
            showTimestamp
          />

          <Chat.Message
            message={{
              id: 'demo-2',
              content: 'You can use it independently',
              sender: {
                id: 'current-user',
                name: 'You',
              },
              timestamp: new Date(),
              isCurrentUser: true,
            }}
            showAvatar
            showTimestamp
          />

          <Chat.Typing users={['Demo User', 'Another User']} />
        </div>
      </div>
    </div>
  );
};
