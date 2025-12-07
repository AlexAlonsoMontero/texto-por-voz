import { InjectionToken } from '@angular/core';
import { ITextToSpeechService } from '../domain/interfaces/text-to-speech.interface';
import { IOrientationService } from '../domain/interfaces/orientation.interface';
import { ISafeAreaService } from '../domain/interfaces/safe-area.interface';
import { IPressHoldButtonService } from '../domain/interfaces/press-hold-button.interface';
import { IThemeService } from '../domain/interfaces/theme.interface';
import { IPhraseStoreService } from '../domain/interfaces/phrase-store.interface';
import { IGalleryService } from '../domain/interfaces/gallery.interface';
import { IPhraseButtonConfigService } from '../domain/interfaces/phrase-button-config.interface';

/**
 * Token de inyección para el servicio de Text-to-Speech
 * Permite la inyección de dependencias siguiendo el patrón de arquitectura hexagonal
 */
export const TEXT_TO_SPEECH_SERVICE = new InjectionToken<ITextToSpeechService>('TextToSpeechService', {
  providedIn: 'root',
  factory: () => {
    throw new Error('TEXT_TO_SPEECH_SERVICE debe ser provisto explícitamente en los providers');
  },
});

/**
 * Token de inyección para el servicio de orientación
 * Permite controlar la orientación de la pantalla en dispositivos móviles
 */
export const ORIENTATION_SERVICE = new InjectionToken<IOrientationService>('OrientationService', {
  providedIn: 'root',
  factory: () => {
    throw new Error('ORIENTATION_SERVICE debe ser provisto explícitamente en los providers');
  },
});

/**
 * Token de inyección para el servicio de Safe Area
 * Permite obtener información sobre las barras del sistema y área segura
 */
export const SAFE_AREA_SERVICE = new InjectionToken<ISafeAreaService>('SafeAreaService', {
  providedIn: 'root',
  factory: () => {
    throw new Error('SAFE_AREA_SERVICE debe ser provisto explícitamente en los providers');
  },
});

/**
 * Token de inyección para el servicio de botones de presión sostenida
 * Permite la gestión de botones accesibles con configuración global
 */
export const PRESS_HOLD_BUTTON_SERVICE = new InjectionToken<IPressHoldButtonService>('PressHoldButtonService', {
  providedIn: 'root',
  factory: () => {
    throw new Error('PRESS_HOLD_BUTTON_SERVICE debe ser provisto explícitamente en los providers');
  },
});

/**
 * Token de inyección para el servicio de theming
 * Permite la gestión dinámica de colores de la aplicación
 */
export const THEME_SERVICE = new InjectionToken<IThemeService>('ThemeService', {
  providedIn: 'root',
  factory: () => {
    throw new Error('THEME_SERVICE debe ser provisto explícitamente en los providers');
  },
});

/**
 * Token para el servicio de almacenamiento de frases (12 slots)
 */
export const PHRASE_STORE_SERVICE = new InjectionToken<IPhraseStoreService>('PhraseStoreService', {
  providedIn: 'root',
  factory: () => {
    throw new Error('PHRASE_STORE_SERVICE debe ser provisto explícitamente en los providers');
  },
});

/**
 * Token para el servicio de galería (selector de imágenes híbrido)
 */
export const GALLERY_SERVICE = new InjectionToken<IGalleryService>('GalleryService', {
  providedIn: 'root',
  factory: () => {
    throw new Error('GALLERY_SERVICE debe ser provisto explícitamente en los providers');
  },
});

/**
 * Token para el servicio de configuración de botones de frases
 */
export const PHRASE_BUTTON_CONFIG_SERVICE = new InjectionToken<IPhraseButtonConfigService>(
  'PhraseButtonConfigService',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error('PHRASE_BUTTON_CONFIG_SERVICE debe ser provisto explícitamente en los providers');
    },
  },
);
