interface Project {
  id: string;
  name: string;
  summary: string;
  overview: string;
  how: string;
  technologies: string[];
}

export interface Experience {
  id: string;
  name: string;
  summary: string;
  period: string;
  details: string;
  technologies: string[];
}

interface MarkdownModule {
  default: string;
}

const projectModules = import.meta.glob('./summaries/*.md', { query: '?raw', eager: true }) as Record<string, MarkdownModule>;
const experienceModules = import.meta.glob('./experiences/*.md', { query: '?raw', eager: true }) as Record<string, MarkdownModule>;

function parseProject(filename: string, content: unknown): Project {
  if (typeof content !== 'string') {
    return {
      id: filename,
      name: filename,
      summary: '',
      overview: '',
      how: '',
      technologies: []
    };
  }
  const id = filename
    .split('/')
    .pop()!
    .replace('Readme_', '')
    .replace('.md', '')
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
    } else if (header.includes('what this project is')) {
      overview = body;
    } else if (header.includes('how it works')) {
      how = body;
    } else if (header.includes('technologies and tools')) {
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
    technologies
  };
}

function parseExperience(filename: string, content: unknown): Experience {
  if (typeof content !== 'string') {
    return {
      id: filename,
      name: filename,
      summary: '',
      period: '',
      details: '',
      technologies: []
    };
  }
  const id = filename
    .split('/')
    .pop()!
    .replace('.md', '')
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
    } else if (header.includes('period')) {
      period = body;
    } else if (header.includes('what i did')) {
      details = body;
    } else if (header.includes('technologies and tools')) {
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
    technologies
  };
}

export const projects: Project[] = Object.entries(projectModules)
  .map(([path, module]) => parseProject(path, module.default))
  .sort((a, b) => a.name.localeCompare(b.name));

export const experiences: Experience[] = Object.entries(experienceModules)
  .map(([path, module]) => parseExperience(path, module.default))
  // We might want to sort experiences by period, but for now name is fine or just leave it as is.
  // Assuming filenames might have numbers or we just sort them.
  .sort((a, b) => a.name.localeCompare(b.name));
