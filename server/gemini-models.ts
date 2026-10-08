import { readFileSync, writeFileSync, renameSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CACHE_FILE = join(__dirname, 'gemini-models.json');
const MAX_MODELS = 7;
const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // once a day

// Last-resort list used when both the API fetch and the disk cache are
// unavailable. Kept identical to the historical hard-coded fallback list.
export const DEFAULT_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
  'gemini-4.5-flash',
  'gemini-2-flash',
];

export type LogFn = (level: 'INFO' | 'WARN' | 'ERROR', ...args: unknown[]) => void;

export interface RawModel {
  name?: string;
  supportedGenerationMethods?: string[];
}

interface CacheFile {
  updatedAt?: string;
  models?: unknown;
}

// ─── Pure helpers (unit-tested) ──────────────────────────────────────────────

function isFlashModel(name: string): boolean {
  // Exclude image/TTS variants: they accept generateContent but cannot chat.
  return /^gemini-.*flash/i.test(name) && !/(image|tts)/i.test(name);
}

function versionRank(name: string): number[] {
  return (name.match(/\d+/g) ?? []).map(Number);
}

function compareVersions(a: string, b: string): number {
  const av = versionRank(a);
  const bv = versionRank(b);
  const len = Math.max(av.length, bv.length);
  for (let i = 0; i < len; i++) {
    const diff = (bv[i] ?? 0) - (av[i] ?? 0); // descending
    if (diff !== 0) return diff;
  }
  return 0;
}

function compareModels(a: string, b: string): number {
  const aLatest = /-latest/i.test(a);
  const bLatest = /-latest/i.test(b);
  if (aLatest !== bLatest) return aLatest ? -1 : 1;
  const v = compareVersions(a, b);
  if (v !== 0) return v;
  const aLite = /lite/i.test(a);
  const bLite = /lite/i.test(b);
  if (aLite !== bLite) return aLite ? 1 : -1;
  return a.localeCompare(b);
}

/**
 * Filter + normalize the raw Gemini model list: keep only chat-capable
 * Flash / Flash-Lite models, strip the `models/` prefix, sort newest first
 * and cap the result at MAX_MODELS entries.
 */
export function parseModelList(rawModels: RawModel[] | undefined): string[] {
  if (!Array.isArray(rawModels)) return [];
  const names = rawModels
    .filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
    .map((m) => (m.name ?? '').replace(/^models\//, ''))
    .filter((name) => isFlashModel(name));
  return [...new Set(names)].sort(compareModels).slice(0, MAX_MODELS);
}

/**
 * Build the ordered model list used for requests: the optional primary
 * model (GEMINI_MODEL) first, then the cached/discovered models, deduped.
 */
export function mergeModels(primary: string | undefined, base: string[]): string[] {
  const list = [...base];
  if (primary) list.unshift(primary);
  return [...new Set(list.filter(Boolean))];
}

// ─── Disk cache ──────────────────────────────────────────────────────────────

function readCache(): { updatedAt: string | null; models: string[] } | null {
  try {
    if (!existsSync(CACHE_FILE)) return null;
    const parsed = JSON.parse(readFileSync(CACHE_FILE, 'utf8')) as CacheFile;
    if (!Array.isArray(parsed.models) || parsed.models.length === 0) return null;
    const models = parsed.models.filter((m): m is string => typeof m === 'string' && m.length > 0);
    if (models.length === 0) return null;
    return { updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null, models };
  } catch {
    return null;
  }
}

function writeCache(models: string[]): void {
  const payload = JSON.stringify({ updatedAt: new Date().toISOString(), models }, null, 2);
  const tmp = `${CACHE_FILE}.tmp`;
  writeFileSync(tmp, payload);
  renameSync(tmp, CACHE_FILE);
}

// ─── Module state ────────────────────────────────────────────────────────────

let memoryModels: string[] | null = null;
let lastRefreshMs = 0;

function activeModels(): { models: string[]; updatedAt: string | null } {
  if (memoryModels) {
    return { models: memoryModels, updatedAt: lastRefreshMs ? new Date(lastRefreshMs).toISOString() : null };
  }
  const disk = readCache();
  if (disk) {
    memoryModels = disk.models;
    lastRefreshMs = disk.updatedAt ? Date.parse(disk.updatedAt) || 0 : 0;
    return { models: disk.models, updatedAt: disk.updatedAt };
  }
  return { models: DEFAULT_MODELS, updatedAt: null };
}

/** Ordered model list for the Gemini request loop (primary first). */
export function getFallbackModels(primary?: string): string[] {
  return mergeModels(primary, activeModels().models);
}

/** Model list status for the /health endpoint. */
export function getModelsInfo(): { count: number; updatedAt: string | null } {
  const { models, updatedAt } = activeModels();
  return { count: models.length, updatedAt };
}

// ─── Refresh (cron) ──────────────────────────────────────────────────────────

export async function fetchModelList(apiKey: string): Promise<string[] | null> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
      { method: 'GET' },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { models?: RawModel[] };
    const list = parseModelList(data.models);
    return list.length > 0 ? list : null;
  } catch {
    return null;
  }
}

/**
 * Download the current Gemini model list from the API and persist it.
 * Never throws; returns false (keeping the previous list) on failure.
 */
export async function refreshModels(apiKey: string, log?: LogFn): Promise<boolean> {
  const list = await fetchModelList(apiKey);
  if (!list) {
    log?.('WARN', 'Gemini model refresh failed — keeping previous list');
    return false;
  }
  memoryModels = list;
  lastRefreshMs = Date.now();
  try {
    writeCache(list);
  } catch (e: any) {
    log?.('WARN', `Gemini model cache write failed: ${e?.message ?? e}`);
  }
  log?.('INFO', `Gemini model list refreshed (${list.length} models): ${list.join(', ')}`);
  return true;
}

/**
 * Daily scheduler: refresh at startup when the cache is missing or older
 * than 24h, then re-check every 24h. Failures are logged, never fatal.
 */
export function startModelRefreshScheduler(opts: { apiKey?: string; log: LogFn }): void {
  activeModels(); // hydrate state from disk cache (if any) before first check

  const run = () => {
    if (!opts.apiKey) {
      opts.log('WARN', 'Gemini model refresh skipped: GEMINI_API_KEY not configured');
      return;
    }
    void refreshModels(opts.apiKey, opts.log);
  };

  if (!lastRefreshMs || Date.now() - lastRefreshMs >= REFRESH_INTERVAL_MS) {
    run();
  }

  setInterval(() => {
    if (!lastRefreshMs || Date.now() - lastRefreshMs >= REFRESH_INTERVAL_MS) {
      run();
    }
  }, REFRESH_INTERVAL_MS).unref();
}
