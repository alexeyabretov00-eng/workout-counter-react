import { HomeLayout } from './components'
import { ExerciseControlBarContainer, StageContainer, StatusBarContainer } from './containers'
import { WorkoutLogicLayout } from './logic'

export const HomePage = () => {
  return (
    <WorkoutLogicLayout>
      <HomeLayout
        header={<h1>Счетчик повторений</h1>}
        controls={<ExerciseControlBarContainer />}
        statusBar={<StatusBarContainer />}
        stage={<StageContainer />}
      />
    </WorkoutLogicLayout>
  )
}
