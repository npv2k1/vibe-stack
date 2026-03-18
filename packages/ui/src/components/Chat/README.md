# Chat Component

A flexible and customizable chat component for building messaging interfaces in your React applications.

## Features

- 📱 **Responsive Design** - Works seamlessly on all screen sizes
- 🎨 **Customizable** - Fully styled with Tailwind CSS, easy to customize
- 🔄 **Auto-scroll** - Automatically scrolls to the latest message
- 👤 **Avatar Support** - Display user avatars with messages
- ⌨️ **Typing Indicator** - Show when users are typing
- 🎯 **Compound Components** - Flexible API using compound component pattern
- ♿ **Accessible** - Built with accessibility in mind

## Installation

The Chat component is part of `@vdailyapp/ui`:

```bash
npm install @vdailyapp/ui
# or
pnpm add @vdailyapp/ui
# or
yarn add @vdailyapp/ui
```

## Basic Usage

```tsx
import { Chat } from '@vdailyapp/ui';

function MyChat() {
  const messages = [
    {
      id: '1',
      content: 'Hello!',
      sender: { id: 'u1', name: 'John Doe', avatar: '/john.jpg' },
      timestamp: new Date(),
      isCurrentUser: false
    },
    {
      id: '2',
      content: 'Hi there!',
      sender: { id: 'u2', name: 'You', avatar: '/you.jpg' },
      timestamp: new Date(),
      isCurrentUser: true
    }
  ];

  const handleSend = (message) => {
    console.log('Sending:', message);
    // Add your message sending logic here
  };

  return (
    <Chat.Container messages={messages} height="600px">
      <Chat.Input
        placeholder="Type a message..."
        onSend={handleSend}
      />
    </Chat.Container>
  );
}
```

## Components

### Chat.Container

Main container component for the chat interface.

**Props:**

- `messages` (optional): Array of message objects to display
- `height` (optional): Height of the chat container (default: '600px')
- `showTyping` (optional): Whether to show typing indicator
- `typingIndicator` (optional): Custom typing indicator component
- `autoScroll` (optional): Auto-scroll to bottom on new messages (default: true)
- `className` (optional): Additional CSS classes

```tsx
<Chat.Container
  messages={messages}
  height="500px"
  showTyping={isTyping}
  typingIndicator={<Chat.Typing users={['John']} />}
>
  {/* Chat input or other components */}
</Chat.Container>
```

### Chat.Message

Individual message component.

**Props:**

- `message`: Message data object with `id`, `content`, `sender`, `timestamp`, and `isCurrentUser`
- `isCurrentUser` (optional): Whether this message is from the current user
- `showAvatar` (optional): Show avatar next to message (default: true)
- `showTimestamp` (optional): Show timestamp (default: true)
- `renderContent` (optional): Custom render function for message content
- `renderAvatar` (optional): Custom render function for avatar
- `className` (optional): Additional CSS classes

```tsx
<Chat.Message
  message={messageData}
  isCurrentUser={true}
  showAvatar
  showTimestamp
/>
```

### Chat.Input

Message input component with send button.

**Props:**

- `placeholder` (optional): Placeholder text (default: 'Type a message...')
- `value` (optional): Controlled input value
- `onChange` (optional): Callback when input value changes
- `onSend` (optional): Callback when message is sent
- `disabled` (optional): Disable the input
- `maxLength` (optional): Maximum message length (default: 1000)
- `showSendButton` (optional): Show send button (default: true)
- `sendButtonContent` (optional): Custom send button content
- `multiline` (optional): Allow multiline input
- `rows` (optional): Number of rows for multiline input
- `className` (optional): Additional CSS classes

```tsx
<Chat.Input
  placeholder="Type your message..."
  onSend={handleSend}
  multiline
  rows={2}
  maxLength={500}
/>
```

### Chat.Typing

Typing indicator component.

**Props:**

- `users` (optional): Array of user names who are typing
- `renderTyping` (optional): Custom render function for typing indicator
- `className` (optional): Additional CSS classes

```tsx
<Chat.Typing users={['John', 'Jane']} />
```

## Advanced Usage

### Custom Message Rendering

```tsx
<Chat.Message
  message={message}
  renderContent={(msg) => (
    <div>
      <strong>{msg.sender.name}:</strong>
      <p>{msg.content}</p>
    </div>
  )}
/>
```

### Custom Avatar

```tsx
<Chat.Message
  message={message}
  renderAvatar={(sender) => (
    <img
      src={sender.avatar}
      alt={sender.name}
      className="h-8 w-8 rounded-full"
    />
  )}
/>
```

### Controlled Input

```tsx
const [inputValue, setInputValue] = useState('');

<Chat.Input
  value={inputValue}
  onChange={setInputValue}
  onSend={(message) => {
    console.log(message);
    setInputValue(''); // Clear after sending
  }}
/>
```

### With Typing Indicator

```tsx
const [isTyping, setIsTyping] = useState(false);
const [typingUsers, setTypingUsers] = useState(['John']);

<Chat.Container
  messages={messages}
  showTyping={isTyping}
  typingIndicator={<Chat.Typing users={typingUsers} />}
>
  <Chat.Input onSend={handleSend} />
</Chat.Container>
```

## Styling

The Chat component uses Tailwind CSS for styling. You can customize the appearance by:

1. **Using className prop**: Pass custom classes to any component
2. **Tailwind config**: Extend your Tailwind configuration
3. **CSS overrides**: Override specific styles using CSS

```tsx
<Chat.Container className="border-2 border-blue-500 shadow-xl">
  <Chat.Input className="bg-gray-100" />
</Chat.Container>
```

## Accessibility

The Chat component includes:

- Proper ARIA labels for inputs and buttons
- Keyboard navigation support (Enter to send, Shift+Enter for new line in multiline mode)
- Screen reader-friendly timestamps and status indicators
- Semantic HTML structure

## TypeScript

Full TypeScript support with comprehensive type definitions:

```tsx
import { Chat, ChatMessage, ChatInputProps } from '@vdailyapp/ui';

const messages: ChatMessage[] = [...];
```

## Examples

See `ChatExample.tsx` for a complete working example with:
- Message sending
- Auto-responses
- Typing indicators
- Avatar integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
