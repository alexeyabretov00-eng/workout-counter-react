import type { ThemeConfig } from 'antd';

import type { AppTheme } from './theme';

/** Токены antd `ConfigProvider`, согласованные с `src/theme/theme.ts` (приложение + styled). */
export const getAntdThemeConfig = (app: AppTheme): ThemeConfig => {
  const controlHeight = Number.parseInt(String(app.controlHeight), 10);
  const borderRadius = Number.parseInt(String(app.radius.sm), 10);

  return {
    token: {
      colorPrimary: app.palette.status.info.fg,
      colorBgLayout: app.palette.surface.app,
      colorText: app.palette.text.primary,
      colorTextSecondary: app.palette.text.muted,
      colorTextTertiary: app.palette.text.gray600,
      colorBorder: app.palette.border.default,
      colorBgContainer: app.palette.surface.card,
      colorBgElevated: app.palette.surface.card,
      borderRadius: Number.isNaN(borderRadius) ? 8 : borderRadius,
      controlHeight: Number.isNaN(controlHeight) ? 38 : controlHeight,
      fontFamily: app.typography.family,
      lineHeight: app.typography.lineHeight,
    },
  };
};
