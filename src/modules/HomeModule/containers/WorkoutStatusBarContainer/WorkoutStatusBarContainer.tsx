import { useAppSelector } from '@store';

import { WorkoutStatusBar } from '../../components';
import { getWorkoutStatusBarContainerProps } from '../../selectors';

export const WorkoutStatusBarContainer = () => {
  const {
    modelStatus,
    modelStatusLabel,
    isCameraReady,
    voiceStatus,
    voiceStatusLabel,
    isPaused,
    cameraError,
  } = useAppSelector(getWorkoutStatusBarContainerProps);

  return (
    <WorkoutStatusBar
      modelStatus={modelStatus}
      modelStatusLabel={modelStatusLabel}
      isCameraReady={isCameraReady}
      voiceStatus={voiceStatus}
      voiceStatusLabel={voiceStatusLabel}
      isPaused={isPaused}
      cameraError={cameraError}
    />
  );
};
