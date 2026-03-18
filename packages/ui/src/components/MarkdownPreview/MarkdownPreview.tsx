import React, { forwardRef, HTMLAttributes, Ref, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Copy, Check, Play } from 'lucide-react';

import { cn } from '../utils';
import { Button } from '../Button';

export type MarkdownPreviewProps = {
  /**
   * Markdown content to be rendered
   */
  value: string;
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
  /**
   * Whether to enable GitHub Flavored Markdown (tables, strikethrough, task lists, etc.)
   * @default true
   */
  enableGFM?: boolean;
  /**
   * Whether to sanitize HTML content
   * @default true
   */
  sanitize?: boolean;
  /**
   * Callback when "Apply Code" is clicked in a code block
   */
  onApplyCode?: (code: string, language?: string) => void;
} & HTMLAttributes<HTMLDivElement>;

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  onApplyCode?: (code: string, language?: string) => void;
}

const CodeBlock = ({ inline, className, children, onApplyCode }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (inline) {
    return <code className={cn('bg-gray-100 px-1 py-0.5 rounded text-sm font-mono', className)}>{children}</code>;
  }

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-900 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-800/50 px-4 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{language || 'text'}</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          {onApplyCode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onApplyCode(codeString, language)}
              className="h-7 w-7 p-0 text-gray-400 hover:bg-gray-700 hover:text-white"
              title="Apply to code"
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0 text-gray-400 hover:bg-gray-700 hover:text-white"
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Code */}
      <pre className={cn('m-0 overflow-x-auto p-4 text-sm leading-relaxed text-gray-100 font-mono', className)}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

/**
 * MarkdownPreview component renders markdown content with GitHub Flavored Markdown support
 *
 * @example
 * ```tsx
 * <MarkdownPreview value="# Hello World\n\nThis is **bold** text" />
 * ```
 */
export const MarkdownPreview = forwardRef(function MarkdownPreview(
  { value, className, enableGFM = true, sanitize = true, onApplyCode, ...props }: MarkdownPreviewProps,
  ref: Ref<HTMLDivElement>,
) {
  const remarkPlugins = enableGFM ? [remarkGfm] : [];
  const rehypePlugins = sanitize ? [rehypeSanitize] : [];

  return (
    <div
      ref={ref}
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        'prose-headings:font-semibold prose-headings:tracking-tight',
        'prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl',
        'prose-p:leading-7 prose-p:text-base',
        'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline',
        'prose-code:font-mono prose-code:text-sm',
        'prose-pre:p-0 prose-pre:bg-transparent',
        'prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic',
        'prose-ul:list-disc prose-ol:list-decimal',
        'prose-li:my-1',
        'prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:bg-gray-50',
        'prose-td:border prose-td:border-gray-300 prose-td:p-2',
        'prose-img:rounded-lg prose-img:shadow-md',
        className,
      )}
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            return (
              <CodeBlock inline={inline} className={className} onApplyCode={onApplyCode}>
                {children}
              </CodeBlock>
            );
          },
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
});
