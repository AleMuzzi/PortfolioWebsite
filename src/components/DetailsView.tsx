import ReactMarkdown from 'react-markdown';
import { Project, Experience } from '../projectsData';
import { translations, Language } from '../i18n';
import './DetailsView.css';
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import {useEffect} from "react";

interface DetailsViewProps {
    selectedType: 'project' | 'experience' | 'about' | 'home' | null;
    selectedProject: Project | null | undefined;
    selectedExperience: Experience | null | undefined;
    lang: Language;
    handleSelect: (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => void;
    handleSelectExternal: (id: string, type: 'project' | 'experience') => void;
    onTagClick?: (tagName: string) => void;
}

export function DetailsView({
    selectedType,
    selectedProject,
    selectedExperience,
    lang,
    handleSelect,
    handleSelectExternal,
    onTagClick
}: DetailsViewProps) {
    const t = translations[lang];
    const isExp = selectedType === 'experience';
    const item = isExp ? selectedExperience : selectedProject;

    useEffect(() => {
      setTimeout(() => {
        const detailsElement = document.querySelector('.experience-detail-container');
        if (detailsElement) {
          detailsElement.scrollTo({ top: 0, behavior: 'instant' });
        }
      }, 0);
    }, [selectedProject, selectedExperience]);

    return (
        <article className="detail-view">
            <div className="view-header">
                <button className="back-button" onClick={() => handleSelect(null, selectedType)}>←</button>
                <h2>{selectedType === 'project' ? t.personalTitle : t.workTitle}</h2>
            </div>
            <div className="detail-content">
                {item ? (() => {
                    // Experience specific logic
                    let roleName = item.name;
                    let companyName = (item as any).company;
                    let companyUrl = (item as any).companyUrl || (item as any).link;
                    let period = (item as any).period;

                    if (isExp) {
                        const separator = lang === 'en' ? ' at ' : ' presso ';
                        const parts = item.name.split(separator);
                        roleName = parts[0];
                        if (!companyName) {
                            companyName = parts.length > 1 ? parts[1] : t.unknownCompany;
                        }
                    }

                    return (
                        <div className="fade-in-content experience-detail-container">
                            {/* HEADER SECTION */}
                            <div className="exp-header">
                                <div className="exp-title-row">
                                    <h3 className="exp-role">{roleName}</h3>
                                    {!isExp && (item as Project).github && (
                                        <a
                                            href={(item as Project).github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="github-link"
                                            title="View on GitHub"
                                        >
                                            <svg height="16" width="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                                            </svg>
                                            GitHub
                                            <span style={{marginLeft: '4px', fontSize: '0.8em', opacity: 0.7}}>↗</span>
                                        </a>
                                    )}
                                </div>

                                <div className="exp-meta-row">
                                    {companyName && (
                                        companyUrl ? (
                                            <a
                                                href={companyUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="exp-chip chip-company clickable-chip"
                                            >
                                                <span style={{marginRight:'6px'}}>🏢</span>
                                                {companyName}
                                                <span style={{marginLeft:'6px', fontSize:'0.8em', opacity: 0.7}}>↗</span>
                                            </a>
                                        ) : (
                                            <div className="exp-chip chip-company">
                                                <span style={{marginRight:'6px'}}>🏢</span>
                                                {companyName}
                                            </div>
                                        )
                                    )}

                                    {period && (
                                        <div className="exp-chip chip-date">
                                            <span style={{marginRight:'6px'}}>🗓</span>
                                            {period}
                                        </div>
                                    )}
                                    
                                    {!isExp && (item as Project).link && !companyName && (
                                         <a
                                            href={(item as Project).link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="exp-chip chip-company clickable-chip"
                                        >
                                            <span style={{marginRight:'6px'}}>🔗</span>
                                            {t.viewProject}
                                            <span style={{marginLeft:'6px', fontSize:'0.8em', opacity: 0.7}}>↗</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* BODY CONTENT */}
                            <div className="markdown-body exp-body">
                                {(() => {
                                    const renderers = {
                                        img: ({node, ...props}: any) => {
                                            const alt = props.alt || '';
                                            const widthMatch = alt.match(/\{width="?(\d+%?|auto|[^"}]+)"?\}/);
                                            const heightMatch = alt.match(/\{height="?(\d+%?|auto|[^"}]+)"?\}/);
                                            const alignMatch = alt.match(/\{align="?(left|right|center)"?\}/);
                                            const captionMatch = alt.match(/\{caption="?(.+)"?\}/);

                                            let style: React.CSSProperties = { maxWidth: '100%' };
                                            let className = '';
                                            let cleanAlt = alt;
                                            let captionText = '';

                                            if (widthMatch) {
                                                style.width = widthMatch[1];
                                                cleanAlt = cleanAlt.replace(widthMatch[0], '');
                                            }

                                            if (heightMatch) {
                                                style.height = heightMatch[1];
                                                cleanAlt = cleanAlt.replace(heightMatch[0], '');
                                            }
                                            
                                            if (alignMatch) {
                                                const alignment = alignMatch[1];
                                                className = `align-${alignment}`;
                                                cleanAlt = cleanAlt.replace(alignMatch[0], '');
                                            }

                                            if (captionMatch) {
                                                captionText = captionMatch[1].substring(0, captionMatch[1].length - 1);
                                                cleanAlt = cleanAlt.replace(captionMatch[0], captionText);
                                            }
                                            
                                            cleanAlt = cleanAlt.trim();

                                            return captionMatch ? (
                                                <figure className={`image-figure ${className}`} style={style}>
                                                    <img
                                                        {...props}
                                                        alt={cleanAlt}
                                                        style={style}
                                                        className={className}
                                                    />
                                                    <figcaption className="image-caption">{captionText}</figcaption>
                                                </figure>
                                            ) : (
                                                <img
                                                    {...props}
                                                    alt={cleanAlt}
                                                    style={style}
                                                    className={className}
                                                />
                                            );
                                        },
                                        a: ({node, href, children, ...props}: any) => {
                                          const hrefValue = typeof href === 'string' ? href : '';

                                          // Internal app links (SPA navigation only)
                                          const internalPrefixes: { prefix: string; type: 'project' | 'experience' }[] = [
                                            { prefix: 'http://experience:', type: 'experience' },
                                            { prefix: 'http://project:', type: 'project' },
                                            { prefix: 'experience:', type: 'experience' },
                                            { prefix: 'project:', type: 'project' },
                                          ];

                                          const match = internalPrefixes.find(p => hrefValue.startsWith(p.prefix));

                                          if (match) {
                                            const targetId = hrefValue.slice(match.prefix.length).trim() || null;
                                            if (!targetId) {
                                                console.warn(`Invalid internal link: ${hrefValue}`);
                                                return <span {...props}>{children}</span>;
                                            }
                                            return (
                                              <button
                                                type="button"
                                                {...props}
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  handleSelectExternal(targetId, match.type);
                                                }}
                                                className={`${props.className || ''} internal-link-button`}
                                              >
                                                {children}
                                              </button>
                                            );
                                          }

                                          // Default: external links in new tab
                                          return (
                                            <a
                                              {...props}
                                              href={hrefValue}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              {children}
                                            </a>
                                          );
                                        }
                                    };

                                    return (
                                        <>
                                            <ReactMarkdown components={renderers}>
                                                {isExp ? ((item as any).details || (item as any).summary) : ""}
                                            </ReactMarkdown>
                                            {!isExp && (
                                                <>
                                                    { (item as Project).description && (
                                                        <div className="project-description">
                                                            <ReactMarkdown
                                                              components={renderers}
                                                              remarkPlugins={[remarkGfm]}
                                                              rehypePlugins={[rehypeRaw]}>
                                                                {(item as Project).description}
                                                            </ReactMarkdown>
                                                        </div>
                                                    )}
                                                    { (item as Project).bodyMarkdown && (
                                                        <div className="project-body-markdown">
                                                            <ReactMarkdown
                                                              components={renderers}
                                                              remarkPlugins={[remarkGfm]}
                                                              rehypePlugins={[rehypeRaw]}>
                                                                {(item as Project).bodyMarkdown}
                                                            </ReactMarkdown>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            {/* RESOURCES SECTION */}
                            {item.resources && item.resources.length > 0 && (
                                <div className="resources-section">
                                    <span className="resources-title">{t.resources}</span>
                                    <div className="resources-grid">
                                        {item.resources.map((res) => (
                                            <a
                                                key={res.url}
                                                href={res.url}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="resource-card"
                                            >
                                                <div className="resource-icon">
                                                    {res.kind === 'image' ? (
                                                        <img src={res.url} alt={res.label} />
                                                    ) : (
                                                        <span className="resource-emoji">
                                                            {res.kind === 'pdf' ? '📄' : '📦'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="resource-label">{res.label}</div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TOOLS FOOTER */}
                            <div className="tools-section">
                                <span className="tools-title">{t.tecnologiesAndTools}</span>
                                {item.categorizedTech ? (
                                    <div className="categorized-tools">
                                        {Object.entries(item.categorizedTech).map(([category, items]) => (
                                            <div key={category} className="tech-category-group">
                                                <h4 className="tech-category-name">{category}</h4>
                                                <div className="tools-grid">
                                                    {(items as string[]).map(tech => (
                                                        <span 
                                                            key={tech} 
                                                            className="tool-badge clickable-tag"
                                                            onClick={() => onTagClick?.(tech)}
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="tools-grid">
                                        {item.technologies.map(tech => (
                                            <span 
                                                key={tech} 
                                                className="tool-badge clickable-tag"
                                                onClick={() => onTagClick?.(tech)}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })() : null}
            </div>
        </article>
    );
}
