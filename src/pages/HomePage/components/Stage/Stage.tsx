import type { RefObject } from 'react';

import {
  StageCanvas,
  StageLoader,
  StageLoaderSpinner,
  StageLoaderText,
  StagePaused,
  StagePausedText,
  StageRoot,
  StageViewport,
} from './Stage.styled';

export type StageProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isCameraInitializing: boolean;
  isPaused: boolean;
};

export const Stage = ({ canvasRef, isCameraInitializing, isPaused }: StageProps) => {
  return (
    <StageRoot>
      <StageViewport aria-busy={isCameraInitializing}>
        {isCameraInitializing ? (
          <StageLoader role="status" aria-live="polite">
            <StageLoaderSpinner aria-hidden />
            <StageLoaderText>Подключение камеры…</StageLoaderText>
          </StageLoader>
        ) : null}
        {isPaused ? (
          <StagePaused role="status" aria-live="polite">
            <StagePausedText>Упражнение приостановлено</StagePausedText>
          </StagePaused>
        ) : (
          <StageCanvas ref={canvasRef} />
        )}
      </StageViewport>
    </StageRoot>
  );
};
