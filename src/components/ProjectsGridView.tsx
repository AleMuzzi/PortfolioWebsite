import { Project } from '../projectsData';
import { translations, Language } from '../i18n';
import './ProjectsGridView.css';

interface ProjectsGridViewProps {
    lang: Language;
    filteredProjects: Project[];
    handleSelect: (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => void;
}

export function ProjectsGridView({
    lang,
    filteredProjects,
    handleSelect
}: ProjectsGridViewProps) {
    const t = translations[lang];

    return (
        <article className="projects-grid-view">
            <div className="view-header">
                <button className="back-button" onClick={() => handleSelect(null, 'home')}>←</button>
                <h2>{t.personalTitle}</h2>
            </div>
            <div className="projects-grid">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="project-card" onClick={() => handleSelect(project.id, 'project')}>
                        <div className="project-card-content">
                            <h3>{project.name}</h3>
                            <p>{project.summary || project.overview.split('\n')[0].replace(/[#*`[\]]/g, '')}</p>
                            <div className="project-card-footer">
                                <span className="tech-tag">{project.technologies[0]}</span>
                                {project.technologies.length > 1 && <span className="tech-tag">+{project.technologies.length - 1}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
}
