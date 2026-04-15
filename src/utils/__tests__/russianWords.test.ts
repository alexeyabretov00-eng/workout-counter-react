import { describe, expect, test } from 'vitest';

import { numberToRussianWords } from '../russianWords';

describe('numberToRussianWords', () => {
  test('maps small numbers', () => {
    expect(numberToRussianWords(0)).toBe('ноль');
    expect(numberToRussianWords(5)).toBe('пять');
    expect(numberToRussianWords(19)).toBe('девятнадцать');
  });

  test('maps tens and compound 20–99', () => {
    expect(numberToRussianWords(20)).toBe('двадцать');
    expect(numberToRussianWords(21)).toBe('двадцать один');
    expect(numberToRussianWords(99)).toBe('девяносто девять');
  });

  test('maps hundreds and recursion', () => {
    expect(numberToRussianWords(100)).toBe('сто');
    expect(numberToRussianWords(101)).toBe('сто один');
    expect(numberToRussianWords(999)).toBe('девятьсот девяносто девять');
  });

  test('truncates and clamps negatives to zero', () => {
    expect(numberToRussianWords(-3)).toBe('ноль');
    expect(numberToRussianWords(3.7)).toBe('три');
  });

  test('falls back to string for 1000+', () => {
    expect(numberToRussianWords(1000)).toBe('1000');
  });
});
