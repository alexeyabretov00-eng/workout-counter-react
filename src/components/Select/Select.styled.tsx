import { Select } from 'antd';
import styled from 'styled-components';

export const SelectLabel = styled.label`
  font-weight: ${({ theme }) => theme.typography.labelWeight};
`;

export const SelectStyled = styled(Select)`
  min-width: 160px;
`;
