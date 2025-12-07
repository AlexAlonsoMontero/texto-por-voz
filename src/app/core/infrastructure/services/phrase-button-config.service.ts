import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import {
  IPhraseButtonConfigService,
  PhraseButtonConfig,
  ButtonSize,
  ButtonSizeConfig,
  GridLayout,
  BUTTON_SIZE_CONFIGS,
  GRID_LAYOUTS,
  XLARGE_GRID_LAYOUT,
} from '../../domain/interfaces/phrase-button-config.interface';

@Injectable({ providedIn: 'root' })
export class PhraseButtonConfigService implements IPhraseButtonConfigService {
  private readonly STORAGE_KEY = 'phrase-button-config';
  private cachedConfig: PhraseButtonConfig | null = null;

  async getConfig(): Promise<PhraseButtonConfig> {
    if (this.cachedConfig) {
      return this.cachedConfig;
    }

    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      if (value) {
        const parsed = JSON.parse(value) as PhraseButtonConfig;
        this.cachedConfig = parsed;
        return parsed;
      }
    } catch (error) {
      console.error('[PhraseButtonConfig] Error loading config:', error);
    }

    // Default: 12 botones, tamaño mediano
    const defaultConfig: PhraseButtonConfig = {
      count: 12,
      size: 'medium',
    };
    this.cachedConfig = defaultConfig;
    return defaultConfig;
  }

  async setConfig(config: PhraseButtonConfig): Promise<void> {
    try {
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(config),
      });
      this.cachedConfig = config;
    } catch (error) {
      console.error('[PhraseButtonConfig] Error saving config:', error);
      throw error;
    }
  }

  getSizeConfig(size: ButtonSize): ButtonSizeConfig {
    return BUTTON_SIZE_CONFIGS[size];
  }

  getGridLayout(count: number): GridLayout {
    return GRID_LAYOUTS[count] || GRID_LAYOUTS[12];
  }

  getGridLayoutForSize(count: number, size: ButtonSize): GridLayout {
    // Si es tamaño XLarge, usar layout especial
    if (size === 'xlarge') {
      return XLARGE_GRID_LAYOUT;
    }
    return this.getGridLayout(count);
  }
}
