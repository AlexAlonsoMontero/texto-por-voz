import { Provider } from '@angular/core';
import { TEXT_TO_SPEECH_SERVICE } from './injection-tokens';
import { HybridTextToSpeechService } from './services/hybrid-text-to-speech.service';

/**
 * Providers del core de la aplicación
 * Configura la inyección de dependencias siguiendo arquitectura hexagonal
 */
export const CORE_PROVIDERS: Provider[] = [
  {
    provide: TEXT_TO_SPEECH_SERVICE,
    useClass: HybridTextToSpeechService,
  },
];
