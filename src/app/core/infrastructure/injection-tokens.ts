import { InjectionToken } from '@angular/core';
import { ITextToSpeechService } from '../domain/interfaces/text-to-speech.interface';
import { IOrientationService } from '../domain/interfaces/orientation.interface';

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
 * Token de inyección para el servicio de Orientación
 * Permite la inyección de dependencias siguiendo el patrón de arquitectura hexagonal
 */
export const ORIENTATION_SERVICE = new InjectionToken<IOrientationService>('OrientationService', {
  providedIn: 'root',
  factory: () => {
    throw new Error('ORIENTATION_SERVICE debe ser provisto explícitamente en los providers');
  },
});
