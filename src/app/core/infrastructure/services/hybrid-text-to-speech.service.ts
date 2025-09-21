import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  ITextToSpeechService,
  SpeechOptions,
} from '../../domain/interfaces/text-to-speech.interface';

/**
 * Implementación híbrida del servicio de Text-to-Speech
 * Funciona tanto en plataformas nativas (iOS/Android) como en web
 * Utiliza @capacitor-community/text-to-speech para nativo y Web Speech API para web
 */
@Injectable({
  providedIn: 'root',
})
export class HybridTextToSpeechService implements ITextToSpeechService {
  private readonly isNativePlatform: boolean = Capacitor.isNativePlatform();
  private readonly webSynth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {

    if (!this.isNativePlatform && typeof window !== 'undefined') {
      this.webSynth = window.speechSynthesis;
      console.log('TTS: Web Speech API disponible:', !!this.webSynth);
    }
  }

  /**
   * Convierte texto a voz usando la implementación apropiada para la plataforma
   * Método speak(text, options)



   */
  async speak(text: string, options?: SpeechOptions): Promise<void> {
    if (!text?.trim()) {
      console.warn('TTS: Texto vacío proporcionado');
      return;
    }

    const cleanText = text.trim();
    console.log(`TTS: Intentando leer: "${cleanText}"`);

    try {
              if (this.isNativePlatform) {
        await this.speakNative(cleanText, options);
      } else {
        await this.speakWeb(cleanText, options);
      }
      console.log('TTS: Síntesis completada exitosamente');
    } catch (error) {
      console.error('TTS: Error en síntesis:', error);

      // Fallback: si falla nativo, intentar con web
      if (this.isNativePlatform && this.webSynth) {
        console.warn('TTS: Intentando fallback a implementación web');
        try {
          await this.speakWeb(cleanText, options);
          console.log('TTS: Fallback web exitoso');
        } catch (fallbackError) {
          console.error('TTS: Error en fallback web:', fallbackError);
          throw new Error(`Error en TTS nativo y web: ${error}`);
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Implementación nativa usando @capacitor-community/text-to-speech
   */
  private async speakNative(text: string, options?: SpeechOptions): Promise<void> {
    try {
      const { TextToSpeech } = await import('@capacitor-community/text-to-speech');

      const speechOptions = {
        text,
        lang: options?.lang || 'es-ES',
        rate: options?.rate || 1.0,
        pitch: options?.pitch || 1.0,
        volume: options?.volume || 1.0,
        category: options?.category || 'ambient',
      };

      console.log('TTS: Usando síntesis nativa con opciones:', speechOptions);
      await TextToSpeech.speak(speechOptions);
    } catch (error) {
      console.error('TTS: Error en síntesis nativa:', error);
      throw new Error(`Error en TTS nativo: ${error}`);
    }
  }

  /**
   * Implementación web usando Web Speech API
   */
  private async speakWeb(text: string, options?: SpeechOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.webSynth) {
        const error = 'Web Speech API no disponible en este navegador';
        console.error('TTS:', error);
        reject(new Error(error));
        return;
      }

      // Detener cualquier síntesis en curso
      this.webSynth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options?.lang || 'es-ES';
      utterance.rate = options?.rate || 1.0;
      utterance.pitch = options?.pitch || 1.0;
      utterance.volume = options?.volume || 1.0;

      console.log('TTS: Usando Web Speech API con configuración:', {
        lang: utterance.lang,
        rate: utterance.rate,
        pitch: utterance.pitch,
        volume: utterance.volume,
      });

      utterance.onstart = () => {
        console.log('TTS: Síntesis web iniciada');
      };

      utterance.onend = () => {
        console.log('TTS: Síntesis web completada');
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('TTS: Error en Web Speech API:', event);
        this.currentUtterance = null;
        reject(new Error(`Error en síntesis web: ${event.error}`));
      };

      this.currentUtterance = utterance;
      this.webSynth.speak(utterance);
    });
  }

  /**
   * Detiene la síntesis de voz actual
   */
  async stop(): Promise<void> {
    console.log('TTS: Deteniendo síntesis');

    try {
      if (this.isNativePlatform) {
        const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
        await TextToSpeech.stop();
        console.log('TTS: Síntesis nativa detenida');
      } else if (this.webSynth) {
        this.webSynth.cancel();
        this.currentUtterance = null;
        console.log('TTS: Síntesis web detenida');
      }
    } catch (error) {
      console.error('TTS: Error deteniendo síntesis:', error);
    }
  }

  /**
   * Verifica si el TTS está soportado en la plataforma actual
   */
  isSupported(): boolean {
    if (this.isNativePlatform) {
      // En plataformas nativas asumimos que el plugin está instalado
      return true;
    }

    const supported = !!(this.webSynth && 'speechSynthesis' in window);
    console.log('TTS: Soporte verificado:', supported);
    return supported;
  }

  /**
   * Verifica si actualmente se está reproduciendo voz
   */
  isSpeaking(): boolean {
    if (this.isNativePlatform) {
      // En nativo no hay forma directa de verificar el estado
      // Se podría implementar un state management interno si es necesario
      return false;
    }

    const speaking = this.webSynth?.speaking || false;
    return speaking;
  }

  /**
   * Obtiene las voces disponibles en el sistema
   * Solo funciona en web, en nativo retorna array vacío
   */
  async getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
    if (this.isNativePlatform) {
      console.log('TTS: getAvailableVoices no soportado en plataforma nativa');
      return [];
    }

    return new Promise((resolve) => {
      if (!this.webSynth) {
        console.log('TTS: Web Speech API no disponible para obtener voces');
        resolve([]);
        return;
      }

      const voices = this.webSynth.getVoices();
      if (voices.length > 0) {
        console.log(`TTS: ${voices.length} voces encontradas inmediatamente`);
        resolve(voices);
      } else {
        console.log('TTS: Esperando carga de voces...');
        // Esperar a que se carguen las voces
        this.webSynth.onvoiceschanged = () => {
          const loadedVoices = this.webSynth!.getVoices();
          console.log(`TTS: ${loadedVoices.length} voces cargadas`);
          resolve(loadedVoices);
        };

        // Timeout de seguridad
        setTimeout(() => {
          const timeoutVoices = this.webSynth!.getVoices();
          console.log(`TTS: Timeout alcanzado, ${timeoutVoices.length} voces disponibles`);
          resolve(timeoutVoices);
        }, 3000);
      }
    });
  }
}
