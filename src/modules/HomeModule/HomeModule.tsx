import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { eventBus } from '@utils';

import { HomeLayout } from './components';
import { EVENT_WORKOUT_SESSION_CONTROLS_COMMAND } from './constants';
import {
  ExerciseControlBarContainer,
  StageContainer,
  WorkoutStatusBarContainer,
} from './containers';
import { WorkoutSessionStageContext } from './contexts';
import { useSpeechRecognition, useWorkoutSession } from './hooks';
import { getHomeModuleProps } from './selectors';
import {
  fetchExerciseCatalog,
  resetHomeModuleState,
  updateHomeModuleState,
  type WorkoutSessionControlsAction,
} from './store';

export const HomeModule = () => {
  const dispatch = useAppDispatch();
  const {
    exerciseId,
    selectedDetectorId,
    speechExercises,
    restDurationMinutes,
    isCameraInitializing,
    isModelReady,
  } = useAppSelector(getHomeModuleProps);

  useEffect(() => {
    void dispatch(fetchExerciseCatalog());
  }, [dispatch]);

  useEffect(() => {
    if (!speechExercises.length) {
      return;
    }

    const hasCurrentSelection = speechExercises.some(entry => entry.id === exerciseId);
    if (!hasCurrentSelection) {
      dispatch(updateHomeModuleState({ exerciseId: speechExercises[0].id }));
    }
  }, [dispatch, exerciseId, speechExercises]);

  const { canvasRef, sessionStatus, start, pause, reset, shutdown } = useWorkoutSession(
    selectedDetectorId,
    restDurationMinutes * 60_000,
  );

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
    exercises: speechExercises,
    isRunning: sessionStatus === 'running',
    isRestCountdownActive: sessionStatus === 'rest',
    isStartVoiceCommandEnabled: !isCameraInitializing && isModelReady,
  });

  const resetStopEnabled = sessionStatus === 'running';

  useEffect(() => {
    dispatch(
      updateHomeModuleState({
        voiceStatus,
        sessionStatus,
        resetStopEnabled,
      }),
    );
  }, [dispatch, sessionStatus, resetStopEnabled, voiceStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetHomeModuleState());
    };
  }, [dispatch]);

  const stageValue = useMemo(
    () => ({
      canvasRef,
    }),
    [canvasRef],
  );

  return (
    <WorkoutSessionStageContext.Provider value={stageValue}>
      <HomeLayout
        header={<h1>Счетчик повторений</h1>}
        controls={<ExerciseControlBarContainer />}
        statusBar={<WorkoutStatusBarContainer />}
        stage={<StageContainer />}
      />
    </WorkoutSessionStageContext.Provider>
  );
};
