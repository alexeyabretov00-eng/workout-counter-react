import { Tabs } from 'antd';

import { selectAuthUser, useAppSelector } from '@store';

import { AdminPageShell } from './components';
import { ExerciseCatalogManagerContainer, ExerciseSetManagerContainer } from './containers';

export const AdminModule = () => {
  const authUser = useAppSelector(selectAuthUser);
  const isAdminOrSuperadmin = authUser?.role === 'admin' || authUser?.role === 'superadmin';

  const tabItems = [
    ...(isAdminOrSuperadmin
      ? [
          {
            key: 'exercise-catalog',
            label: 'Каталог упражнений',
            children: <ExerciseCatalogManagerContainer />,
          },
        ]
      : []),
    {
      key: 'exercise-sets',
      label: 'Сеты упражнений',
      children: <ExerciseSetManagerContainer />,
    },
  ];

  return (
    <AdminPageShell title="Админка">
      <Tabs items={tabItems} />
    </AdminPageShell>
  );
};
