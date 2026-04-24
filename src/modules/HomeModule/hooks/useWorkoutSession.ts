import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCameraStream } from '@hooks';
import type { SessionStatus } from '@types';

import { useAppDispatch } from '@store';
import {
  clearCanvas,
  drawFrame,
  drawRestCountdown,
  numberToRussianWords,
  speakRussianCount,
  speakRussianText,
} from '@utils';

import {
  type ExerciseRuntimeState,
  type ExerciseState,
  getExerciseDetectorByIdOrDefault,
} from '../exercises';
import { PoseLandmarkerService } from '../services';
import { updateHomeModuleState } from '../store';

const WorkoutSessionRuntimeDefaultState: ExerciseRuntimeState = {
  reps: 0,
  phase: '-',
  confidence: 0,
  metrics: {},
  isBodyDetected: false,
};
const MODEL_PROGRESS_UPDATE_INTERVAL_MS = 80;

export const useWorkoutSession = (selectedExerciseId: string, restDurationMs: number) => {
  const dispatch = useAppDispatch();

  const memoryVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const restRafRef = useRef<number | null>(null);
  const restCountdownVersionRef = useRef(0);
  const poseServiceRef = useRef(new PoseLandmarkerService());
  const detectorStateRef = useRef<ExerciseState>({});
  const runtimeRef = useRef<ExerciseRuntimeState>(WorkoutSessionRuntimeDefaultState);
  const restDurationMsRef = useRef(restDurationMs);

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const { startCamera, stopCamera } = useCameraStream(
    error => {
      dispatch(
        updateHomeModuleState({
          cameraStatus: 'error',
          cameraError: error,
        }),
      );
    },
    () => {
      dispatch(
        updateHomeModuleState({
          cameraStatus: 'ready',
          cameraError: null,
        }),
      );
    },
  );

  const isRunning = sessionStatus === 'running';

  const detector = useMemo(
    () => getExerciseDetectorByIdOrDefault(selectedExerciseId),
    [selectedExerciseId],
  );

  useEffect(() => {
    restDurationMsRef.current = restDurationMs;
  }, [restDurationMs]);

  useEffect(() => {
    memoryVideoRef.current = document.createElement('video');
    memoryVideoRef.current.playsInline = true;
    memoryVideoRef.current.muted = true;

    return () => {
      memoryVideoRef.current = null;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const poseService = poseServiceRef.current;
    let lastProgressUpdateAt = 0;
    let lastProgressValue: number | null = null;

    const initModel = async () => {
      try {
        if (isMounted) {
          dispatch(
            updateHomeModuleState({
              modelStatus: 'loading',
              modelLoadingProgress: null,
            }),
          );
        }

        await poseService.init(progress => {
          if (!isMounted) {
            return;
          }

          const now = performance.now();
          const isNextPercent = progress !== lastProgressValue;
          const isThrottleWindowElapsed =
            now - lastProgressUpdateAt >= MODEL_PROGRESS_UPDATE_INTERVAL_MS;
          const shouldDispatchProgress =
            progress === 100 || (isNextPercent && isThrottleWindowElapsed);

          if (!shouldDispatchProgress) {
            return;
          }

          lastProgressValue = progress;
          lastProgressUpdateAt = now;

          dispatch(
            updateHomeModuleState({
              modelStatus: 'loading',
              modelLoadingProgress: progress,
            }),
          );
        });

        if (isMounted) {
          dispatch(
            updateHomeModuleState({
              modelStatus: 'ready',
              modelLoadingProgress: null,
            }),
          );
        }
      } catch (error) {
        console.error('Failed to initialize pose model', error);
        if (isMounted) {
          dispatch(
            updateHomeModuleState({
              modelStatus: 'error',
              modelLoadingProgress: null,
            }),
          );
        }
      }
    };

    void initModel();

    return () => {
      isMounted = false;
      poseService.dispose();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    if (restRafRef.current) {
      cancelAnimationFrame(restRafRef.current);
      restRafRef.current = null;
    }

    const renderFrame = () => {
      const video = memoryVideoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !isRunning) {
        return;
      }

      const frame = poseServiceRef.current.detect(video, performance.now());
      const result = detector.update(frame.landmarks, detectorStateRef.current);
      detectorStateRef.current = result.nextState;

      const nextRuntime: ExerciseRuntimeState = {
        reps: runtimeRef.current.reps + result.repDelta,
        phase: result.phase,
        confidence: result.confidence,
        metrics: result.metrics,
        isBodyDetected: Boolean(frame.landmarks) && result.confidence > 0,
      };
      runtimeRef.current = nextRuntime;

      if (result.repDelta > 0) {
        speakRussianCount(nextRuntime.reps);
      }

      drawFrame(canvas, video, frame.landmarks, nextRuntime);
      rafRef.current = requestAnimationFrame(renderFrame);
    };

    rafRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [detector, isRunning]);

  const start = useCallback(async () => {
    if (restRafRef.current) {
      cancelAnimationFrame(restRafRef.current);
      restRafRef.current = null;
    }
    restCountdownVersionRef.current += 1;
    if (sessionStatus === 'rest') {
      setSessionStatus('idle');
    }

    if (sessionStatus === 'paused') {
      setSessionStatus('running');
      return;
    }

    dispatch(
      updateHomeModuleState({
        cameraStatus: 'initializing',
        cameraError: null,
      }),
    );

    await startCamera(memoryVideoRef.current);

    detectorStateRef.current = detector.createState();
    runtimeRef.current = WorkoutSessionRuntimeDefaultState;
    poseServiceRef.current.stop();
    setSessionStatus('running');
  }, [detector, sessionStatus, startCamera, dispatch]);

  const pause = useCallback(() => {
    setSessionStatus('paused');
  }, []);

  const reset = useCallback(() => {
    detectorStateRef.current = detector.createState();
    runtimeRef.current = WorkoutSessionRuntimeDefaultState;
  }, [detector]);

  const stopSession = useCallback(
    (withRestCountdown: boolean, restDurationOverrideMs?: number) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (restRafRef.current) {
        cancelAnimationFrame(restRafRef.current);
        restRafRef.current = null;
      }
      restCountdownVersionRef.current += 1;
      setSessionStatus('idle');

      dispatch(
        updateHomeModuleState({
          cameraStatus: 'idle',
          cameraError: null,
        }),
      );
      stopCamera();
      clearCanvas(canvasRef.current);

      if (!withRestCountdown) {
        return;
      }

      const countdownDurationMs = restDurationOverrideMs ?? restDurationMsRef.current;
      const durationMinutes = Math.max(1, Math.round(countdownDurationMs / 60000));
      speakRussianText(`Отдыхаем ${numberToRussianWords(durationMinutes)} минут`);
      const countdownVersion = restCountdownVersionRef.current;
      const restStartedAt = performance.now();
      let isFinishAnnounced = false;
      setSessionStatus('rest');
      const restTick = (now: number) => {
        if (countdownVersion !== restCountdownVersionRef.current) {
          return;
        }

        const elapsed = now - restStartedAt;
        const remaining = Math.max(0, countdownDurationMs - elapsed);
        const canvas = canvasRef.current;
        if (canvas) {
          drawRestCountdown(canvas, remaining, countdownDurationMs);
        }

        if (remaining > 0) {
          restRafRef.current = requestAnimationFrame(restTick);
        } else {
          if (!isFinishAnnounced) {
            speakRussianText('Ебашим');
            isFinishAnnounced = true;
          }
          restRafRef.current = null;
          setSessionStatus('idle');
        }
      };
      restRafRef.current = requestAnimationFrame(restTick);
    },
    [stopCamera, dispatch],
  );

  const shutdown = useCallback(
    (restDurationOverrideMs?: number) => {
      stopSession(true, restDurationOverrideMs);
    },
    [stopSession],
  );

  useEffect(() => {
    return () => stopSession(false);
  }, [stopSession]);

  return {
    canvasRef,
    sessionStatus,
    start,
    pause,
    reset,
    shutdown,
  };
};
