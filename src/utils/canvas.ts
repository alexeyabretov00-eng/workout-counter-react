export const clearCanvas = (canvas: HTMLCanvasElement | null): void => {
  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  const dpr = window.devicePixelRatio || 1
  const cssWidth = canvas.clientWidth
  const cssHeight = canvas.clientHeight
  const nextWidth = Math.round(cssWidth * dpr)
  const nextHeight = Math.round(cssHeight * dpr)

  if (
    nextWidth > 0 &&
    nextHeight > 0 &&
    (canvas.width !== nextWidth || canvas.height !== nextHeight)
  ) {
    canvas.width = nextWidth
    canvas.height = nextHeight
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export const resizeCanvas = (canvas: HTMLCanvasElement): void => {
  const dpr = window.devicePixelRatio || 1
  const cssWidth = canvas.clientWidth
  const cssHeight = canvas.clientHeight
  const nextWidth = Math.round(cssWidth * dpr)
  const nextHeight = Math.round(cssHeight * dpr)

  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth
    canvas.height = nextHeight
  }
}

export const computeCoverLayout = (
  sourceW: number,
  sourceH: number,
  targetW: number,
  targetH: number,
): { dx: number; dy: number; dw: number; dh: number } => {
  const scale = Math.max(targetW / sourceW, targetH / sourceH)
  const dw = sourceW * scale
  const dh = sourceH * scale
  const dx = (targetW - dw) / 2
  const dy = (targetH - dh) / 2

  return { dx, dy, dw, dh }
}

export const drawRestCountdown = (
  canvas: HTMLCanvasElement,
  remainingMs: number,
  totalMs: number,
): void => {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  resizeCanvas(canvas)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const safeRemainingMs = Math.max(0, remainingMs)
  const progress = Math.max(0, Math.min(1, 1 - safeRemainingMs / Math.max(1, totalMs)))
  const minutes = Math.floor(safeRemainingMs / 60000)
  const seconds = Math.floor((safeRemainingMs % 60000) / 1000)
  const timeLabel = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const ringRadius = Math.min(canvas.width, canvas.height) * 0.2
  const ringWidth = Math.max(8, Math.round(ringRadius * 0.12))

  ctx.save()
  ctx.lineCap = 'round'

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = ringWidth
  ctx.beginPath()
  ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = '#60a5fa'
  ctx.beginPath()
  ctx.arc(centerX, centerY, ringRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress)
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `600 ${Math.round(ringRadius * 0.45)}px system-ui`
  ctx.fillText(timeLabel, centerX, centerY)

  ctx.font = `500 ${Math.round(ringRadius * 0.16)}px system-ui`
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.fillText('Отдых между подходами', centerX, centerY + ringRadius * 1.45)
  ctx.restore()
}