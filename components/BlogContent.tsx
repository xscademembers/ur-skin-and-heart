import React from 'react';

interface BlogContentProps {
    content: string;
    className?: string;
}

type Block =
    | { type: 'h2'; text: string }
    | { type: 'h3'; text: string }
    | { type: 'ul'; items: string[] }
    | { type: 'ol'; items: string[] }
    | { type: 'quote'; text: string }
    | { type: 'p'; text: string };

function parseInline(text: string): React.ReactNode {
    const nodes: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let last = 0;
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > last) {
            nodes.push(text.slice(last, match.index));
        }
        const token = match[0];
        if (token.startsWith('**')) {
            nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
        } else if (token.startsWith('`')) {
            nodes.push(<code key={key++} className="bg-stone-100 text-brand-blue px-1.5 py-0.5 rounded text-[0.9em]">{token.slice(1, -1)}</code>);
        } else if (token.startsWith('[')) {
            const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
            if (linkMatch) {
                nodes.push(
                    <a
                        key={key++}
                        href={linkMatch[2]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue underline hover:opacity-80"
                    >
                        {linkMatch[1]}
                    </a>
                );
            }
        } else if (token.startsWith('*')) {
            nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
        }
        last = match.index + token.length;
    }
    if (last < text.length) nodes.push(text.slice(last));
    return nodes;
}

function parseBlocks(content: string): Block[] {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const blocks: Block[] = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();
        if (!line) { i++; continue; }

        if (line.startsWith('## ')) {
            blocks.push({ type: 'h3', text: line.slice(3).trim() });
            i++;
            continue;
        }
        if (line.startsWith('# ')) {
            blocks.push({ type: 'h2', text: line.slice(2).trim() });
            i++;
            continue;
        }
        if (line.startsWith('> ')) {
            const buf: string[] = [line.slice(2).trim()];
            i++;
            while (i < lines.length && lines[i].trim().startsWith('> ')) {
                buf.push(lines[i].trim().slice(2).trim());
                i++;
            }
            blocks.push({ type: 'quote', text: buf.join(' ') });
            continue;
        }
        if (/^[-*]\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
                i++;
            }
            blocks.push({ type: 'ul', items });
            continue;
        }
        if (/^\d+[.)]\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
                i++;
            }
            blocks.push({ type: 'ol', items });
            continue;
        }

        const buf: string[] = [line];
        i++;
        while (i < lines.length && lines[i].trim() && !/^(#{1,2}\s|[-*]\s|>\s|\d+[.)]\s)/.test(lines[i].trim())) {
            buf.push(lines[i].trim());
            i++;
        }
        blocks.push({ type: 'p', text: buf.join(' ') });
    }
    return blocks;
}

export const BlogContent: React.FC<BlogContentProps> = ({ content, className = '' }) => {
    const blocks = React.useMemo(() => parseBlocks(content || ''), [content]);

    return (
        <div className={`space-y-5 text-stone-700 leading-relaxed ${className}`}>
            {blocks.map((block, idx) => {
                switch (block.type) {
                    case 'h2':
                        return (
                            <h2 key={idx} className="text-4xl font-serif font-semibold text-stone-800 mt-12 mb-3 leading-tight">
                                {parseInline(block.text)}
                            </h2>
                        );
                    case 'h3':
                        return (
                            <h3 key={idx} className="text-2xl md:text-3xl font-serif font-semibold text-stone-800 mt-10 mb-3 leading-tight">
                                {parseInline(block.text)}
                            </h3>
                        );
                    case 'ul':
                        return (
                            <ul key={idx} className="list-disc list-outside pl-6 space-y-3 marker:text-stone-400">
                                {block.items.map((item, i) => (
                                    <li key={i} className="leading-relaxed">{parseInline(item)}</li>
                                ))}
                            </ul>
                        );
                    case 'ol':
                        return (
                            <ol key={idx} className="list-decimal list-outside pl-6 space-y-3 marker:text-stone-500 marker:font-semibold">
                                {block.items.map((item, i) => (
                                    <li key={i} className="leading-relaxed">{parseInline(item)}</li>
                                ))}
                            </ol>
                        );
                    case 'quote':
                        return (
                            <blockquote key={idx} className="border-l-4 border-stone-300 pl-5 italic text-stone-600 bg-stone-50 py-3 rounded-r-lg">
                                {parseInline(block.text)}
                            </blockquote>
                        );
                    case 'p':
                    default:
                        return (
                            <p key={idx} className="text-[20px] leading-[1.85] text-stone-700 font-light">
                                {parseInline(block.text)}
                            </p>
                        );
                }
            })}
        </div>
    );
};
