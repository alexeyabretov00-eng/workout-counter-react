import { AppLayout } from './components'
import { ExerciseControlBarContainer, StageContainer, StatusBarContainer } from './containers'
import { WorkoutLogicLayout } from './logic'

function App() {
  return (
    <WorkoutLogicLayout>
      <AppLayout
        header={<h1>Счетчик повторений</h1>}
        controls={<ExerciseControlBarContainer />}
        statusBar={<StatusBarContainer />}
        stage={<StageContainer />}
      />
    </WorkoutLogicLayout>
  )
}

export default App
