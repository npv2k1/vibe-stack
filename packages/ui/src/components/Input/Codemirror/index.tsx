import React from 'react';
import { AutoSizer } from 'react-virtualized';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
export type CodeMirrorProps = {
  value: string;
  onChange: (value: string) => void;
  language: 'javascript' | 'python' | 'cpp';
};

export const Codemirror: React.FC<CodeMirrorProps> = ({ value, onChange, language }) => {
  const getLanguageSupport = () => {
    switch (language) {
      case 'javascript':
        return [javascript()];
      case 'python':
        return [python()];
      case 'cpp':
        return [cpp()];
      default:
        return [javascript()];
    }
  };
  return (
    <div className="w-full min-h-[300px]">
      <AutoSizer>
        {({ width, height }) => (
          <CodeMirror
            value={value}
            height={`${height}px`}
            width={`${width}px`}
            theme={oneDark}
            extensions={[...getLanguageSupport()]}
            onChange={onChange}
          />
        )}
      </AutoSizer>
    </div>
  );
};
