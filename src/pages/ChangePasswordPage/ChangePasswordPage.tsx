import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ChangePasswordModule,
  EVENT_AUTH_NAVIGATE_AFTER_PASSWORD_CHANGE,
} from '@modules/ChangePasswordModule';
import { eventBus } from '@utils';

import { resolveAfterAuthPath } from '../authPaths';

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { from?: { pathname?: string } } | undefined;
    const afterAuthPath = resolveAfterAuthPath(state?.from);

    const offAfterPasswordChange = eventBus.on(EVENT_AUTH_NAVIGATE_AFTER_PASSWORD_CHANGE, () => {
      navigate(afterAuthPath, { replace: true });
    });

    return () => {
      offAfterPasswordChange();
    };
  }, [location.state, navigate]);

  return <ChangePasswordModule />;
};
