import styled from 'styled-components';

const chevronBackgroundUrl = (strokeHex: string): string => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='${strokeHex}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 8 4 4 4-4'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

export const SelectLabel = styled.label`
  font-weight: ${({ theme }) => theme.typography.labelWeight};
`;

export const SelectField = styled.select`
  height: ${({ theme }) => theme.controlHeight};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.palette.border.default};
  padding: 0 ${({ theme }) => theme.spacing.md};
  padding-right: 30px;
  background-color: ${({ theme }) => theme.palette.button.bg};
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: ${({ theme }) => chevronBackgroundUrl(theme.palette.text.primary)};
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px 14px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
