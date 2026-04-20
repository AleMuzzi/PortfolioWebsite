import { useState, useMemo } from 'react';
import { trackProjectClick, trackFilterModalOpen } from '../utils/analytics';
import ReactMarkdown from 'react-markdown';
import { Project } from '../projectsData';
import { translations, Language } from '../i18n';
import { FilterModal } from './FilterModal';
import './ProjectsGridView.css';

// Exposed for imperative hash navigation from ProjectsGridView
declare global {
  interface Window {
    __handleProjectsHashChange?: () => void;
  }
}

interface ProjectsGridViewProps {
    lang: Language;
    filteredProjects: Project[];
    onTagClick?: (tagName: string) => void;
}

export function ProjectsGridView({
    lang,
    filteredProjects,
    onTagClick,
}: ProjectsGridViewProps) {
    const t = translations[lang];
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        filteredProjects.forEach(p => {
            p.technologies.forEach(tech => tags.add(tech));
        });
        return Array.from(tags).sort();
    }, [filteredProjects]);

    const displayedProjects = useMemo(() => {
        return filteredProjects.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesTags = selectedTags.length === 0 ||
                selectedTags.every(tag => p.technologies.includes(tag));

            return matchesSearch && matchesTags;
        });
    }, [filteredProjects, searchQuery, selectedTags]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setSelectedTags([]);
    };

    return (
        <article className="projects-view">
            <div className="view-header">
                <button className="back-button" onClick={() => window.history.back()}>←</button>
                <h2>{t.personalTitle}</h2>
            </div>

            <div className="projects-grid-container">
                <div className="filters">
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button
                            className={`filter-icon-btn ${selectedTags.length > 0 ? 'has-filters' : ''}`}
                            onClick={() => {
                                setIsFilterModalOpen(true);
                                trackFilterModalOpen();
                            }}
                            title={t.filterByTags}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                            </svg>
                            {selectedTags.length > 0 && <span className="filter-badge"></span>}
                        </button>
                    </div>
                </div>

                <div className="projects-grid">
                    {displayedProjects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card"
                            onClick={() => {
                                window.history.pushState({ id: project.id, type: 'project' }, '', `#/projects/${project.id}`);
                                // pushState doesn't fire hashchange — sync React state immediately
                                window.__handleProjectsHashChange?.();
                                trackProjectClick(project.name, lang);
                            }}
                        >
                            <h3>{project.name}</h3>
                            <div className="project-summary">
                                <ReactMarkdown>
                                    {project.summary || project.description || project.bodyMarkdown.split('\n')[0].replace(/[#*`[\]]/g, '')}
                                </ReactMarkdown>
                            </div>
                            <div className="project-card-footer">
                                <div className="tech-tags">
                                    {project.technologies.slice(0, 3).map(tech => (
                                        <span
                                            key={tech}
                                            className="tech-tag clickable-tag"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onTagClick?.(tech);
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <span className="tech-tag">+{project.technologies.length - 3}</span>
                                    )}
                                </div>
                                <span className="see-details-hint">{t.seeDetails} →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                allTags={allTags}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                clearFilters={clearFilters}
                t={t}
            />
        </article>
    );
}
