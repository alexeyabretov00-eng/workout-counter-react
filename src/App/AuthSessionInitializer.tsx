import { useEffect } from 'react';

import { initializeAuth, useAppDispatch } from '@store';

/** Должен рендериться внутри `Provider store`; для интеграционных тестов экспортируется из `@app`. */
export const AuthSessionInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initializeAuth());
  }, [dispatch]);

  return null;
};
