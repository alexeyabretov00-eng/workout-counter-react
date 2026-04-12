import type { AppTheme } from './theme'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- module augmentation merges DefaultTheme with AppTheme
  export interface DefaultTheme extends AppTheme {}
}
