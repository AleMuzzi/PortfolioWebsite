export interface Resource {
    label: string;
    url: string;
    kind: 'image' | 'pdf' | 'other';
}

export interface Project {
    id: string;
    name: string;
    summary: string;
    description: string;
    bodyMarkdown: string;
    technologies: string[];
    categorizedTech?: Record<string, string[]>;
    link?: string;
    /**
     * Optional numeric order extracted from the markdown filename.
     * Example: `2_Readme_DIY_Drone.en.md` → order = 2.
     */
    order?: number;
    /**
     * Optional list of downloadable resources parsed from the markdown
     * "Resources" / "Risorse" section.
     */
    resources?: Resource[];
    lang: 'en' | 'it';
    /**
     * Cover image path resolved from public/summaries/cards based on project id.
     * Undefined means no card image available.
     */
    coverImage?: string;
}

export interface Experience {
    id: string;
    name: string;
    company?: string;
    companyUrl?: string;
    summary: string;
    period: string;
    details: string;
    technologies: string[];
    categorizedTech?: Record<string, string[]>;
    /** Optional resources section for experiences as well. */
    resources?: Resource[];
    lang: 'en' | 'it';
}

interface MarkdownModule {
    default: string;
}

const projectModules = import.meta.glob('./summaries/*.md', { query: '?raw', eager: true }) as Record<string, MarkdownModule>;
const experienceModules = import.meta.glob('./experiences/*.md', { query: '?raw', eager: true }) as Record<string, MarkdownModule>;
const aboutMeModules = import.meta.glob('./components/about_me/*.md', { query: '?raw', eager: true }) as Record<string, MarkdownModule>;

export interface AboutMe {
    id: string;
    bio: string;
    contentMarkdown: string;
    lang: 'en' | 'it';
}

const aboutMeData: AboutMe[] = Object.entries(aboutMeModules).map(([filename, module]) => {
    const lang = filename.endsWith('.it.md') ? 'it' : 'en';
    const content = typeof module.default === 'string' ? module.default : '';
    
    const sections = content.split(/^##\s+/m);
    let bio = '';
    
    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const header = lines[0].trim().toLowerCase();
        const body = lines.slice(1).join('\n').trim();
        
        if (header.includes('bio')) {
            bio = body;
        }
    });
    
    return {
        id: 'about-me',
        bio,
        contentMarkdown: content,
        lang
    };
});

export const getAboutMe = (lang: 'en' | 'it'): AboutMe | undefined => {
    return aboutMeData.find(a => a.lang === lang);
};

function parseProject(filename: string, content: unknown): Project {
    const lang = filename.endsWith('.it.md') ? 'it' : 'en';
    if (typeof content !== 'string') {
        return {
            id: filename,
            name: filename,
            summary: '',
            description: '',
            bodyMarkdown: '',
            technologies: [],
            lang
        };
    }

    // Example filename: "2_Readme_DIY_Drone.en.md"
    const fileName = filename.split('/').pop()!;

    // Extract numeric prefix (order) if present at the beginning (e.g. "2_...")
    let order: number | undefined;
    const orderMatch = fileName.match(/^(\d+)_/);
    if (orderMatch) {
        order = Number.parseInt(orderMatch[1], 10);
    }

    // Remove extension and numeric prefix for id/slug generation
    let base = fileName
        .replace('.en.md', '')
        .replace('.it.md', '');

    // Drop leading numeric prefix + underscore (e.g. "2_" → "")
    base = base.replace(/^\d+_/, '');

    // Preserve previous behavior: strip "Readme_" and use the rest as slug
    const slugSource = base.replace('Readme_', '');

    const id = slugSource
        .toLowerCase()
        .replace(/_/g, '-');

    const nameMatch = content.match(/^#\s+(.*)/m);
    const name = nameMatch ? nameMatch[1].trim() : id;

    const sections = content.split(/^##\s+/m);

    let summary = '';
    let description = '';
    let link = '';
    let technologies: string[] = [];
    let categorizedTech: Record<string, string[]> = {};
    let bodyMarkdownParts: string[] = [];
    let resources: Resource[] = [];

    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const headerOriginal = lines[0].trim();
        const header = headerOriginal.toLowerCase();
        const body = lines.slice(1).join('\n').trim();

        if (header.includes('summary')) {
            summary = body;
        } else if (header.includes('link')) {
            const urlMatch = body.match(/(https?:\/\/[^\s]+)/);
            if (urlMatch) {
                link = urlMatch[0];
            }
        } else if (header.includes('resources') || header.includes('risorse')) {
            const resourceLines = body.split('\n').filter(line => line.trim().length > 0);

            resourceLines.forEach(line => {
                const cleanLine = line.replace(/^[-*+]\\s+/, '').trim();
                if (!cleanLine) return;

                // Try to parse markdown link: [Label](url)
                const linkMatch = cleanLine.match(/\[(.*?)\]\((.*?)\)/);
                let label: string;
                let url: string;
                if (linkMatch) {
                    label = linkMatch[1].trim();
                    url = linkMatch[2].trim();
                } else {
                    label = cleanLine;
                    url = cleanLine;
                }

                const lowerUrl = url.toLowerCase();
                let kind: Resource['kind'] = 'other';
                if (/(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.svg)$/.test(lowerUrl)) {
                    kind = 'image';
                } else if (lowerUrl.endsWith('.pdf')) {
                    kind = 'pdf';
                }

                resources.push({ label, url, kind });
            });
        } else if (header.includes('technologies and tools') || header.includes('tecnologie e strumenti')) {
            const techLines = body.split('\n').filter(line => line.trim().length > 0);

            techLines.forEach(line => {
                const cleanLine = line.replace(/^[-*+]\s+/, '').trim();
                if (cleanLine.includes(':')) {
                    const [category, items] = cleanLine.split(':');
                    const categoryName = category.replace(/\*\*/g, '').trim();
                    const itemsList = items.split(',').map(i => i.replace(/\*\*/g, '').trim()).filter(i => i.length > 0);

                    if (categoryName && itemsList.length > 0) {
                        categorizedTech[categoryName] = itemsList;
                        technologies.push(...itemsList);
                    }
                } else {
                    const techName = cleanLine.replace(/\*\*/g, '').trim();
                    if (techName) {
                        technologies.push(techName);
                    }
                }
            });
        } else if (header.includes('what this project is') || header.includes('project overview')) {
            description = body;
        } else if (headerOriginal.length > 0 && !headerOriginal.includes('# ')) {
            bodyMarkdownParts.push(`## ${headerOriginal}\n\n${body}`);
        }
    });

    return {
        id,
        name,
        summary,
        description,
        bodyMarkdown: bodyMarkdownParts.join('\\n\\n').trim(),
        technologies: Array.from(new Set(technologies)),
        categorizedTech: Object.keys(categorizedTech).length > 0 ? categorizedTech : undefined,
        link: link || undefined,
        order,
        resources: resources.length > 0 ? resources : undefined,
        lang,
        coverImage: `/summaries/cards/${id}.png`,
    };
}

function parseExperience(filename: string, content: unknown): Experience {
    const lang = filename.endsWith('.it.md') ? 'it' : 'en';
    if (typeof content !== 'string') {
        return {
            id: filename,
            name: filename,
            summary: '',
            period: '',
            details: '',
            technologies: [],
            lang
        };
    }
    const id = filename
        .split('/')
        .pop()!
        .replace('.en.md', '')
        .replace('.it.md', '')
        .toLowerCase()
        .replace(/_/g, '-');

    const nameMatch = content.match(/^#\s+(.*)/m);
    const name = nameMatch ? nameMatch[1].trim() : id;

    const sections = content.split(/^##\s+/m);

    let summary = '';
    let period = '';
    let details = '';
    let company = '';
    let companyUrl = '';
    let technologies: string[] = [];
    let categorizedTech: Record<string, string[]> = {};
    let resources: Resource[] = [];

    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const header = lines[0].toLowerCase().trim();
        const body = lines.slice(1).join('\n').trim();

        if (header.includes('summary')) {
            summary = body;
        } else if (header.includes('company') || header.includes('azienda')) {
            const line = body.split('\n')[0].trim();
            const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
            if (urlMatch) {
                companyUrl = urlMatch[0];
                // Extract name by removing URL and trailing separators like " - "
                company = line.replace(companyUrl, '').replace(/[-–—]\s*$/, '').trim();
            } else {
                company = line;
            }
        } else if (header.includes('period') || header.includes('periodo')) {
            period = body;
        } else if (header.includes('what i did') || header.includes('cosa ho fatto')) {
            details = body;
        } else if (header.includes('resources') || header.includes('risorse')) {
            const resourceLines = body.split('\n').filter(line => line.trim().length > 0);

            resourceLines.forEach(line => {
                const cleanLine = line.replace(/^[-*+]\\s+/, '').trim();
                if (!cleanLine) return;

                const linkMatch = cleanLine.match(/\[(.*?)\]\((.*?)\)/);
                let label: string;
                let url: string;
                if (linkMatch) {
                    label = linkMatch[1].trim();
                    url = linkMatch[2].trim();
                } else {
                    label = cleanLine;
                    url = cleanLine;
                }

                const lowerUrl = url.toLowerCase();
                let kind: Resource['kind'] = 'other';
                if (/(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.svg)$/.test(lowerUrl)) {
                    kind = 'image';
                } else if (lowerUrl.endsWith('.pdf')) {
                    kind = 'pdf';
                }

                resources.push({ label, url, kind });
            });
        } else if (header.includes('technologies and tools') || header.includes('tecnologie e strumenti')) {
            const techLines = body.split('\n').filter(line => line.trim().length > 0);

            techLines.forEach(line => {
                const cleanLine = line.replace(/^[-*+]\s+/, '').trim();
                if (cleanLine.includes(':')) {
                    const [category, items] = cleanLine.split(':');
                    const categoryName = category.replace(/\*\*/g, '').trim();
                    const itemsList = items.split(',').map(i => i.replace(/\*\*/g, '').trim()).filter(i => i.length > 0);

                    if (categoryName && itemsList.length > 0) {
                        categorizedTech[categoryName] = itemsList;
                        technologies.push(...itemsList);
                    }
                } else {
                    const techName = cleanLine.replace(/\*\*/g, '').trim();
                    if (techName) {
                        technologies.push(techName);
                    }
                }
            });
        }
    });

    return {
        id,
        name,
        company: company || undefined,
        companyUrl: companyUrl || undefined,
        summary,
        period,
        details,
        technologies: Array.from(new Set(technologies)),
        categorizedTech: Object.keys(categorizedTech).length > 0 ? categorizedTech : undefined,
        resources: resources.length > 0 ? resources : undefined,
        lang
    };
}

function parsePeriodStart(period: string): number {
    const match = period.match(/\d{4}/);
    return match ? parseInt(match[0]) : 0;
}

export const projects: Project[] = Object.entries(projectModules)
    .map(([path, module]) => parseProject(path, module.default))
    .sort((a, b) => {
        const ao = a.order ?? Number.MAX_SAFE_INTEGER;
        const bo = b.order ?? Number.MAX_SAFE_INTEGER;
        if (ao !== bo) return ao - bo;
        // Fallback: alphabetic order by name when order is equal or missing
        return a.name.localeCompare(b.name);
    });

export const experiences: Experience[] = Object.entries(experienceModules)
    .map(([path, module]) => parseExperience(path, module.default))
    .sort((a, b) => {
        const startA = parsePeriodStart(a.period);
        const startB = parsePeriodStart(b.period);
        return startB - startA;
    });