import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split content by paragraphs/newlines
  const blocks = content.split('\n');

  return (
    <div className="space-y-4 text-gray-700 leading-relaxed font-sans">
      {blocks.map((block, idx) => {
        let trimmed = block.trim();

        if (trimmed === '') {
          return <div key={idx} className="h-2" />;
        }

        // 1. Headers
        if (trimmed.startsWith('### ')) {
          const headerText = trimmed.replace('### ', '');
          return (
            <h4 key={idx} className="text-lg font-bold text-slate-800 mt-4 mb-2 border-l-4 border-emerald-500 pl-3">
              {renderInlineStyles(headerText)}
            </h4>
          );
        }

        if (trimmed.startsWith('## ')) {
          const headerText = trimmed.replace('## ', '');
          return (
            <h3 key={idx} className="text-xl font-bold text-slate-900 mt-5 mb-2 pb-1 border-b border-slate-200">
              {renderInlineStyles(headerText)}
            </h3>
          );
        }

        if (trimmed.startsWith('# ')) {
          const headerText = trimmed.replace('# ', '');
          return (
            <h2 key={idx} className="text-2xl font-black text-slate-950 mt-6 mb-3">
              {renderInlineStyles(headerText)}
            </h2>
          );
        }

        // 2. Blockquotes
        if (trimmed.startsWith('> ')) {
          const quoteText = trimmed.replace('> ', '');
          return (
            <blockquote key={idx} className="bg-slate-50 border-l-4 border-slate-300 p-3 italic my-3 rounded-r text-slate-650 text-sm">
              {renderInlineStyles(quoteText)}
            </blockquote>
          );
        }

        // 3. Bullet list items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const listText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <ul key={idx} className="list-disc pl-5 my-1 text-slate-700">
              <li className="pl-1 hover:text-emerald-700 transition-colors">
                {renderInlineStyles(listText)}
              </li>
            </ul>
          );
        }

        // 4. Numbered lists
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const text = numMatch[2];
          return (
            <div key={idx} className="flex gap-2 items-start my-1 text-slate-705 pl-2">
              <span className="font-mono text-emerald-600 font-bold">{num}.</span>
              <span className="flex-1">{renderInlineStyles(text)}</span>
            </div>
          );
        }

        // 5. Normal Paragraph
        return (
          <p key={idx} className="text-slate-600 text-sm md:text-base pr-1">
            {renderInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Simple helper to parse inline **bold**, `code`, and equations
function renderInlineStyles(text: string) {
  if (!text) return '';

  // Simple sequential parsing for bold (**) and code (`) and LaTeX symbols ($)
  // Let's replace with react elements
  const parts: (string | React.ReactNode)[] = [];
  let currentWord = '';
  let i = 0;

  while (i < text.length) {
    // 1. Check for bold **
    if (text[i] === '*' && text[i + 1] === '*') {
      if (currentWord) {
        parts.push(currentWord);
        currentWord = '';
      }
      i += 2;
      let boldWord = '';
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
        boldWord += text[i];
        i++;
      }
      i += 2;
      parts.push(
        <strong key={`b-${i}`} className="font-semibold text-slate-900 bg-emerald-50/70 px-1 rounded">
          {boldWord}
        </strong>
      );
      continue;
    }

    // 2. Check for inline code `
    if (text[i] === '`') {
      if (currentWord) {
        parts.push(currentWord);
        currentWord = '';
      }
      i++;
      let codeWord = '';
      while (i < text.length && text[i] !== '`') {
        codeWord += text[i];
        i++;
      }
      i++;
      parts.push(
        <code key={`c-${i}`} className="bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-emerald-700 rounded px-1.5 py-0.5 mx-0.5 text-xs font-mono transition-colors">
          {codeWord}
        </code>
      );
      continue;
    }

    // 3. For math formatting or arrow tags
    if (text[i] === '　') {
      currentWord += ' ';
      i++;
      continue;
    }

    currentWord += text[i];
    i++;
  }

  if (currentWord) {
    parts.push(currentWord);
  }

  return parts.length > 0 ? parts : text;
}
