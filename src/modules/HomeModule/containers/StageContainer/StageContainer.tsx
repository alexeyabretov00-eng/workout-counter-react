import { Stage } from '../../components';
import { useStageContainerSelector } from '../../hooks';

export const StageContainer = () => {
  const { canvasRef, isCameraInitializing, isPaused } = useStageContainerSelector();

  return (
    <Stage canvasRef={canvasRef} isCameraInitializing={isCameraInitializing} isPaused={isPaused} />
  );
};
