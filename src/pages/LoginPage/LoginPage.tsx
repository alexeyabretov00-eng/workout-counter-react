import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoginModule } from '@modules/LoginModule';
import { EVENT_AUTH_NAVIGATE_AFTER_LOGIN, eventBus, resolveAfterAuthPath } from '@utils';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { from?: { pathname?: string } } | undefined;
    const afterAuthPath = resolveAfterAuthPath(state?.from);

    return eventBus.on(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, () => {
      navigate(afterAuthPath, { replace: true });
    });
  }, [location.state, navigate]);

  return <LoginModule />;
};
