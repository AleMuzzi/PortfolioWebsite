import ReactMarkdown from 'react-markdown';
import { Project, Experience } from '../projectsData';
import { translations, Language } from '../i18n';

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
                {selectedType === 'experience' && selectedExperience && (() => {
                    // --- LOGIC FOR PARSING COMPANY & LINK ---
                    const separator = lang === 'en' ? ' at ' : ' presso ';
                    const parts = selectedExperience.name.split(separator);

                    // 1. Get Role
                    const roleName = parts[0];

                    // 2. Get Company (Try explicit property first, then parse title)
                    const companyName = (selectedExperience as any).company
                        || (parts.length > 1 ? parts[1] : 'Unknown Company');

                    // 3. Get URL (Try explicit property)
                    const companyUrl = (selectedExperience as any).companyUrl;

                    return (
                        <div className="fade-in-content experience-detail-container">
                            {/* HEADER SECTION */}
                            <div className="exp-header">
                                <h3 className="exp-role">{roleName}</h3>

                                <div className="exp-meta-row">
                                    {companyUrl ? (
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
                                    )}

                                    <div className="exp-chip chip-date">
                                        <span style={{marginRight:'6px'}}>🗓</span>
                                        {selectedExperience.period}
                                    </div>
                                </div>
                            </div>

                            {/* BODY CONTENT */}
                            <div className="markdown-body exp-body">
                                <ReactMarkdown>
                                    {(selectedExperience as any).details || selectedExperience.summary}
                                </ReactMarkdown>
                            </div>

                            {/* TOOLS FOOTER */}
                            <div className="tools-section">
                                <span className="tools-title">Techniques & Tools</span>
                                {selectedExperience.categorizedTech ? (
                                    <div className="categorized-tools">
                                        {Object.entries(selectedExperience.categorizedTech).map(([category, items]) => (
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
                                        {selectedExperience.technologies.map(tech => (
                                            <span key={tech} className="tool-badge">
                                                                {tech}
                                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}
                {selectedType === 'project' && selectedProject && (
                    <div className="fade-in-content">
                        <div className="detail-title-block">
                            <h3>{selectedProject.name}</h3>
                            <div className="tech-stack-detail">
                                {selectedProject.technologies.map((tech) => (
                                    <span key={tech} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                        </div>
                        <div className="markdown-body">
                            <ReactMarkdown>
                                {selectedProject.overview || (selectedProject as any).description}
                            </ReactMarkdown>
                            {(selectedProject as any).link && (
                                <div className="project-links" style={{marginTop:'20px'}}>
                                    <a href={(selectedProject as any).link} target="_blank" rel="noreferrer" className="cta-button">
                                        View Project
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
