import React, { useState } from 'react';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '../../utils';
import { InputProps } from '../Input.type';

export type MarkdownEditorProps = InputProps<string> & {
  /**
   * Height of the editor
   * @default '400px'
   */
  height?: string;
  /**
   * Width of the editor
   * @default '100%'
   */
  width?: string;
  /**
   * Show live preview alongside editor
   * @default true
   */
  showPreview?: boolean;
  /**
   * Enable dark theme
   * @default true
   */
  darkTheme?: boolean;
  /**
   * Placeholder text for empty editor
   */
  placeholder?: string;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Read-only mode
   * @default false
   */
  readOnly?: boolean;
};

/**
 * MarkdownEditor component provides a markdown editor with optional live preview
 *
 * @example
 * ```tsx
 * <MarkdownEditor
 *   value={markdown}
 *   onChange={setMarkdown}
 *   showPreview={true}
 *   height="500px"
 * />
 * ```
 */
export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value = '',
  onChange,
  height = '400px',
  width = '100%',
  showPreview = true,
  darkTheme = true,
  placeholder = '# Start writing markdown...',
  className,
  readOnly = false,
}) => {
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'split'>(
    showPreview ? 'split' : 'edit',
  );

  const handleChange = (newValue: string) => {
    onChange?.(newValue);
  };

  const renderEditor = () => (
    <div className={cn('flex-1 overflow-hidden', !showPreview && 'w-full')}>
      <CodeMirror
        value={value}
        height={height}
        width="100%"
        theme={darkTheme ? oneDark : undefined}
        extensions={[markdown()]}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );

  const renderPreview = () => (
    <div
      className={cn(
        'flex-1 overflow-auto p-4',
        darkTheme ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900',
        'prose prose-sm max-w-none',
        darkTheme && 'prose-invert',
      )}
      style={{ height }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || placeholder}</ReactMarkdown>
    </div>
  );

  return (
    <div className={cn('flex flex-col border border-gray-300 rounded-lg overflow-hidden', className)}>
      {showPreview && (
        <div className="flex items-center gap-2 p-2 border-b border-gray-300 bg-gray-100">
          <button
            onClick={() => setPreviewMode('edit')}
            className={cn(
              'px-3 py-1 text-sm rounded transition-colors',
              previewMode === 'edit'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            )}
            type="button"
          >
            Edit
          </button>
          <button
            onClick={() => setPreviewMode('preview')}
            className={cn(
              'px-3 py-1 text-sm rounded transition-colors',
              previewMode === 'preview'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            )}
            type="button"
          >
            Preview
          </button>
          <button
            onClick={() => setPreviewMode('split')}
            className={cn(
              'px-3 py-1 text-sm rounded transition-colors',
              previewMode === 'split'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            )}
            type="button"
          >
            Split
          </button>
        </div>
      )}
      <div className="flex" style={{ width }}>
        {(previewMode === 'edit' || previewMode === 'split') && renderEditor()}
        {previewMode === 'split' && <div className="w-px bg-gray-300" />}
        {(previewMode === 'preview' || previewMode === 'split') && renderPreview()}
      </div>
    </div>
  );
};
