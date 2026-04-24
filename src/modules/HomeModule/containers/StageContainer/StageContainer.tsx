import { useAppSelector } from '@store';

import { Stage } from '../../components';
import { useStageContainerSelector } from '../../hooks';
import { getStageContainerProps } from '../../selectors';

export const StageContainer = () => {
  const { canvasRef } = useStageContainerSelector();
  const { isCameraInitializing, isPaused } = useAppSelector(getStageContainerProps);

  return (
    <Stage canvasRef={canvasRef} isCameraInitializing={isCameraInitializing} isPaused={isPaused} />
  );
};
