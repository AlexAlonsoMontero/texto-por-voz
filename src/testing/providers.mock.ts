import { Provider } from '@angular/core';
import {
  TEXT_TO_SPEECH_SERVICE,
  THEME_SERVICE,
  ORIENTATION_SERVICE,
  SAFE_AREA_SERVICE,
  PRESS_HOLD_BUTTON_SERVICE,
  PHRASE_STORE_SERVICE,
  GALLERY_SERVICE,
  PHRASE_BUTTON_CONFIG_SERVICE,
} from '../app/core/infrastructure/injection-tokens';
import {
  createMockTTSService,
  createMockThemeService,
  createMockOrientationService,
  createMockSafeAreaService,
  createMockPressHoldButtonService,
  createMockPhraseStoreService,
  createMockGalleryService,
  createMockPhraseButtonConfigService,
} from './test-utils';

/**
 * Providers para tests con todos los servicios mockeados
 * Usar en TestBed.configureTestingModule({ providers: [...TEST_PROVIDERS] })
 */
export const TEST_PROVIDERS: Provider[] = [
  { provide: TEXT_TO_SPEECH_SERVICE, useValue: createMockTTSService() },
  { provide: THEME_SERVICE, useValue: createMockThemeService() },
  { provide: ORIENTATION_SERVICE, useValue: createMockOrientationService() },
  { provide: SAFE_AREA_SERVICE, useValue: createMockSafeAreaService() },
  { provide: PRESS_HOLD_BUTTON_SERVICE, useValue: createMockPressHoldButtonService() },
  { provide: PHRASE_STORE_SERVICE, useValue: createMockPhraseStoreService() },
  { provide: GALLERY_SERVICE, useValue: createMockGalleryService() },
  { provide: PHRASE_BUTTON_CONFIG_SERVICE, useValue: createMockPhraseButtonConfigService() },
];

/**
 * Helper para crear providers customizados
 */
export function createTestProvidersWithOverrides(overrides: Partial<{
  tts: any;
  theme: any;
  orientation: any;
  safeArea: any;
  pressHold: any;
  phraseStore: any;
  gallery: any;
  phraseButtonConfig: any;
}>): Provider[] {
  return [
    { provide: TEXT_TO_SPEECH_SERVICE, useValue: overrides.tts || createMockTTSService() },
    { provide: THEME_SERVICE, useValue: overrides.theme || createMockThemeService() },
    { provide: ORIENTATION_SERVICE, useValue: overrides.orientation || createMockOrientationService() },
    { provide: SAFE_AREA_SERVICE, useValue: overrides.safeArea || createMockSafeAreaService() },
    { provide: PRESS_HOLD_BUTTON_SERVICE, useValue: overrides.pressHold || createMockPressHoldButtonService() },
    { provide: PHRASE_STORE_SERVICE, useValue: overrides.phraseStore || createMockPhraseStoreService() },
    { provide: GALLERY_SERVICE, useValue: overrides.gallery || createMockGalleryService() },
    { provide: PHRASE_BUTTON_CONFIG_SERVICE, useValue: overrides.phraseButtonConfig || createMockPhraseButtonConfigService() },
  ];
}
