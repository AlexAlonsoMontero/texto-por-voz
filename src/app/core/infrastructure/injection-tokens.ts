import { InjectionToken } from '@angular/core';
import { ITextToSpeechService } from '../domain/interfaces/text-to-speech.interface';
import { IOrientationService } from '../domain/interfaces/orientation.interface';
import { ISafeAreaService } from '../domain/interfaces/safe-area.interface';
import { IPressHoldButtonService } from '../domain/interfaces/press-hold-button.interface';

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
 * Permite la inyección de dependencias para el servicio que maneja los botones de presión larga
 */
export const PRESS_HOLD_BUTTON_SERVICE = new InjectionToken<IPressHoldButtonService>('PressHoldButtonService', {
  providedIn: 'root',
  factory: () => {
    throw new Error('PRESS_HOLD_BUTTON_SERVICE debe ser provisto explícitamente en los providers');
  },
});
