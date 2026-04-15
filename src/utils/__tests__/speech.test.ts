import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  matchesCommand,
  normalizeSpeechText,
  speakRussianCount,
  speakRussianText,
} from '../speech';

describe('speech helpers', () => {
  test('normalizeSpeechText lowercases and strips punctuation', () => {
    expect(normalizeSpeechText('  Привет, Мир!  ')).toBe('привет мир');
  });

  test('matchesCommand detects exact and padded phrase', () => {
    expect(matchesCommand('стоп', 'стоп')).toBe(true);
    expect(matchesCommand('сейчас стоп там', 'стоп')).toBe(true);
    expect(matchesCommand('стоп сейчас', 'стоп')).toBe(true);
    expect(matchesCommand('настопить', 'стоп')).toBe(false);
  });

  test('speakRussianCount speaks when synthesis exists', () => {
    const speak = vi.fn();
    const cancel = vi.fn();
    vi.stubGlobal('speechSynthesis', { speak, cancel } as unknown as SpeechSynthesis);
    speakRussianCount(3);
    expect(cancel).toHaveBeenCalled();
    expect(speak).toHaveBeenCalled();
  });

  test('speakRussianText schedules speak', () => {
    vi.useFakeTimers();
    const speak = vi.fn();
    const cancel = vi.fn();
    const resume = vi.fn();
    vi.stubGlobal('speechSynthesis', { speak, cancel, resume } as unknown as SpeechSynthesis);
    speakRussianText('тест');
    vi.runAllTimers();
    expect(cancel).toHaveBeenCalled();
    expect(resume).toHaveBeenCalled();
    expect(speak).toHaveBeenCalled();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
});
