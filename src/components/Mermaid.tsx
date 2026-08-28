import { useEffect, useState } from 'react';

interface MermaidProps {
    source: string;
}

export function Mermaid({ source }: MermaidProps) {
    const [svg, setSvg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const render = async () => {
            try {
                const mermaid = (await import('mermaid')).default;
                if (cancelled) return;
                mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
                const id = `mermaid-${Math.random().toString(36).slice(2)}`;
                const { svg } = await mermaid.render(id, source);
                if (!cancelled) setSvg(svg);
            } catch (e) {
                console.warn('[mermaid] render failed:', e);
                if (!cancelled) setError(source);
            }
        };

        render();
        return () => { cancelled = true; };
    }, [source]);

    if (error) {
        return <pre className="mermaid mermaid-error">{error}</pre>;
    }

    if (!svg) {
        return <div className="mermaid-loading">Loading diagram…</div>;
    }

    return <div className="mermaid" dangerouslySetInnerHTML={{ __html: svg }} />;
}
