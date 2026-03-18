# MarkdownPreview Component

A React component for rendering Markdown content with GitHub Flavored Markdown (GFM) support.

## Features

- ✅ **GitHub Flavored Markdown** - Tables, strikethrough, task lists, and more
- 🔒 **HTML Sanitization** - Built-in security with rehype-sanitize
- 🎨 **Tailwind Prose Styling** - Beautiful typography out of the box
- ⚙️ **Configurable** - Options for GFM and sanitization
- 📦 **TypeScript** - Full type safety
- ♿ **Accessible** - Semantic HTML output

## Installation

The component is part of the `@vdailyapp/ui` package:

```bash
npm install @vdailyapp/ui
# or
pnpm add @vdailyapp/ui
# or
yarn add @vdailyapp/ui
```

## Usage

### Basic Example

```tsx
import { MarkdownPreview } from '@vdailyapp/ui';

function MyComponent() {
  const markdown = `
# Hello World

This is **bold** text and this is *italic* text.

- Item 1
- Item 2
- Item 3
`;

  return <MarkdownPreview value={markdown} />;
}
```

### With GitHub Flavored Markdown

```tsx
import { MarkdownPreview } from '@vdailyapp/ui';

function TaskList() {
  const markdown = `
## My Tasks

- [x] Completed task
- [ ] Incomplete task

| Feature | Status |
|---------|--------|
| Tables  | ✓      |
| GFM     | ✓      |
`;

  return <MarkdownPreview value={markdown} enableGFM={true} />;
}
```

### Custom Styling

```tsx
import { MarkdownPreview } from '@vdailyapp/ui';

function StyledPreview() {
  return (
    <MarkdownPreview
      value="# Custom Styled Markdown"
      className="bg-gray-50 p-6 rounded-lg shadow-md"
    />
  );
}
```

### Without Sanitization (Use with caution!)

```tsx
import { MarkdownPreview } from '@vdailyapp/ui';

function UnsanitizedPreview() {
  return (
    <MarkdownPreview
      value="# Markdown with HTML"
      sanitize={false} // Only disable if you trust the content source
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Markdown content to be rendered |
| `className` | `string` | `undefined` | Additional CSS classes for the container |
| `enableGFM` | `boolean` | `true` | Enable GitHub Flavored Markdown features |
| `sanitize` | `boolean` | `true` | Enable HTML sanitization for security |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | Standard HTML div attributes |

## Supported Markdown Features

### Basic Syntax
- **Headings** (H1-H6)
- **Emphasis** (bold, italic)
- **Lists** (ordered and unordered)
- **Links**
- **Images**
- **Code blocks** (inline and fenced)
- **Blockquotes**
- **Horizontal rules**

### GitHub Flavored Markdown (GFM)
- **Tables**
- **Strikethrough** (~~text~~)
- **Task lists** (- [x] Done)
- **Automatic URL linking**

## Styling

The component uses Tailwind CSS prose classes for beautiful typography. The default styling includes:

- Responsive font sizes for headings
- Syntax highlighting-ready code blocks
- Styled tables with borders
- Formatted blockquotes
- Consistent spacing and line heights

### Customizing Styles

You can override the default styles by passing a `className`:

```tsx
<MarkdownPreview
  value={markdown}
  className="prose-sm max-w-2xl custom-class"
/>
```

## Security

The component includes HTML sanitization by default using `rehype-sanitize`. This prevents XSS attacks when rendering user-generated markdown content.

⚠️ **Important**: Only disable sanitization (`sanitize={false}`) if you fully trust the markdown source.

## Examples

### Complete Example

```tsx
import React, { useState } from 'react';
import { MarkdownPreview } from '@vdailyapp/ui';

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('# Hello\n\nStart typing...');

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2>Editor</h2>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-96 p-4 border rounded"
        />
      </div>
      <div>
        <h2>Preview</h2>
        <MarkdownPreview value={markdown} />
      </div>
    </div>
  );
}
```

## TypeScript

The component is fully typed. The main types are:

```typescript
type MarkdownPreviewProps = {
  value: string;
  className?: string;
  enableGFM?: boolean;
  sanitize?: boolean;
} & HTMLAttributes<HTMLDivElement>;
```

## Browser Support

The component works in all modern browsers that support React 18+.

## Dependencies

- `react` ^18.0.0
- `react-markdown` ^10.0.0
- `remark-gfm` ^4.0.0
- `rehype-sanitize` ^6.0.0

## License

Part of the vdaily-ui component library.
