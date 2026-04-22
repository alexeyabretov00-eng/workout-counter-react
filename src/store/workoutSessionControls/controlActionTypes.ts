/** Команды панели управления сессией; обрабатываются listener в WorkoutLogicLayout. */
export type WorkoutSessionControlsAction =
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'reset' }
  | { type: 'shutdown'; restDurationOverrideMs?: number };
