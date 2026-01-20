import ReactMarkdown from 'react-markdown';
import { Project, Experience } from '../projectsData';
import { translations, Language } from '../i18n';
import './DetailsView.css';

interface DetailsViewProps {
    selectedType: 'project' | 'experience' | 'about' | 'home' | null;
    selectedProject: Project | null | undefined;
    selectedExperience: Experience | null | undefined;
    lang: Language;
    handleSelect: (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => void;
}

export function DetailsView({
    selectedType,
    selectedProject,
    selectedExperience,
    lang,
    handleSelect
}: DetailsViewProps) {
    const t = translations[lang];

    return (
        <article className="detail-view">
            <div className="view-header">
                <button className="back-button" onClick={() => handleSelect(null, selectedType)}>←</button>
                <h2>{selectedType === 'project' ? t.personalTitle : t.workTitle}</h2>
            </div>
            <div className="detail-content">
                {(selectedType === 'experience' && selectedExperience) || (selectedType === 'project' && selectedProject) ? (() => {
                    const isExp = selectedType === 'experience';
                    const item = isExp ? selectedExperience! : selectedProject!;
                    
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
                            companyName = parts.length > 1 ? parts[1] : 'Unknown Company';
                        }
                    }

                    return (
                        <div className="fade-in-content experience-detail-container">
                            {/* HEADER SECTION */}
                            <div className="exp-header">
                                <h3 className="exp-role">{roleName}</h3>

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
                                            View Project
                                            <span style={{marginLeft:'6px', fontSize:'0.8em', opacity: 0.7}}>↗</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* BODY CONTENT */}
                            <div className="markdown-body exp-body">
                                <ReactMarkdown>
                                    {(item as any).details || (item as any).overview || (item as any).summary}
                                </ReactMarkdown>
                            </div>

                            {/* TOOLS FOOTER */}
                            <div className="tools-section">
                                <span className="tools-title">Techniques & Tools</span>
                                {item.categorizedTech ? (
                                    <div className="categorized-tools">
                                        {Object.entries(item.categorizedTech).map(([category, items]) => (
                                            <div key={category} className="tech-category-group">
                                                <h4 className="tech-category-name">{category}</h4>
                                                <div className="tools-grid">
                                                    {(items as string[]).map(tech => (
                                                        <span key={tech} className="tool-badge">
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
                                            <span key={tech} className="tool-badge">
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
