import { ITextToSpeechService } from '../app/core/domain/interfaces/text-to-speech.interface';
import { IThemeService } from '../app/core/domain/interfaces/theme.interface';
import { IOrientationService } from '../app/core/domain/interfaces/orientation.interface';
import { ISafeAreaService } from '../app/core/domain/interfaces/safe-area.interface';
import { IPressHoldButtonService } from '../app/core/domain/interfaces/press-hold-button.interface';
import { IPhraseStoreService } from '../app/core/domain/interfaces/phrase-store.interface';
import { IGalleryService } from '../app/core/domain/interfaces/gallery.interface';
import { IPhraseButtonConfigService } from '../app/core/domain/interfaces/phrase-button-config.interface';

/**
 * Mock para ITextToSpeechService
 */
export function createMockTTSService(): jasmine.SpyObj<ITextToSpeechService> {
  return jasmine.createSpyObj('ITextToSpeechService', [
    'initialize',
    'speak',
    'stop',
    'pause',
    'resume',
    'isSupported',
    'isReady',
    'isSpeaking',
    'getAvailableVoices',
    'getStatus',
    'needsActivation',
    'activateTTS',
  ]);
}

/**
 * Mock para IThemeService
 */
export function createMockThemeService(): jasmine.SpyObj<IThemeService> {
  const mock = jasmine.createSpyObj('IThemeService', [
    'initialize',
    'setThemeColors',
    'getThemeColors',
    'resetToDefault',
    'applyTheme',
    'getPredefinedColors',
    'getColorByName',
  ]);
  
  // Configurar valores por defecto para los métodos que devuelven Promises
  mock.initialize.and.returnValue(Promise.resolve());
  mock.getThemeColors.and.returnValue({
    primary: '#2196F3',
    secondary: '#FF9800',
    background: '#FFFFFF',
    text: '#000000',
  });
  mock.getPredefinedColors.and.returnValue([]);
  
  return mock;
}

/**
 * Mock para IOrientationService
 */
export function createMockOrientationService(): jasmine.SpyObj<IOrientationService> {
  return jasmine.createSpyObj('IOrientationService', [
    'isLandscape',
    'isPortrait',
    'getCurrentOrientation',
    'startOrientationMonitoring',
    'stopOrientationMonitoring',
    'lockToLandscape',
    'unlockOrientation',
    'isOrientationLockSupported',
  ]);
}

/**
 * Mock para ISafeAreaService
 */
export function createMockSafeAreaService(): jasmine.SpyObj<ISafeAreaService> {
  const mock = jasmine.createSpyObj('ISafeAreaService', [
    'getSafeAreaInsets',
    'getAvailableHeight',
    'getAvailableWidth',
    'hasSystemBars',
    'debugSafeAreaInfo',
  ]);
  
  // Configurar valores por defecto
  mock.getSafeAreaInsets.and.returnValue(Promise.resolve({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }));
  mock.getAvailableHeight.and.returnValue(Promise.resolve(800));
  mock.getAvailableWidth.and.returnValue(Promise.resolve(600));
  mock.hasSystemBars.and.returnValue(Promise.resolve(false));
  
  return mock;
}

/**
 * Mock para IPressHoldButtonService
 */
export function createMockPressHoldButtonService(): jasmine.SpyObj<IPressHoldButtonService> {
  return jasmine.createSpyObj('IPressHoldButtonService', [
    'startPressTimer',
    'cancelPressTimer',
    'isPressing',
    'getProgress',
    'setGlobalConfig',
    'getGlobalConfig',
  ]);
}

/**
 * Mock para IPhraseStoreService
 */
export function createMockPhraseStoreService(): jasmine.SpyObj<IPhraseStoreService> {
  const mock = jasmine.createSpyObj('IPhraseStoreService', [
    'getAll',
    'observeAll',
    'saveAt',
    'removeAt',
    'clearAll',
    'findDuplicateIndex',
    'normalize',
    'setImageAt',
    'removeImageAt',
    'updateCapacity',
  ]);
  
  // Add readonly property
  Object.defineProperty(mock, 'capacity', {
    get: () => 12,
    configurable: true,
  });
  
  return mock;
}

/**
 * Mock para IGalleryService
 */
export function createMockGalleryService(): jasmine.SpyObj<IGalleryService> {
  return jasmine.createSpyObj('IGalleryService', [
    'pickImage',
    'checkPermissions',
    'requestPermissions',
  ]);
}

/**
 * Mock para IPhraseButtonConfigService
 */
export function createMockPhraseButtonConfigService(): jasmine.SpyObj<IPhraseButtonConfigService> {
  return jasmine.createSpyObj('IPhraseButtonConfigService', [
    'getConfig',
    'setConfig',
    'getSizeConfig',
    'getGridLayout',
    'getGridLayoutForSize',
  ]);
}
