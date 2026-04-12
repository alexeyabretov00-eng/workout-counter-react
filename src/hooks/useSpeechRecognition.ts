import { useEffect, useMemo, useRef, useState } from 'react'
import type { WorkoutSessionChromeControlAction } from '../contexts'
import type { ExerciseDetector } from '../exercises'
import type { VoiceStatus } from '../types'
import { matchesCommand, normalizeSpeechText } from '../utils'

const TRANSIENT_SPEECH_ERRORS = new Set(['aborted', 'no-speech'])

type UseSpeechRecognitionParams = {
  exercises: ExerciseDetector[]
  isRunning: boolean
  isRestCountdownActive: boolean
  isCameraInitializing: boolean
  isModelReady: boolean
  dispatchChromeControl: (action: WorkoutSessionChromeControlAction) => void
}

const START_COMMANDS = ['старт', 'начинаем упражнение', 'начать упражнение']
const PAUSE_COMMANDS = ['пауза', 'поставь на паузу', 'остановись']
const RESET_COMMANDS = ['сброс', 'сбросить', 'обнулить', 'сбрось']
const SHUTDOWN_COMMANDS = ['стоп', 'стоп упражнение', 'закончи упражнение']
const REST_MINUTE_COMMANDS: Array<{ minutes: number; phrases: string[] }> = [
  { minutes: 1, phrases: ['отдых 1', 'отдых 1 минута', 'отдых 1 минуту', 'отдых одна минута'] },
  { minutes: 2, phrases: ['отдых 2', 'отдых 2 минуты', 'отдых две минуты'] },
  { minutes: 3, phrases: ['отдых 3', 'отдых 3 минуты', 'отдых три минуты'] },
  { minutes: 5, phrases: ['отдых 5', 'отдых 5 минут', 'отдых пять минут'] },
]
const COMMAND_COOLDOWN_MS = 900
const REST_COMMAND_COOLDOWN_MS = 4_000

const getInitialVoiceStatus = (): VoiceStatus => {
  return window.SpeechRecognition ?? window.webkitSpeechRecognition
    ? 'starting'
    : 'unsupported'
}

export const useSpeechRecognition = ({
  exercises,
  isRunning,
  isRestCountdownActive,
  isCameraInitializing,
  isModelReady,
  dispatchChromeControl,
}: UseSpeechRecognitionParams) => {
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>(() => getInitialVoiceStatus())

  const commandExerciseLookup = useMemo(() => {
    const pairs: Array<[string, string]> = []

    for (const exercise of exercises) {
      const normalizedName = normalizeSpeechText(exercise.name)
      pairs.push([normalizedName, exercise.id])

      for (const alias of exercise.voiceAliases ?? []) {
        pairs.push([normalizeSpeechText(alias), exercise.id])
      }
    }

    return pairs
  }, [exercises])

  const isRunningRef = useRef(isRunning)
  const isRestCountdownActiveRef = useRef(isRestCountdownActive)
  const isCameraInitializingRef = useRef(isCameraInitializing)
  const isModelReadyRef = useRef(isModelReady)
  const dispatchChromeControlRef = useRef(dispatchChromeControl)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const shouldRestartRef = useRef(false)
  const lastCommandRef = useRef<{ key: string; at: number } | null>(null)

  useEffect(() => {
    isRunningRef.current = isRunning
    isRestCountdownActiveRef.current = isRestCountdownActive
    isCameraInitializingRef.current = isCameraInitializing
    isModelReadyRef.current = isModelReady
    dispatchChromeControlRef.current = dispatchChromeControl
  }, [dispatchChromeControl, isCameraInitializing, isModelReady, isRestCountdownActive, isRunning])

  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!SpeechRecognitionCtor) {
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'ru-RU'
    recognition.continuous = true
    recognition.interimResults = true

    shouldRestartRef.current = true
    recognitionRef.current = recognition

    recognition.onstart = () => {
      setVoiceStatus('listening')
    }

    recognition.onresult = (event) => {
      const firstResult = event.results[event.resultIndex]
      if (!firstResult || firstResult.length === 0) {
        return
      }

      const transcript = normalizeSpeechText(firstResult[0].transcript)
      if (!transcript) {
        return
      }

      const runCommand = (key: string, action: () => void, cooldownMs = COMMAND_COOLDOWN_MS) => {
        const now = Date.now()
        if (
          lastCommandRef.current &&
          lastCommandRef.current.key === key &&
          now - lastCommandRef.current.at < cooldownMs
        ) {
          return
        }

        lastCommandRef.current = { key, at: now }
        action()
      }

      const isStartCommand = START_COMMANDS.some((command) =>
        matchesCommand(transcript, command),
      )

      if (
        isStartCommand &&
        !isRunningRef.current &&
        !isCameraInitializingRef.current &&
        isModelReadyRef.current
      ) {
        runCommand('start', () => {
          dispatchChromeControlRef.current({ type: 'start' })
        })
        return
      }

      const isPauseCommand = PAUSE_COMMANDS.some((command) =>
        matchesCommand(transcript, command),
      )
      if (isPauseCommand && isRunningRef.current) {
        runCommand('pause', () => dispatchChromeControlRef.current({ type: 'pause' }))
        return
      }

      const isResetCommand = RESET_COMMANDS.some((command) =>
        matchesCommand(transcript, command),
      )
      if (isResetCommand && isRunningRef.current && !isRestCountdownActiveRef.current) {
        runCommand('reset', () => dispatchChromeControlRef.current({ type: 'reset' }))
        return
      }

      const isShutdownCommand = SHUTDOWN_COMMANDS.some((command) =>
        matchesCommand(transcript, command),
      )
      if (
        isShutdownCommand &&
        isRunningRef.current &&
        !isRestCountdownActiveRef.current
      ) {
        runCommand('shutdown', () => dispatchChromeControlRef.current({ type: 'shutdown' }))
        return
      }

      for (const option of REST_MINUTE_COMMANDS) {
        if (option.phrases.some((phrase) => matchesCommand(transcript, phrase))) {
          runCommand(
            `rest-${option.minutes}`,
            () => {
              dispatchChromeControlRef.current({
                type: 'setRestDurationMinutes',
                minutes: option.minutes,
              })
              dispatchChromeControlRef.current({
                type: 'shutdown',
                restDurationOverrideMs: option.minutes * 60_000,
              })
            },
            REST_COMMAND_COOLDOWN_MS,
          )
          return
        }
      }

      if (isRunningRef.current) {
        return
      }

      for (const [phrase, nextExerciseId] of commandExerciseLookup) {
        if (matchesCommand(transcript, phrase)) {
          runCommand(`exercise-${nextExerciseId}`, () =>
            dispatchChromeControlRef.current({ type: 'setExerciseId', exerciseId: nextExerciseId }),
          )
          return
        }
      }
    }

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceStatus('blocked')
        shouldRestartRef.current = false
        return
      }

      if (TRANSIENT_SPEECH_ERRORS.has(event.error)) {
        return
      }

      setVoiceStatus('error')
    }

    recognition.onend = () => {
      if (!shouldRestartRef.current) {
        return
      }

      try {
        recognition.start()
        setVoiceStatus('listening')
      } catch {
        // Ignore repeated starts during rapid onend chains.
      }
    }

    const syncRecognitionToVisibility = () => {
      if (document.hidden) {
        shouldRestartRef.current = false
        try {
          recognition.stop()
        } catch {
          // ignore
        }
        setVoiceStatus('inactive-tab')
        return
      }

      shouldRestartRef.current = true
      setVoiceStatus('starting')
      try {
        recognition.start()
      } catch {
        setVoiceStatus('listening')
      }
    }

    document.addEventListener('visibilitychange', syncRecognitionToVisibility)
    syncRecognitionToVisibility()

    return () => {
      document.removeEventListener('visibilitychange', syncRecognitionToVisibility)
      shouldRestartRef.current = false
      recognition.onstart = null
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      recognition.stop()
      recognitionRef.current = null
    }
  }, [commandExerciseLookup])

  return { voiceStatus }
}
