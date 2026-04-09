import { POSE_INDEX, getPoint } from '../pose/poseMath'
import type { ExerciseDetector } from './types'

type HeadTiltPhase = 'center' | 'right' | 'left'
type HeadTiltSide = 'right' | 'left'

interface HeadSideTiltState {
  phase: HeadTiltPhase
  lastExtremeSide: HeadTiltSide | null
}

const VISIBILITY = 0.5
const SIDE_THRESHOLD = 0.035

export const headSideTiltDetector: ExerciseDetector<HeadSideTiltState> = {
  id: 'head-side-tilt',
  name: 'Наклоны головы вправо-влево',
  description: 'Счет повторений наклонов головы по смещению носа относительно плеч.',
  isActive: true,
  voiceAliases: [
    'наклоны головы',
    'наклон головы',
    'голова вправо влево',
    'шея вправо влево',
    'наклоны шеи',
  ],
  createState: () => ({ phase: 'center', lastExtremeSide: null }),
  update: (landmarks, state) => {
    const nose = getPoint(landmarks, POSE_INDEX.nose, VISIBILITY)
    const leftShoulder = getPoint(landmarks, POSE_INDEX.leftShoulder, VISIBILITY)
    const rightShoulder = getPoint(landmarks, POSE_INDEX.rightShoulder, VISIBILITY)

    if (!nose || !leftShoulder || !rightShoulder) {
      return {
        nextState: state,
        repDelta: 0,
        phase: state.phase,
        metrics: {} as Record<string, number>,
        confidence: 0,
      }
    }

    const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2
    const noseOffsetX = nose.x - shoulderCenterX

    let nextPhase: HeadTiltPhase = 'center'
    let extremeSide: HeadTiltSide | null = null

    if (noseOffsetX >= SIDE_THRESHOLD) {
      nextPhase = 'right'
      extremeSide = 'right'
    } else if (noseOffsetX <= -SIDE_THRESHOLD) {
      nextPhase = 'left'
      extremeSide = 'left'
    }

    let repDelta = 0
    let lastExtremeSide = state.lastExtremeSide

    if (extremeSide) {
      if (lastExtremeSide && lastExtremeSide !== extremeSide) {
        repDelta = 1
      }
      lastExtremeSide = extremeSide
    }

    return {
      nextState: { phase: nextPhase, lastExtremeSide },
      repDelta,
      phase: nextPhase,
      metrics: {
        noseX: nose.x,
        shoulderCenterX,
        noseOffsetX,
      },
      confidence: 1,
    }
  },
}
