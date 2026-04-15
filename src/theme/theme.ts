export const theme = {
  palette: {
    text: {
      primary: '#111827',
      muted: '#4b5563',
      onDark: '#e5e7eb',
      gray600: '#6b7280',
      gray700: '#374151',
    },
    surface: {
      app: '#f8fafc',
      card: '#ffffff',
      stage: '#111827',
      neutralBadge: '#f9fafb',
      neutralBadgeBorder: '#d1d5db',
    },
    border: {
      default: '#d1d5db',
    },
    button: {
      bg: '#ffffff',
      bgHover: '#f3f4f6',
    },
    status: {
      info: { fg: '#075985', border: '#38bdf8', bg: '#f0f9ff' },
      success: { fg: '#065f46', border: '#34d399', bg: '#ecfdf5' },
      error: { fg: '#b91c1c', border: '#fca5a5', bg: '#fef2f2' },
      warning: { fg: '#92400e', border: '#fcd34d', bg: '#fffbeb' },
    },
    accent: {
      emerald: '#34d399',
    },
    overlay: {
      dark: 'rgba(17, 24, 39, 0.88)',
      spinnerTrack: 'rgba(255, 255, 255, 0.15)',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  layout: {
    maxWidth: '1100px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    pill: '999px',
    full: '50%',
  },
  controlHeight: '38px',
  typography: {
    family: 'Inter, system-ui, Arial, sans-serif',
    lineHeight: 1.4,
    statusBar: '14px',
    stageLoader: '15px',
    stagePaused: '24px',
    labelWeight: 600,
    stagePausedWeight: 600,
    stageLoaderWeight: 500,
  },
  stage: {
    aspectRatio: '16 / 9',
    spinnerSize: '44px',
    spinnerBorder: '3px',
  },
} as const;

export type AppTheme = typeof theme;
