import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// RTL registers automatic cleanup only if global `afterEach` exists (Jest / Vitest globals).
// This project imports Vitest APIs explicitly (`globals: false`), so that hook is skipped.
afterEach(() => {
  cleanup();
});

globalThis.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
  lang = '';
  rate = 1;
  pitch = 1;
  text: string;
  constructor(text: string) {
    this.text = text;
  }
} as unknown as typeof SpeechSynthesisUtterance;
