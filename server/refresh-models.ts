import 'dotenv/config';
import { refreshModels, getModelsInfo } from './gemini-models';

// Manual trigger for the daily model refresh (npm run refresh:models)
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY not configured');
  process.exit(1);
}

const log = (level: 'INFO' | 'WARN' | 'ERROR', ...args: unknown[]) => {
  console[level === 'ERROR' ? 'error' : 'log'](`[${level}]`, ...args);
};

const ok = await refreshModels(apiKey, log);
if (ok) {
  const info = getModelsInfo();
  console.log(`Models (${info.count}), updated at ${info.updatedAt}`);
}
process.exit(ok ? 0 : 1);
