export interface IThemeService {
  setThemeColors(colors: ThemeColors): void;
  getThemeColors(): ThemeColors;
  resetToDefault(): void;
  applyTheme(colors: ThemeColors): void;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
}

export interface IonicVariables {
  '--ion-color-primary': string;
  '--ion-color-primary-rgb': string;
  '--ion-color-primary-contrast': string;
  '--ion-color-primary-shade': string;
  '--ion-color-primary-tint': string;
  '--ion-color-secondary': string;
  '--ion-color-secondary-rgb': string;
  '--ion-color-secondary-contrast': string;
  '--ion-color-secondary-shade': string;
  '--ion-color-secondary-tint': string;
  '--ion-background-color': string;
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: '#FFD600',
  secondary: '#0057B7',
  background: '#FFFFFF',
};
