import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Project } from '../projectsData';
import { translations, Language } from '../i18n';
import { DetailsView } from './DetailsView';
import './ProjectsGridView.css';

interface ProjectsGridViewProps {
    lang: Language;
    filteredProjects: Project[];
    handleSelect: (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => void;
    onTagClick?: (tagName: string) => void;
}

export function ProjectsGridView({
    lang,
    filteredProjects,
    handleSelect,
    onTagClick
}: ProjectsGridViewProps) {
    const t = translations[lang];
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [localSelectedId, setLocalSelectedId] = useState<string | null>(filteredProjects.length > 0 ? filteredProjects[0].id : null);

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

    const selectedProject = filteredProjects.find(p => p.id === localSelectedId);

    return (
        <article className="projects-view">
            <div className="view-header">
                <button className="back-button" onClick={() => handleSelect(null, 'home')}>←</button>
                <h2>{t.personalTitle}</h2>
            </div>
            
            <div className="projects-container">
                <div className="projects-list-side">
                    <div className="filters">
                        <input 
                            type="text" 
                            placeholder="Search projects..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <div className="tags-filter">
                            {allTags.map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`tag-filter-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="projects-list-wrapper">
                        <div className="projects-list">
                            {displayedProjects.map((project) => (
                                <div 
                                    key={project.id} 
                                    className={`project-list-item ${localSelectedId === project.id ? 'active' : ''}`}
                                    onClick={() => setLocalSelectedId(project.id)}
                                >
                                    <h3>{project.name}</h3>
                                    <div className="project-summary">
                                        <ReactMarkdown>
                                            {project.summary || project.overview.split('\n')[0].replace(/[#*`[\]]/g, '')}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="project-item-footer">
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
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="projects-details-side">
                    {selectedProject ? (
                        <DetailsView 
                            selectedType="project"
                            selectedProject={selectedProject}
                            selectedExperience={null}
                            lang={lang}
                            handleSelect={() => setLocalSelectedId(null)}
                            onTagClick={onTagClick}
                        />
                    ) : (
                        <div className="no-selection">
                            <p>Select a project to see details</p>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
