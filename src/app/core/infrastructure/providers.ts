import { Provider } from '@angular/core';
import { HybridTextToSpeechService } from './services/hybrid-text-to-speech.service';
import { HybridOrientationService } from './services/hybrid-orientation.service';
import { HybridSafeAreaService } from './services/hybrid-safe-area.service';
import { HybridGalleryService } from './services/hybrid-gallery.service';

import { ThemeService } from './services/theme.service';
import { PhraseStoreService } from './services/phrase-store.service';
import {
  TEXT_TO_SPEECH_SERVICE,
  ORIENTATION_SERVICE,
  SAFE_AREA_SERVICE,
  PRESS_HOLD_BUTTON_SERVICE,
  THEME_SERVICE,
  PHRASE_STORE_SERVICE,
  GALLERY_SERVICE,
} from './injection-tokens';
import { PressHoldButtonService } from './press-hold-button.service';

/**
 * Providers del core de la aplicación
 * Configura la inyección de dependencias siguiendo el patrón de arquitectura hexagonal
 */
export const CORE_PROVIDERS: Provider[] = [
  // TTS Service - Funcionalidad principal de texto a voz
  {
    provide: TEXT_TO_SPEECH_SERVICE,
    useClass: HybridTextToSpeechService,
  },

  // Orientation Service - Control de orientación de pantalla
  {
    provide: ORIENTATION_SERVICE,
    useClass: HybridOrientationService,
  },

  // SafeArea Service - Gestión de barras del sistema
  {
    provide: SAFE_AREA_SERVICE,
    useClass: HybridSafeAreaService,
  },

  // PressHold Button Service - Botones de presión sostenida para accesibilidad
  {
    provide: PRESS_HOLD_BUTTON_SERVICE,
    useClass: PressHoldButtonService,
  },

  // Theme Service - Gestión dinámica de colores y theming
  {
    provide: THEME_SERVICE,
    useClass: ThemeService,
  },

  // Phrase Store Service - 12 slots persistentes
  {
    provide: PHRASE_STORE_SERVICE,
    useClass: PhraseStoreService,
  },

  // Gallery Service - Selector de imágenes híbrido (web + móvil)
  {
    provide: GALLERY_SERVICE,
    useClass: HybridGalleryService,
  },
];
