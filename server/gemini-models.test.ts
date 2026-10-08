import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseModelList, mergeModels, DEFAULT_MODELS, type RawModel } from './gemini-models';

function model(name: string, methods: string[] = ['generateContent', 'countTokens']): RawModel {
  return { name, supportedGenerationMethods: methods };
}

test('parseModelList keeps only Flash/Flash-Lite chat models', () => {
  const list = parseModelList([
    model('models/gemini-2.5-flash'),
    model('models/gemini-2.5-flash-lite'),
    model('models/text-embedding-004', ['embedContent']),
    model('models/imagen-3.0-generate-002'),
    model('models/gemini-2.5-pro'),
    model('models/gemini-2.0-flash-image', ['generateContent']),
    model('models/gemini-3.8-flash-tts', ['generateContent']),
    model('models/aqa'),
  ]);
  assert.deepEqual(list, ['gemini-2.5-flash', 'gemini-2.5-flash-lite']);
});

test('parseModelList excludes models without generateContent', () => {
  const list = parseModelList([
    { name: 'models/gemini-2.5-flash', supportedGenerationMethods: ['countTokens'] },
    { name: 'models/gemini-2.5-flash' },
  ]);
  assert.deepEqual(list, []);
});

test('parseModelList sorts newest version first', () => {
  const list = parseModelList([
    model('models/gemini-2-flash'),
    model('models/gemini-3.5-flash'),
    model('models/gemini-3-flash'),
    model('models/gemini-4-flash'),
  ]);
  assert.deepEqual(list, ['gemini-4-flash', 'gemini-3.5-flash', 'gemini-3-flash', 'gemini-2-flash']);
});

test('parseModelList puts latest aliases first and lite after non-lite', () => {
  const list = parseModelList([
    model('models/gemini-2.5-flash-lite'),
    model('models/gemini-2.5-flash'),
    model('models/gemini-flash-latest'),
  ]);
  assert.deepEqual(list, ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite']);
});

test('parseModelList dedupes and caps at 7 entries', () => {
  const raw = Array.from({ length: 12 }, (_, i) => model(`models/gemini-${i}.0-flash`));
  raw.push(model('models/gemini-11.0-flash'));
  const list = parseModelList(raw);
  assert.equal(list.length, 7);
  assert.equal(new Set(list).size, list.length);
  assert.equal(list[0], 'gemini-11.0-flash');
});

test('parseModelList tolerates malformed input', () => {
  assert.deepEqual(parseModelList(undefined), []);
  assert.deepEqual(parseModelList([{ name: 'models/gemini-2.5-flash' }] as RawModel[]), []);
});

test('mergeModels puts the primary model first and dedupes', () => {
  assert.deepEqual(mergeModels('gemini-custom', ['gemini-a', 'gemini-b']), [
    'gemini-custom',
    'gemini-a',
    'gemini-b',
  ]);
  assert.deepEqual(mergeModels('gemini-a', ['gemini-a', 'gemini-b']), ['gemini-a', 'gemini-b']);
  assert.deepEqual(mergeModels(undefined, ['gemini-a']), ['gemini-a']);
  assert.deepEqual(mergeModels('', ['gemini-a', '']), ['gemini-a']);
});

test('DEFAULT_MODELS is a non-empty fallback list', () => {
  assert.ok(DEFAULT_MODELS.length > 0);
  assert.ok(DEFAULT_MODELS.every((m) => typeof m === 'string' && m.startsWith('gemini-')));
});
