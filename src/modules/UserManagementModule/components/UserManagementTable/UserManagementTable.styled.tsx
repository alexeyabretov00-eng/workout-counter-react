import { Button, Select } from 'antd';
import styled from 'styled-components';

import type { UserRole } from './UserManagementTable.types';

export const RoleSelect = styled(Select<UserRole>)`
  width: 180px;
`;

export const ResetPasswordButton = styled(Button)`
  white-space: nowrap;
`;
