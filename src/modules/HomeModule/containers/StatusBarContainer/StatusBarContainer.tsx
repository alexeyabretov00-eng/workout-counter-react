import { useAppSelector } from '@store';

import { WorkoutStatusBar } from '../../components';
import { selectStatusBarContainerModel } from '../../selectors';

export const StatusBarContainer = () => {
  const {
    modelStatus,
    modelStatusLabel,
    isCameraReady,
    voiceStatus,
    voiceStatusLabel,
    isPaused,
    cameraError,
  } = useAppSelector(selectStatusBarContainerModel);

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
