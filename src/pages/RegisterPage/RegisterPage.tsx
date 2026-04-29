import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  EVENT_AUTH_NAVIGATE_AFTER_REGISTRATION,
  EVENT_NAV_GO_TO_LOGIN,
  RegistrationModule,
} from '@modules/RegistrationModule';
import { eventBus } from '@utils';

import { LOGIN_PAGE_PATH, resolveAfterAuthPath } from '../authPaths';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { from?: { pathname?: string } } | undefined;
    const afterAuthPath = resolveAfterAuthPath(state?.from);

    const offAfterAuth = eventBus.on(EVENT_AUTH_NAVIGATE_AFTER_REGISTRATION, () => {
      navigate(afterAuthPath, { replace: true });
    });
    const offGoLogin = eventBus.on(EVENT_NAV_GO_TO_LOGIN, () => {
      navigate(LOGIN_PAGE_PATH);
    });

    return () => {
      offAfterAuth();
      offGoLogin();
    };
  }, [location.state, navigate]);

  return <RegistrationModule />;
};
