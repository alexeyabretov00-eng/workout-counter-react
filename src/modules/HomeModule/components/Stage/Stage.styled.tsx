import styled, { keyframes } from 'styled-components';

const loaderSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const StageRoot = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.palette.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.palette.surface.stage};
  aspect-ratio: ${({ theme }) => theme.stage.aspectRatio};
`;

export const StageViewport = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
`;

export const StageLoader = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.palette.overlay.dark};
`;

export const StageLoaderSpinner = styled.span`
  width: ${({ theme }) => theme.stage.spinnerSize};
  height: ${({ theme }) => theme.stage.spinnerSize};
  border: ${({ theme }) => theme.stage.spinnerBorder} solid
    ${({ theme }) => theme.palette.overlay.spinnerTrack};
  border-top-color: ${({ theme }) => theme.palette.accent.emerald};
  border-radius: ${({ theme }) => theme.radius.full};
  animation: ${loaderSpin} 0.75s linear infinite;
`;

export const StageLoaderText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.palette.text.onDark};
  font-size: ${({ theme }) => theme.typography.stageLoader};
  font-weight: ${({ theme }) => theme.typography.stageLoaderWeight};
`;

export const StageCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

export const StagePaused = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const StagePausedText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.palette.text.onDark};
  font-size: ${({ theme }) => theme.typography.stagePaused};
  font-weight: ${({ theme }) => theme.typography.stagePausedWeight};
  text-align: center;
`;
