import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

app.use(cors());
app.use(express.json());

// Serve React static build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '..', 'dist')));
  // Handle SPA routing — serve index.html for non-API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
  });
}

// ─── Load all CV context ───────────────────────────────────────────────────
function loadContext(): string {
  const parts: string[] = [];
  const base = join(__dirname, '..', 'src');

  const MONTHS: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };

  function parseDate(dateStr: string): number {
    // e.g. "August 2015" or "December 2025"
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length < 2) return 0;
    const month = MONTHS[parts[0]] ?? 0;
    const year = parseInt(parts[1]);
    return year * 12 + month;
  }

  function sortExperienceFiles(files: string[], dir: string): string[] {
    return files.sort((a, b) => {
      // Extract period lines from each file
      const readPeriod = (f: string) => {
        try {
          const content = readFileSync(join(dir, f), 'utf8');
          const periodMatch = content.match(/^## Period\s*\n([\s\S]*?)(?=\n##|$)/m);
          if (!periodMatch) return { start: 0, end: Infinity };
          const period = periodMatch[1].trim(); // e.g. "August 2015 — July 2017" or "December 2025 — Present"
          const [startStr, endStr] = period.split('—').map(s => s.trim());
          const start = parseDate(startStr);
          const end = endStr.toLowerCase() === 'present' ? Infinity : parseDate(endStr);
          return { start, end };
        } catch {
          return { start: 0, end: Infinity };
        }
      };
      const aPeriod = readPeriod(a);
      const bPeriod = readPeriod(b);
      return aPeriod.start - bPeriod.start;
    });
  }

  const dirs = [
    { dir: join(base, 'experiences'), label: 'WORK EXPERIENCE' },
    { dir: join(base, 'summaries'), label: 'PERSONAL PROJECTS' },
  ];

  for (const { dir, label } of dirs) {
    parts.push(`\n## ${label}\n`);
    try {
      const files = readdirSync(dir).filter(f => f.endsWith('.md')).sort();
      const sorted = label === 'WORK EXPERIENCE' ? sortExperienceFiles(files, dir) : files;
      for (const file of sorted) {
        const content = readFileSync(join(dir, file), 'utf8');
        // Strip custom markdown extensions (width, align, etc.)
        const cleaned = content
          .replace(/\{[^}]+\}/g, '')
          .replace(/<[^>]+>/g, '')
          .replace(/^#+\s*/gm, (m) => m)
          .trim();
        parts.push(`\n--- ${file} ---\n\n${cleaned}\n`);
      }
    } catch (e) {
      parts.push(`(Could not load ${label})\n`);
    }
  }

  // Add About Me
  try {
    const about = readFileSync(join(base, 'components', 'about_me', 'About_me.en.md'), 'utf8')
      .replace(/\{[^}]+\}/g, '').replace(/<[^>]+>/g, '').trim();
    parts.push(`\n## ABOUT ALESSANDRO\n\n${about}\n`);
  } catch (e) {}

  // Add Recommendations
  try {
    const recDir = join(base, 'assets', 'recommendations');
    const recFiles = readdirSync(recDir).filter(f => f.endsWith('.md')).sort();
    if (recFiles.length > 0) {
      parts.push(`\n## RECOMMENDATIONS\n`);
      for (const file of recFiles) {
        const content = readFileSync(join(recDir, file), 'utf8')
          .replace(/\{[^}]+\}/g, '').replace(/<[^>]+>/g, '').trim();
        parts.push(`\n--- ${file} ---\n\n${content}\n`);
      }
    }
  } catch (e) {}

  return parts.join('\n');
}

const CONTEXT = loadContext();

const SYSTEM_PROMPT = (currentPageContext: string) => `You are Sandro — Alessandro Muzzi's digital twin and AI agent. You have complete knowledge of Alessandro's professional career, personal projects, technical skills, and personality.

## Current Page Context
The user is currently viewing this part of Alessandro's portfolio:
${currentPageContext}

## Who Alessandro Is
- Staff Software Engineer & Lead Architect at VERSES (2025–present), previously Senior Software Engineer (2024-2025) and Full Stack Drone Developer (2022–2024)
- **Engineer by profession, maker by heart** — driven by the "physics" of how things work; bridges the gap between digital and physical across programming, electronics, and digital fabrication
- Force multiplier: bridges complex technical gaps, makes and discuss ADRs, leverages individual team members skills, translates AI research into production infrastructure
- Firm believer in **Architectural Decision Records (ADRs)** to ensure technical choices are logical, documented, and aligned with long-term goals
- Mentors junior engineers, leads architecture team, drives cross-functional alignment
- Deep expertise: Python, C++, Kotlin, embedded systems, AI/ML (NLP, Active Inference), drones, 3D printing, IoT
- Makes complex topics accessible — described as having **"podcast-ready" clarity** — ensures all parties understand the "why" behind decisions
- Backend/engine builder who also cares about craft and reliability
- **Communicative Clarity:** An architecture is only as good as its understandability; strives to communicate complex technical subjects with a level of clarity that has been described as "podcast-ready", ensuring all involved parties understand the "why" behind a decision, even the less technical ones
- **Empathetic Mentorship:** Actively champions the growth of junior engineers, aligning their personal aspirations with the company's systemic vision
- **Builder at Heart:** When not at an architectural dashboard, likely tinkering with Arduino or experimenting with new 3D printing systems; curiosity about "how things work" is constant and unyielding

## Key Career Stories
- SOLVED A 2-YEAR MEMORY LEAK: At Spark Security, debugged a C++/C# interop memory leak in a .NET video processing pipeline used by Polizia di Milano. Used WinDbg, !heap commands, and C++ heap corruption debugging to identify the bug in the C++ interop layer called from C# via P/Invoke, fix it, and eliminate nightly process restarts.
- ACCELERATED BERT BY 60%: At Maps Group, built an NLP pipeline for clinical risk identification using BERT embeddings + SVM/Logistic Regression. Reduced inference time from 35s to 14s per document.
- BVLOS DRONE COMPLIANCE: At VERSES, designed autonomous drone flight architecture for 5 European "Living Labs" (San Raffaele Hospital, Milan (IT); HTC Eindhoven (NL); Saragoza (SP); Tartu (EE); Oulu (FIN)) for the FF2020 project. 100% EU regulatory compliance via geospatial governance boundaries in mission logic.
- ACTIVE INFERENCE FRAMEWORK: Lead Architect for VERSES' Active Inference AI framework — translating complex AI research into production infrastructure.

## Personal Projects
- GARGANTUA: Large-format 3D printer (400×400×768mm build volume) built from scratch with BTT Manta M8P + Klipper firmware, custom CAD, dual hotends, enclosure with dehumidification
- DIY DRONE: Android-controlled drone built from scratch (C, Kotlin, ESP8266, KK2 flight controller), UDP protocol for real-time control
- AUTOMATIC DRAINAGE SYSTEM: IoT home automation to drain cellar's dehumidifier's collected water 1st version with home-made PCB, then with Arduino Nano + Sensors
- BAYESIAN NETWORK DRIVEN SPRINKLER: Automatic sprinkler driven by a Bayesian network trained on plants data and sensors. Based on ESP8266, Flutter app, home server, soil and air sensors
- LITOPHANE LAMP: Custom 3D-printed LED lamp with lithophane diffuser

## Personality & Communication Style
- Direct, no fluff — answers what is asked first, then adds context
- Deep technical knowledge but explains without condescension  
- Pragmatic: focuses on what works, not on being clever
- When asked about handling system crashes/bugs: references the Spark Security memory leak story as a concrete example of systematic debugging approach

## Citations (Real Feedback from Colleagues)
- Lori Pike (VP Engineering @ VERSES): "Alessandro doesn't skim the surface — he goes deep. He's also one of the best communicators I've worked with at a technical level. Alessandro has a gift for taking complex topics and making them accessible. That same clarity made him an exceptional mentor."
- Jeff Pike (Principal Software Engineer @ VERSES): "He combined strong engineering skills with a pragmatic approach to architecture, and played a key role in system testing and validation to ensure reliability at scale."

The recommendations above (from the RECOMMENDATIONS section in your context) are real endorsements from colleagues. Use them to answer questions about Alessandro's leadership, communication, mentorship, and engineering impact.

## Important Rules
- Answer in the language the user uses (Italian if they write in Italian, English if English)
- Never invent facts — stick to what is in the context provided below
- If you don't know something, say so
- Be concise but thorough — give complete answers, not bare minimums
- When asked about debugging, architecture, leadership, or engineering decisions, draw on Alessandro's real experience
- Always take into account the chronological order and duration of work experiences when reasoning about his career progression, skill development, or timeline of achievements

## Context from CV/Portfolio
${CONTEXT}

Remember: You ARE Sandro. You have all this knowledge. Respond naturally as Alessandro would, drawing on his real experience.`;

app.post('/api/digitalTwin', async (req, res) => {
  const { messages, currentPage } = req.body as { messages: Array<{ role: string; content: string }>; currentPage?: { type: string; id?: string; name?: string; summary?: string; description?: string; technologies?: string[]; bodyMarkdown?: string; period?: string; company?: string; link?: string } };

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  // Build current page context for Sandro
  let currentPageContext = "No specific page (homepage)";
  if (currentPage) {
    const parts: string[] = [];
    parts.push(`Page type: ${currentPage.type}`);
    if (currentPage.name) parts.push(`Title: ${currentPage.name}`);
    if (currentPage.company) parts.push(`Company: ${currentPage.company}`);
    if (currentPage.period) parts.push(`Period: ${currentPage.period}`);
    if (currentPage.summary) parts.push(`Summary: ${currentPage.summary}`);
    if (currentPage.description) parts.push(`Description: ${currentPage.description}`);
    if (currentPage.technologies?.length) parts.push(`Technologies: ${currentPage.technologies.join(', ')}`);
    if (currentPage.link) parts.push(`Link: ${currentPage.link}`);
    if (currentPage.bodyMarkdown) parts.push(`Full content:\n${currentPage.bodyMarkdown.substring(0, 2000)}`);
    currentPageContext = parts.join('\n');
  }

  // Build the conversation with system prompt
  const apiMessages = [
    { role: 'user' as const, content: SYSTEM_PROMPT(currentPageContext) },
    ...messages.slice(-12), // keep last 12 turns for context
  ];

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'MINIMAX_API_KEY not configured' });
  }

  try {
    const response = await fetch('https://api.minimax.io/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        max_tokens: 16384,
        messages: apiMessages,
      }),
    });

    const raw = await response.text();
    console.log('MiniMax raw response status:', response.status, 'body:', raw.slice(0, 500));

    if (!response.ok) {
      console.error('MiniMax API error:', response.status, raw);
      return res.status(response.status).json({ error: 'Upstream API error', detail: raw });
    }

    const data = JSON.parse(raw) as { content?: Array<{ type: string; text?: string; thinking?: string }>; error?: { message?: string } };

    // MiniMax may return an error inside the body
    if (data.error) {
      console.error('MiniMax error in body:', data.error);
      return res.status(400).json({ error: data.error.message || 'MiniMax error' });
    }

    // MiniMax returns content blocks with type: "text" or type: "thinking"
    const textBlock = data.content?.find((block: any) => block.type === 'text');
    const reply = textBlock?.text ?? 'No response from model.';
    res.json({ reply });
  } catch (e: any) {
    console.error('Proxy error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Health check endpoint
app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sandro backend running on http://0.0.0.0:${PORT}`);
});
