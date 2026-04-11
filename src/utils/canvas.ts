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
