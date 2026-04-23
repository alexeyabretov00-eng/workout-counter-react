import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// antd `useBreakpoint` / layout hooks expect `matchMedia` (jsdom has none by default)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// `antd` Select / dropdown uses `@rc-component/resize-observer` (jsdom has none)
const ResizeObserverMock: typeof globalThis.ResizeObserver = class {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_callback: globalThis.ResizeObserverCallback) {}
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof globalThis.ResizeObserver;
globalThis.ResizeObserver = ResizeObserverMock;

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
