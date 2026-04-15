import { useMemo } from 'react'
import { useWorkoutSessionChromeStatusContext } from '../../contexts'

import type { EntityStatus, VoiceStatus } from '../../../../types'

const VOICE_STATUS_LABEL: Record<VoiceStatus, string> = {
  unsupported: 'Голос: не поддерживается',
  starting: 'Голос: запуск',
  listening: 'Голос: слушаю',
  'inactive-tab': 'Голос: переключитесь на эту вкладку',
  blocked: 'Голос: доступ к микрофону запрещен',
  error: 'Голос: ошибка распознавания',
}

const MODEL_STATUS_LABEL: Record<EntityStatus, string> = {
  idle: 'ожидание',
  initializing: 'инициализация',
  loading: 'загружается',
  ready: 'загружена',
  error: 'не загружена',
}


export const useStatusBarContainerSelector = () => {
  const ctx = useWorkoutSessionChromeStatusContext()
  return useMemo(
    () => ({
      modelStatus: ctx.modelStatus,
      modelStatusLabel: MODEL_STATUS_LABEL[ctx.modelStatus],
      isCameraReady: ctx.isCameraReady,
      voiceStatus: ctx.voiceStatus,
      voiceStatusLabel: VOICE_STATUS_LABEL[ctx.voiceStatus],
      isPaused: ctx.isPaused,
      cameraError: ctx.cameraError,
    }),
    [
      ctx.modelStatus,
      ctx.isCameraReady,
      ctx.voiceStatus,
      ctx.isPaused,
      ctx.cameraError,
    ],
  )
}
