import { Injectable } from '@angular/core';
import {
  IThemeService,
  ThemeColors,
  DEFAULT_THEME_COLORS,
  IonicVariables,
} from '../../domain/interfaces/theme.interface';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements IThemeService {
  private currentTheme: ThemeColors = { ...DEFAULT_THEME_COLORS };

  setThemeColors(colors: ThemeColors): void {
    this.currentTheme = { ...colors };
    this.applyTheme(colors);
    console.log('✅ Tema actualizado:', colors);
  }

  getThemeColors(): ThemeColors {
    return { ...this.currentTheme };
  }

  resetToDefault(): void {
    this.setThemeColors(DEFAULT_THEME_COLORS);
  }

  applyTheme(colors: ThemeColors): void {
    const ionicVariables = this.generateIonicVariables(colors);
    this.setCSSVariables(ionicVariables);
  }

  /**
   * Genera todas las variantes de colores que necesita Ionic
   */
  private generateIonicVariables(colors: ThemeColors): IonicVariables {
    return {
      // Primary y sus variantes
      '--ion-color-primary': colors.primary,
      '--ion-color-primary-rgb': this.hexToRgb(colors.primary),
      '--ion-color-primary-contrast': this.getContrastColor(colors.primary),
      '--ion-color-primary-shade': this.generateShade(colors.primary),
      '--ion-color-primary-tint': this.generateTint(colors.primary),

      // Secondary y sus variantes
      '--ion-color-secondary': colors.secondary,
      '--ion-color-secondary-rgb': this.hexToRgb(colors.secondary),
      '--ion-color-secondary-contrast': this.getContrastColor(colors.secondary),
      '--ion-color-secondary-shade': this.generateShade(colors.secondary),
      '--ion-color-secondary-tint': this.generateTint(colors.secondary),

      // Background
      '--ion-background-color': colors.background,
    };
  }

  /**
   * Aplica las variables CSS al documento
   */
  private setCSSVariables(variables: IonicVariables): void {
    const root = document.documentElement;

    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * Convierte hex a RGB para Ionic
   */
  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0, 0, 0';

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `${r}, ${g}, ${b}`;
  }

  /**
   * Determina color de contraste (blanco o negro) según las instrucciones de accesibilidad
   */
  private getContrastColor(hex: string): string {
    const rgb = this.hexToRgb(hex).split(', ').map(Number);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

    // Siguiendo las instrucciones: usar colores de alto contraste
    return brightness > 128 ? '#222222' : '#FFFFFF';
  }

  /**
   * Genera variante más oscura (shade) para efectos hover/pressed
   */
  private generateShade(hex: string): string {
    return this.adjustBrightness(hex, -20);
  }

  /**
   * Genera variante más clara (tint) para efectos sutiles
   */
  private generateTint(hex: string): string {
    return this.adjustBrightness(hex, 20);
  }

  /**
   * Ajusta brillo de un color hex
   */
  private adjustBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }
}
