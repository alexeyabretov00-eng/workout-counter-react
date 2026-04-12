import type { ExerciseRuntimeState } from '../exercises'
import { computeCoverLayout, resizeCanvas } from './canvas'

export interface PosePoint {
  x: number
  y: number
  z: number
  visibility: number
  presence: number
}

export type PoseLandmarks = PosePoint[]

export interface PoseFrame {
  landmarks: PoseLandmarks | null
  timestampMs: number
}

export const POSE_INDEX = {
  nose: 0,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
} as const

export function getPoint(
  landmarks: PoseLandmarks | null,
  index: number,
  minVisibility: number,
): PosePoint | null {
  if (!landmarks || !landmarks[index]) {
    return null
  }

  const point = landmarks[index]
  if (point.visibility < minVisibility || point.presence < minVisibility) {
    return null
  }
  return point
}

export function calculateAngle(a: PosePoint, b: PosePoint, c: PosePoint): number {
  const abX = a.x - b.x
  const abY = a.y - b.y
  const cbX = c.x - b.x
  const cbY = c.y - b.y
  const dot = abX * cbX + abY * cbY
  const magAB = Math.sqrt(abX ** 2 + abY ** 2)
  const magCB = Math.sqrt(cbX ** 2 + cbY ** 2)

  if (magAB === 0 || magCB === 0) {
    return 180
  }

  const cosine = Math.max(-1, Math.min(1, dot / (magAB * magCB)))
  return (Math.acos(cosine) * 180) / Math.PI
}

const POSE_SKELETON_CONNECTIONS: Array<[number, number]> = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
]

const drawPoseSkeleton = (
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmarks,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
): void => {
  ctx.save()
  ctx.lineWidth = 3
  ctx.strokeStyle = '#00e0ff'
  ctx.fillStyle = '#ffdf00'

  for (const [a, b] of POSE_SKELETON_CONNECTIONS) {
    const pa = landmarks[a]
    const pb = landmarks[b]
    if (!pa || !pb) {
      continue
    }
    if (pa.visibility < 0.4 || pb.visibility < 0.4) {
      continue
    }

    ctx.beginPath()
    ctx.moveTo(dx + pa.x * dw, dy + pa.y * dh)
    ctx.lineTo(dx + pb.x * dw, dy + pb.y * dh)
    ctx.stroke()
  }

  for (const point of landmarks) {
    if (point.visibility < 0.4) {
      continue
    }
    ctx.beginPath()
    ctx.arc(dx + point.x * dw, dy + point.y * dh, 4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

const drawHud = (ctx: CanvasRenderingContext2D, runtime: ExerciseRuntimeState): void => {
  const metricEntries = Object.entries(runtime.metrics)
  const hudHeight = 112 + metricEntries.length * 22

  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.fillRect(16, 16, 340, hudHeight)

  ctx.fillStyle = '#ffffff'
  ctx.font = '600 22px system-ui'
  ctx.fillText(`Повторы: ${runtime.reps}`, 28, 50)
  ctx.font = '500 16px system-ui'
  ctx.fillText(`Фаза: ${runtime.phase}`, 28, 76)
  const status = runtime.isBodyDetected
    ? `Confidence: ${(runtime.confidence * 100).toFixed(0)}%`
    : 'Поза не найдена'
  ctx.fillText(status, 28, 102)

  let y = 126
  for (const [name, value] of metricEntries) {
    ctx.fillText(`${name}: ${value.toFixed(1)}`, 28, y)
    y += 22
  }
  ctx.restore()
}

export const drawFrame = (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  landmarks: PoseLandmarks | null,
  runtime: ExerciseRuntimeState,
): void => {
  const ctx = canvas.getContext('2d')
  if (!ctx || !video.videoWidth || !video.videoHeight) {
    return
  }

  resizeCanvas(canvas)

  const layout = computeCoverLayout(
    video.videoWidth,
    video.videoHeight,
    canvas.width,
    canvas.height,
  )

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(video, layout.dx, layout.dy, layout.dw, layout.dh)

  if (landmarks) {
    drawPoseSkeleton(ctx, landmarks, layout.dx, layout.dy, layout.dw, layout.dh)
  }
  drawHud(ctx, runtime)
}

export { drawRestCountdown } from './canvas'
