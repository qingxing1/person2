import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'javascript', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="my-4 rounded-lg overflow-hidden shadow-lg bg-gray-900 text-gray-100">
      {title && (
        <div className="px-4 py-2 bg-gray-800 font-mono text-sm flex justify-between items-center">
          <span>{title}</span>
          <span className="text-xs text-gray-400">{language}</span>
        </div>
      )}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={dracula}
          className="p-4 text-sm font-mono leading-relaxed"
          showLineNumbers
          lineNumberStyle={{ color: '#6272a4', fontSize: '0.8em' }}
        >
          {code}
        </SyntaxHighlighter>
        <button
          onClick={handleCopy}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded bg-gray-800/70 hover:bg-gray-700 transition-colors",
            copied ? "text-green-400" : "text-gray-300"
          )}
          aria-label={copied ? "已复制" : "复制代码"}
        >
          <i className={cn(
            "fa-regular",
            copied ? "fa-check" : "fa-copy"
          )}></i>
        </button>
      </div>
    </div>
  );
}