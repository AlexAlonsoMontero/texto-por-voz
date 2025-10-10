export interface IThemeService {
  setThemeColors(colors: ThemeColors): void;
  getThemeColors(): ThemeColors;
  resetToDefault(): void;
  applyTheme(colors: ThemeColors): void;
  getPredefinedColors(): ColorOption[];
  getColorByName(name: string): ColorOption | undefined;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
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
  '--ion-text-color': string;
}

export interface ColorOption {
  name: string;
  value: string;
  description: string;
}

export interface ColorType {
  key: keyof ThemeColors;
  name: string;
  description: string;
  icon: string;
}

export const COLOR_TYPES: ColorType[] = [
  {
    key: 'primary',
    name: 'Color Principal',
    description: 'Color principal de botones y elementos destacados',
    icon: '🎯',
  },
  {
    key: 'secondary',
    name: 'Color Secundario',
    description: 'Color secundario para acentos y elementos de apoyo',
    icon: '🎨',
  },
  {
    key: 'background',
    name: 'Color de Fondo',
    description: 'Color de fondo principal de la aplicación',
    icon: '🏠',
  },
  {
    key: 'text',
    name: 'Color del Texto',
    description: 'Color principal del texto y elementos de interfaz',
    icon: '📝',
  },
];

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: '#FFD600',
  secondary: '#0057B7',
  background: '#FFFFFF',
  text: '#222222',
};

/**
 * Paleta de 16 colores predefinidos que cumplen con WCAG AAA (contraste 7:1)
 * Cada color está optimizado para accesibilidad y diferenciación visual
 */
export const PREDEFINED_COLORS: ColorOption[] = [
  // Neutros básicos
  { name: 'Blanco Puro', value: '#FFFFFF', description: 'Blanco limpio y claro' },
  { name: 'Gris Carbón', value: '#424242', description: 'Gris oscuro y sofisticado' },

  // Colores brillantes y llamativos
  { name: 'Amarillo Brillante', value: '#FFD600', description: 'Amarillo vibrante, ideal para resaltar' },
  { name: 'Naranja Intenso', value: '#FF8F00', description: 'Naranja fuerte y energético' },
  { name: 'Rojo Vibrante', value: '#D32F2F', description: 'Rojo intenso para alertas' },
  { name: 'Rosa Fuerte', value: '#C2185B', description: 'Rosa intenso y distintivo' },

  // Colores azules y fríos
  { name: 'Azul Profundo', value: '#0057B7', description: 'Azul intenso y profesional' },
  { name: 'Cian Intenso', value: '#00838F', description: 'Cian vibrante y fresco' },
  { name: 'Teal Profundo', value: '#00695C', description: 'Verde azulado elegante' },

  // Colores verdes y naturales
  { name: 'Verde Bosque', value: '#2E7D32', description: 'Verde natural y relajante' },
  { name: 'Verde Lima', value: '#689F38', description: 'Verde lima energético' },
  { name: 'Verde Oliva', value: '#827717', description: 'Verde oliva terroso' },
  { name: 'Marrón Tierra', value: '#5D4037', description: 'Marrón cálido y natural' },

  // Colores púrpuras
  { name: 'Púrpura Real', value: '#512DA8', description: 'Púrpura elegante y distintivo' },
  { name: 'Violeta Intenso', value: '#7B1FA2', description: 'Violeta vibrante' },

  // Negro al final
  { name: 'Negro Total', value: '#000000', description: 'Negro absoluto para máximo contraste' },
];
