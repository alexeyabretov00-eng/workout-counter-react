import { numberToRussianWords } from './russianWords'

export const normalizeSpeechText = (value: string): string => {
  return value.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim()
}

export const matchesCommand = (transcript: string, phrase: string): boolean => {
  return (
    transcript === phrase ||
    transcript.includes(` ${phrase} `) ||
    transcript.startsWith(`${phrase} `) ||
    transcript.endsWith(` ${phrase}`)
  )
}

export const speakRussianCount = (value: number): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return
  }

  const utterance = new SpeechSynthesisUtterance(numberToRussianWords(value))
  utterance.lang = 'ru-RU'
  utterance.rate = 1
  utterance.pitch = 1

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export const speakRussianText = (text: string): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return
  }

  const synth = window.speechSynthesis
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ru-RU'
  utterance.rate = 1
  utterance.pitch = 1

  // Some browsers drop utterances fired in media/recognition callbacks.
  setTimeout(() => {
    synth.cancel()
    synth.resume()
    synth.speak(utterance)
  }, 10)
}
