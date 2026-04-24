import { calculateAngle, getPoint, POSE_INDEX } from '@utils';

import type { ExerciseDetector } from '../types';

type ArmyPressPhase = 'down' | 'up';

type ArmyPressState = {
  phase: ArmyPressPhase;
};

const VISIBILITY = 0.5;
const UP_THRESHOLD = 160;
const DOWN_THRESHOLD = 95;
const WRIST_ABOVE_SHOULDER_MARGIN = 0.06;
const WRIST_ABOVE_HEAD_MARGIN = 0.08;

export const armyPressDetector: ExerciseDetector<ArmyPressState> = {
  id: 'army-press',
  createState: () => ({ phase: 'down' }),
  update: (landmarks, state) => {
    const nose = getPoint(landmarks, POSE_INDEX.nose, VISIBILITY);
    const leftShoulder = getPoint(landmarks, POSE_INDEX.leftShoulder, VISIBILITY);
    const leftElbow = getPoint(landmarks, POSE_INDEX.leftElbow, VISIBILITY);
    const leftWrist = getPoint(landmarks, POSE_INDEX.leftWrist, VISIBILITY);
    const rightShoulder = getPoint(landmarks, POSE_INDEX.rightShoulder, VISIBILITY);
    const rightElbow = getPoint(landmarks, POSE_INDEX.rightElbow, VISIBILITY);
    const rightWrist = getPoint(landmarks, POSE_INDEX.rightWrist, VISIBILITY);

    if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) {
      return {
        nextState: state,
        repDelta: 0,
        phase: state.phase,
        metrics: {} as Record<string, number>,
        confidence: 0,
      };
    }

    const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const avgAngle = (leftAngle + rightAngle) / 2;
    const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const avgWristY = (leftWrist.y + rightWrist.y) / 2;
    const wristsAboveShoulders = avgWristY <= avgShoulderY - WRIST_ABOVE_SHOULDER_MARGIN;
    const wristsAboveHead = nose ? avgWristY <= nose.y + WRIST_ABOVE_HEAD_MARGIN : false;

    let repDelta = 0;
    let nextPhase = state.phase;

    if (
      state.phase === 'down' &&
      avgAngle >= UP_THRESHOLD &&
      wristsAboveShoulders &&
      wristsAboveHead
    ) {
      nextPhase = 'up';
    } else if (state.phase === 'up' && avgAngle <= DOWN_THRESHOLD) {
      nextPhase = 'down';
      repDelta = 1;
    }

    return {
      nextState: { phase: nextPhase },
      repDelta,
      phase: nextPhase,
      metrics: {
        leftElbowAngle: leftAngle,
        rightElbowAngle: rightAngle,
        avgElbowAngle: avgAngle,
        avgShoulderY,
        avgWristY,
        noseY: nose?.y ?? -1,
        wristsAboveShoulders: wristsAboveShoulders ? 1 : 0,
        wristsAboveHead: wristsAboveHead ? 1 : 0,
      },
      confidence: 1,
    };
  },
};
