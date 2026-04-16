import { Stage } from '../../components';
import { useStageContainerSelector } from '../../logic';

export const StageContainer = () => {
  const { canvasRef, isCameraInitializing, isPaused } = useStageContainerSelector();

  return (
    <Stage canvasRef={canvasRef} isCameraInitializing={isCameraInitializing} isPaused={isPaused} />
  );
};
