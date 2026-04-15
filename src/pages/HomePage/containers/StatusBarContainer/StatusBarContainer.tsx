import { WorkoutStatusBar } from '../../components';
import { useStatusBarContainerSelector } from '../../logic';

export const StatusBarContainer = () => {
  const {
    modelStatus,
    modelStatusLabel,
    isCameraReady,
    voiceStatus,
    voiceStatusLabel,
    isPaused,
    cameraError,
  } = useStatusBarContainerSelector();

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
