import styled from 'styled-components';

export const ExerciseHistoryPageRoot = styled.main`
  box-sizing: border-box;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.palette.text.primary};
  font-family: ${({ theme }) => theme.typography.family};
  line-height: ${({ theme }) => theme.typography.lineHeight};
`;

export const ExerciseHistoryPageTitle = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.labelWeight};
`;
