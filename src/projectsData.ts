export interface Project {
  id: string;
  name: string;
  summary: string;
  overview: string;
  how: string;
  technologies: string[];
  lang: 'en' | 'it';
}

export interface Experience {
  id: string;
  name: string;
  summary: string;
  period: string;
  details: string;
  technologies: string[];
  lang: 'en' | 'it';
}

interface MarkdownModule {
  default: string;
}

const projectModules = import.meta.glob('./summaries/*.md', { query: '?raw', eager: true }) as Record<string, MarkdownModule>;
const experienceModules = import.meta.glob('./experiences/*.md', { query: '?raw', eager: true }) as Record<string, MarkdownModule>;

function parseProject(filename: string, content: unknown): Project {
  const lang = filename.endsWith('.it.md') ? 'it' : 'en';
  if (typeof content !== 'string') {
    return {
      id: filename,
      name: filename,
      summary: '',
      overview: '',
      how: '',
      technologies: [],
      lang
    };
  }
  const id = filename
    .split('/')
    .pop()!
    .replace('Readme_', '')
    .replace('.en.md', '')
    .replace('.it.md', '')
    .toLowerCase()
    .replace(/_/g, '-');

  const nameMatch = content.match(/^#\s+(.*)/m);
  const name = nameMatch ? nameMatch[1].trim() : id;

  const sections = content.split(/^##\s+/m);
  
  let summary = '';
  let overview = '';
  let how = '';
  let technologies: string[] = [];

  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const header = lines[0].toLowerCase().trim();
    const body = lines.slice(1).join('\n').trim();

    if (header.includes('summary')) {
      summary = body;
    } else if (header.includes('what this project is') || header.includes('project overview')) {
      overview = body;
    } else if (header.includes('how it works') || header.includes('come funziona')) {
      how = body;
    } else if (header.includes('technologies and tools') || header.includes('tecnologie e strumenti')) {
      technologies = body
        .split('\n')
        .map(line => {
          return line
            .replace(/^[-*+]\s+/, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .split(':')[0]
            .trim();
        })
        .filter(line => line.length > 0);
    }
  });

  return {
    id,
    name,
    summary,
    overview,
    how,
    technologies,
    lang
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
  let technologies: string[] = [];

  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const header = lines[0].toLowerCase().trim();
    const body = lines.slice(1).join('\n').trim();

    if (header.includes('summary')) {
      summary = body;
    } else if (header.includes('period') || header.includes('periodo')) {
      period = body;
    } else if (header.includes('what i did') || header.includes('cosa ho fatto')) {
      details = body;
    } else if (header.includes('technologies and tools') || header.includes('tecnologie e strumenti')) {
      technologies = body
        .split('\n')
        .map(line => {
          return line
            .replace(/^[-*+]\s+/, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .split(':')[0]
            .trim();
        })
        .filter(line => line.length > 0);
    }
  });

  return {
    id,
    name,
    summary,
    period,
    details,
    technologies,
    lang
  };
}

function parsePeriodStart(period: string): number {
  const match = period.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}

export const projects: Project[] = Object.entries(projectModules)
  .map(([path, module]) => parseProject(path, module.default))
  .sort((a, b) => a.name.localeCompare(b.name));

export const experiences: Experience[] = Object.entries(experienceModules)
  .map(([path, module]) => parseExperience(path, module.default))
  .sort((a, b) => {
    const startA = parsePeriodStart(a.period);
    const startB = parsePeriodStart(b.period);
    return startB - startA;
  });
