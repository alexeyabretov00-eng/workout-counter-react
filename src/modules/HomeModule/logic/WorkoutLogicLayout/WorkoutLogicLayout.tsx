import { type ReactNode, useEffect, useMemo } from 'react';
import type { WorkoutSessionControlsAction } from '@store';

import {
  patchWorkoutSessionControls,
  resetWorkoutSessionControls,
  useAppDispatch,
  useAppSelector,
} from '@store';
import { eventBus } from '@utils';

import { EVENT_WORKOUT_SESSION_CONTROLS_COMMAND } from '../../constants';
import { WorkoutSessionStageContext } from '../../contexts';
import { exerciseRegistry } from '../../exercises';
import { useSpeechRecognition, useWorkoutSession } from '../../hooks';

export type WorkoutLogicLayoutProps = {
  children: ReactNode;
};

export const WorkoutLogicLayout = ({ children }: WorkoutLogicLayoutProps) => {
  const dispatch = useAppDispatch();
  const exerciseId = useAppSelector(s => s.workoutSessionControls.exerciseId);
  const restDurationMinutes = useAppSelector(s => s.workoutSessionControls.restDurationMinutes);
  const {
    canvasRef,
    isRunning,
    isPaused,
    isRestCountdownActive,
    modelStatus,
    isModelReady,
    isCameraReady,
    isCameraInitializing,
    cameraError,
    start,
    pause,
    reset,
    shutdown,
  } = useWorkoutSession(exerciseId, restDurationMinutes * 60_000);

  useEffect(() => {
    return eventBus.on(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, detail => {
      const action = detail as WorkoutSessionControlsAction;
      switch (action.type) {
        case 'start':
          void start();
          return;
        case 'pause':
          pause();
          return;
        case 'reset':
          reset();
          return;
        case 'shutdown':
          shutdown(action.restDurationOverrideMs);
          return;
        default: {
          const _never: never = action;
          return _never;
        }
      }
    });
  }, [dispatch, pause, reset, shutdown, start]);

  const { voiceStatus } = useSpeechRecognition({
    exercises: exerciseRegistry,
    isRunning,
    isRestCountdownActive,
    isCameraInitializing,
    isModelReady,
  });

  const resetStopEnabled = isRunning && !isRestCountdownActive;

  useEffect(() => {
    dispatch(
      patchWorkoutSessionControls({
        modelStatus,
        isCameraReady,
        voiceStatus,
        isPaused,
        cameraError,
        isRunning,
        resetStopEnabled,
        isModelReady,
        isCameraInitializing,
      }),
    );
  }, [
    cameraError,
    dispatch,
    isCameraInitializing,
    isCameraReady,
    isModelReady,
    isPaused,
    isRunning,
    modelStatus,
    resetStopEnabled,
    voiceStatus,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetWorkoutSessionControls());
    };
  }, [dispatch]);

  const stageValue = useMemo(
    () => ({
      canvasRef,
      isCameraInitializing,
      isPaused,
    }),
    [canvasRef, isCameraInitializing, isPaused],
  );

  return (
    <WorkoutSessionStageContext.Provider value={stageValue}>
      {children}
    </WorkoutSessionStageContext.Provider>
  );
};
