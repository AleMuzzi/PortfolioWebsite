interface Project {
  id: string;
  name: string;
  summary: string;
  overview: string;
  how: string;
  technologies: string[];
}

interface MarkdownModule {
  default: string;
}

const modules = import.meta.glob('./summaries/*.md', { query: '?raw', eager: true }) as Record<string, MarkdownModule>;

function parseMarkdown(filename: string, content: unknown): Project {
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

export const projects: Project[] = Object.entries(modules)
  .map(([path, module]) => parseMarkdown(path, module.default))
  .sort((a, b) => a.name.localeCompare(b.name));
