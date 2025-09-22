import { Provider } from '@angular/core';
import { TEXT_TO_SPEECH_SERVICE, ORIENTATION_SERVICE, SAFE_AREA_SERVICE } from './injection-tokens';
import { HybridTextToSpeechService } from './services/hybrid-text-to-speech.service';
import { HybridOrientationService } from './services/hybrid-orientation.service';
import { HybridSafeAreaService } from './services/hybrid-safe-area.service';

/**
 * Providers del core de la aplicación
 * Configura la inyección de dependencias siguiendo arquitectura hexagonal
 */
export const CORE_PROVIDERS: Provider[] = [
  {
    provide: TEXT_TO_SPEECH_SERVICE,
    useClass: HybridTextToSpeechService,
  },
  {
    provide: ORIENTATION_SERVICE,
    useClass: HybridOrientationService,
  },
  {
    provide: SAFE_AREA_SERVICE,
    useClass: HybridSafeAreaService,
  },
];
