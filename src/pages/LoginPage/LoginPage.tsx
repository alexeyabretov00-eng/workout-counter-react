import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoginModule } from '@modules/LoginModule';
import {
  EVENT_AUTH_NAVIGATE_AFTER_LOGIN,
  EVENT_NAV_GO_TO_REGISTER,
  eventBus,
  resolveAfterAuthPath,
} from '@utils';

import { REGISTER_PAGE_PATH } from '../authPaths';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { from?: { pathname?: string } } | undefined;
    const afterAuthPath = resolveAfterAuthPath(state?.from);

    const offAfterAuth = eventBus.on(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, () => {
      navigate(afterAuthPath, { replace: true });
    });
    const offGoRegister = eventBus.on(EVENT_NAV_GO_TO_REGISTER, () => {
      navigate(REGISTER_PAGE_PATH);
    });

    return () => {
      offAfterAuth();
      offGoRegister();
    };
  }, [location.state, navigate]);

  return <LoginModule />;
};
