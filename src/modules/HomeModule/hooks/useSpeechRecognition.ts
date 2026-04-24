import { useEffect, useMemo, useRef } from 'react';
import { useBrowserSpeechRecognition } from '@hooks';

import { useAppDispatch } from '@store';
import { eventBus, matchesCommand, normalizeSpeechText } from '@utils';

import { EVENT_WORKOUT_SESSION_CONTROLS_COMMAND } from '../constants';
import { updateHomeModuleState } from '../store';

type SpeechExercise = {
  id: string;
  name: string;
  voiceAliases?: string[];
};

type UseSpeechRecognitionParams = {
  exercises: SpeechExercise[];
  isRunning: boolean;
  isRestCountdownActive: boolean;
  isStartVoiceCommandEnabled: boolean;
};

const START_COMMANDS = ['старт', 'начинаем упражнение', 'начать упражнение'];
const PAUSE_COMMANDS = ['пауза', 'поставь на паузу', 'остановись'];
const RESET_COMMANDS = ['сброс', 'сбросить', 'обнулить', 'сбрось'];
const SHUTDOWN_COMMANDS = ['стоп', 'стоп упражнение', 'закончи упражнение'];
const REST_MINUTE_COMMANDS: Array<{ minutes: number; phrases: string[] }> = [
  {
    minutes: 1,
    phrases: ['отдых 1', 'отдых 1 минута', 'отдых 1 минуту', 'отдых одна минута'],
  },
  { minutes: 2, phrases: ['отдых 2', 'отдых 2 минуты', 'отдых две минуты'] },
  { minutes: 3, phrases: ['отдых 3', 'отдых 3 минуты', 'отдых три минуты'] },
  { minutes: 5, phrases: ['отдых 5', 'отдых 5 минут', 'отдых пять минут'] },
];
const COMMAND_COOLDOWN_MS = 900;
const REST_COMMAND_COOLDOWN_MS = 4_000;

export const useSpeechRecognition = ({
  exercises,
  isRunning,
  isRestCountdownActive,
  isStartVoiceCommandEnabled,
}: UseSpeechRecognitionParams) => {
  const dispatch = useAppDispatch();

  const commandExerciseLookup = useMemo(() => {
    const pairs: Array<[string, string]> = [];

    for (const exercise of exercises) {
      const normalizedName = normalizeSpeechText(exercise.name);
      pairs.push([normalizedName, exercise.id]);

      for (const alias of exercise.voiceAliases ?? []) {
        pairs.push([normalizeSpeechText(alias), exercise.id]);
      }
    }

    return pairs;
  }, [exercises]);

  const isRunningRef = useRef(isRunning);
  const isRestCountdownActiveRef = useRef(isRestCountdownActive);
  const isStartVoiceCommandEnabledRef = useRef(isStartVoiceCommandEnabled);
  const lastCommandRef = useRef<{ key: string; at: number } | null>(null);

  useEffect(() => {
    isRunningRef.current = isRunning;
    isRestCountdownActiveRef.current = isRestCountdownActive;
    isStartVoiceCommandEnabledRef.current = isStartVoiceCommandEnabled;
  }, [isRestCountdownActive, isRunning, isStartVoiceCommandEnabled]);

  const { voiceStatus } = useBrowserSpeechRecognition({
    onTranscript: rawTranscript => {
      const transcript = normalizeSpeechText(rawTranscript);
      if (!transcript) {
        return;
      }

      const runCommand = (key: string, action: () => void, cooldownMs = COMMAND_COOLDOWN_MS) => {
        const now = Date.now();
        if (
          lastCommandRef.current &&
          lastCommandRef.current.key === key &&
          now - lastCommandRef.current.at < cooldownMs
        ) {
          return;
        }

        lastCommandRef.current = { key, at: now };
        action();
      };

      const isStartCommand = START_COMMANDS.some(command => matchesCommand(transcript, command));
      if (isStartCommand && !isRunningRef.current && isStartVoiceCommandEnabledRef.current) {
        runCommand('start', () => {
          eventBus.emit(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, { type: 'start' });
        });
        return;
      }

      const isPauseCommand = PAUSE_COMMANDS.some(command => matchesCommand(transcript, command));
      if (isPauseCommand && isRunningRef.current) {
        runCommand('pause', () =>
          eventBus.emit(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, { type: 'pause' }),
        );
        return;
      }

      const isResetCommand = RESET_COMMANDS.some(command => matchesCommand(transcript, command));
      if (isResetCommand && isRunningRef.current && !isRestCountdownActiveRef.current) {
        runCommand('reset', () =>
          eventBus.emit(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, { type: 'reset' }),
        );
        return;
      }

      const isShutdownCommand = SHUTDOWN_COMMANDS.some(command =>
        matchesCommand(transcript, command),
      );
      if (isShutdownCommand && isRunningRef.current && !isRestCountdownActiveRef.current) {
        runCommand('shutdown', () =>
          eventBus.emit(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, { type: 'shutdown' }),
        );
        return;
      }

      for (const option of REST_MINUTE_COMMANDS) {
        if (option.phrases.some(phrase => matchesCommand(transcript, phrase))) {
          runCommand(
            `rest-${option.minutes}`,
            () => {
              dispatch(updateHomeModuleState({ restDurationMinutes: option.minutes }));
              eventBus.emit(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, {
                type: 'shutdown',
                restDurationOverrideMs: option.minutes * 60_000,
              });
            },
            REST_COMMAND_COOLDOWN_MS,
          );
          return;
        }
      }

      if (isRunningRef.current) {
        return;
      }

      for (const [phrase, nextExerciseId] of commandExerciseLookup) {
        if (matchesCommand(transcript, phrase)) {
          runCommand(`exercise-${nextExerciseId}`, () =>
            dispatch(updateHomeModuleState({ exerciseId: nextExerciseId })),
          );
          return;
        }
      }
    },
  });

  return { voiceStatus };
};
