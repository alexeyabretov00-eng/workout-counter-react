import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { eventBus } from '@utils';

import { HomeLayout } from './components';
import { EVENT_WORKOUT_SESSION_CONTROLS_COMMAND } from './constants';
import { ExerciseControlBarContainer, StageContainer, StatusBarContainer } from './containers';
import { WorkoutSessionStageContext } from './contexts';
import { exerciseRegistry } from './exercises';
import { useSpeechRecognition, useWorkoutSession } from './hooks';
import { getHomeModuleProps } from './selectors';
import {
  resetHomeModuleState,
  updateHomeModuleState,
  type WorkoutSessionControlsAction,
} from './store';

export const HomeModule = () => {
  const dispatch = useAppDispatch();
  const { exerciseId, restDurationMinutes, isCameraInitializing } =
    useAppSelector(getHomeModuleProps);
  const { canvasRef, sessionStatus, modelStatus, start, pause, reset, shutdown } =
    useWorkoutSession(exerciseId, restDurationMinutes * 60_000);

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
      }
    });
  }, [dispatch, pause, reset, shutdown, start]);

  const { voiceStatus } = useSpeechRecognition({
    exercises: exerciseRegistry,
    isRunning: sessionStatus === 'running',
    isRestCountdownActive: sessionStatus === 'rest',
    isCameraInitializing,
    isModelReady: modelStatus === 'ready',
  });

  const resetStopEnabled = sessionStatus === 'running';

  useEffect(() => {
    dispatch(
      updateHomeModuleState({
        modelStatus,
        voiceStatus,
        sessionStatus,
        resetStopEnabled,
      }),
    );
  }, [dispatch, sessionStatus, modelStatus, resetStopEnabled, voiceStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetHomeModuleState());
    };
  }, [dispatch]);

  const stageValue = useMemo(
    () => ({
      canvasRef,
      isCameraInitializing,
      isPaused: sessionStatus === 'paused',
    }),
    [canvasRef, isCameraInitializing, sessionStatus],
  );

  return (
    <WorkoutSessionStageContext.Provider value={stageValue}>
      <HomeLayout
        header={<h1>Счетчик повторений</h1>}
        controls={<ExerciseControlBarContainer />}
        statusBar={<StatusBarContainer />}
        stage={<StageContainer />}
      />
    </WorkoutSessionStageContext.Provider>
  );
};
