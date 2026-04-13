import { Navigate, Route, Routes } from 'react-router-dom'
import { AppNav } from './components'
import { AdminPage, ExerciseHistoryPage, HomePage } from './pages'
import { ROUTES } from './routes'

const App = () => {
  return (
    <>
      <AppNav />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ADMIN} element={<AdminPage />} />
        <Route path={ROUTES.HISTORY} element={<ExerciseHistoryPage />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </>
  )
}

export default App
