import { Form } from 'antd';
import styled from 'styled-components';

import { Button } from '@components';

export const RegisterFormRoot = styled(Form)`
  && {
    max-width: 360px;
    margin: 0;
  }
`;

export const RegisterFormFooter = styled.div`
  display: block;
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  font-size: ${({ theme }) => theme.typography.statusBar};
  color: ${({ theme }) => theme.palette.text.muted};
`;

export const RegisterFormFooterLink = styled(Button).attrs({ type: 'link' as const })`
  && {
    padding: 0;
    height: auto;
    font-size: ${({ theme }) => theme.typography.statusBar};
  }
`;
