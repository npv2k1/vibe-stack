import React from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';

import { InputProps } from '../Input.type';

export type CodeInputProps = InputProps<string> & EditorProps;

export const CodeInput = ({ value, onChange, ...props }: CodeInputProps) => {
  return (
    <Editor
      theme="vs-dark"
      height="100%"
      width="100%"
      defaultLanguage="javascript"
      value={value}
      onChange={(newValue) => onChange?.(newValue ?? '')}
      defaultValue=""
      className="text-2xl"
      options={{
        fontSize: 16,
        fontFamily: 'Fira Code, Menlo, monospace',
        fontLigatures: true,
      }}
      language="javascript"
      {...props}
    />
  );
};
