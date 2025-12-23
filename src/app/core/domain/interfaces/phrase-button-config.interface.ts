export type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface ButtonSizeConfig {
  height: number; // px
  numberSize: string; // rem
  numberSizeTablet: string; // rem para tablets
  gap: number; // px entre botones
}

export interface PhraseButtonConfig {
  count: number; // 6, 12, 18, 24, 32
  size: ButtonSize;
}

export interface GridLayout {
  portraitCols: number;
  landscapeCols: number;
}

export const BUTTON_SIZE_CONFIGS: Record<ButtonSize, ButtonSizeConfig> = {
  small: {
    height: 160,
    numberSize: '3.5rem',
    numberSizeTablet: '4.5rem',
    gap: 6,
  },
  medium: {
    height: 220,
    numberSize: '4.5rem',
    numberSizeTablet: '6rem',
    gap: 8,
  },
  large: {
    height: 280,
    numberSize: '6.5rem',
    numberSizeTablet: '8rem',
    gap: 12,
  },
  xlarge: {
    height: 450,
    numberSize: '10rem',
    numberSizeTablet: '12rem',
    gap: 16,
  },
};

export const GRID_LAYOUTS: Record<number, GridLayout> = {
  6: { portraitCols: 2, landscapeCols: 3 },
  12: { portraitCols: 2, landscapeCols: 3 },
  18: { portraitCols: 3, landscapeCols: 3 },
  24: { portraitCols: 3, landscapeCols: 4 },
  32: { portraitCols: 4, landscapeCols: 4 },
};

// 🆕 Layout especial para tamaño Muy Grande
export const XLARGE_GRID_LAYOUT: GridLayout = {
  portraitCols: 1, // 1 columna en portrait (más natural para ver imágenes grandes)
  landscapeCols: 2, // 2 columnas en landscape
};

export const AVAILABLE_BUTTON_COUNTS = [6, 12, 18, 24, 32] as const;

export interface IPhraseButtonConfigService {
  getConfig(): Promise<PhraseButtonConfig>;
  setConfig(config: PhraseButtonConfig): Promise<void>;
  getSizeConfig(size: ButtonSize): ButtonSizeConfig;
  getGridLayout(count: number): GridLayout;
  getGridLayoutForSize(count: number, size: ButtonSize): GridLayout;
  observeConfig(): import('rxjs').Observable<PhraseButtonConfig>;
}
