import { type ReactNode, useCallback, useMemo, useState } from 'react';

import {
  type WorkoutSessionChromeControlAction,
  WorkoutSessionChromeControlsContext,
  type WorkoutSessionChromeControlsValue,
  WorkoutSessionChromeStatusContext,
  type WorkoutSessionChromeStatusValue,
  WorkoutSessionStageContext,
} from '../../contexts';
import { exerciseRegistry } from '../../exercises';
import { useSpeechRecognition, useWorkoutSession } from '../../hooks';

export type WorkoutLogicLayoutProps = {
  children: ReactNode;
};

export const WorkoutLogicLayout = ({ children }: WorkoutLogicLayoutProps) => {
  const [exerciseId, setExerciseId] = useState(exerciseRegistry[0].id);
  const [restDurationMinutes, setRestDurationMinutes] = useState<number>(3);
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

  const dispatchChromeControl = useCallback(
    (action: WorkoutSessionChromeControlAction) => {
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
        case 'setExerciseId':
          setExerciseId(action.exerciseId);
          return;
        case 'setRestDurationMinutes':
          setRestDurationMinutes(action.minutes);
          return;
        default: {
          const _never: never = action;
          return _never;
        }
      }
    },
    [pause, reset, setExerciseId, setRestDurationMinutes, shutdown, start],
  );

  const { voiceStatus } = useSpeechRecognition({
    exercises: exerciseRegistry,
    isRunning,
    isRestCountdownActive,
    isCameraInitializing,
    isModelReady,
    dispatchChromeControl,
  });

  const resetStopEnabled = isRunning && !isRestCountdownActive;

  const controlsValue = useMemo<WorkoutSessionChromeControlsValue>(
    () => ({
      exerciseId,
      restDurationMinutes,
      isRunning,
      resetStopEnabled,
      isModelReady,
      isCameraInitializing,
      dispatchChromeControl,
    }),
    [
      exerciseId,
      restDurationMinutes,
      isRunning,
      resetStopEnabled,
      isModelReady,
      isCameraInitializing,
      dispatchChromeControl,
    ],
  );

  const statusValue = useMemo<WorkoutSessionChromeStatusValue>(
    () => ({
      modelStatus,
      isCameraReady,
      voiceStatus,
      isPaused,
      cameraError,
    }),
    [modelStatus, isCameraReady, voiceStatus, isPaused, cameraError],
  );

  const stageValue = useMemo(
    () => ({
      canvasRef,
      isCameraInitializing,
      isPaused,
    }),
    [canvasRef, isCameraInitializing, isPaused],
  );

  return (
    <WorkoutSessionChromeControlsContext.Provider value={controlsValue}>
      <WorkoutSessionChromeStatusContext.Provider value={statusValue}>
        <WorkoutSessionStageContext.Provider value={stageValue}>
          {children}
        </WorkoutSessionStageContext.Provider>
      </WorkoutSessionChromeStatusContext.Provider>
    </WorkoutSessionChromeControlsContext.Provider>
  );
};
