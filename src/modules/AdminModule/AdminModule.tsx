import { AdminPageShell, AdminPageStub } from './components';

export const AdminModule = () => {
  return (
    <AdminPageShell title="Админка">
      <AdminPageStub lead="Заглушка: раздел в разработке." />
    </AdminPageShell>
  );
};
