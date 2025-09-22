import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  ITextToSpeechService,
  SpeechOptions,
  SpeechPriority,
  TTSStatus,
} from '../../domain/interfaces/text-to-speech.interface';

@Injectable({
  providedIn: 'root',
})
export class HybridTextToSpeechService implements ITextToSpeechService {
  private status: TTSStatus = TTSStatus.UNINITIALIZED;
  private readonly isNativePlatform: boolean = Capacitor.isNativePlatform();
  private currentSpeech: any = null;
  private webSpeechAPI?: SpeechSynthesis;
  private capacitorTTS?: any;
  private needsUserActivation = false;

  constructor() {
    console.log(`TTS Service creado - Plataforma: ${this.isNativePlatform ? 'Nativo' : 'Web'}`);
  }

  async initialize(): Promise<void> {
    if (this.status !== TTSStatus.UNINITIALIZED) {
      console.log('TTS ya inicializado, saltando...');
      return;
    }

    this.status = TTSStatus.INITIALIZING;
    console.log('Inicializando TTS Service...');

    try {
      if (this.isNativePlatform) {
        await this.initializeNative();
      } else {
        await this.initializeWeb();
      }

      this.status = TTSStatus.READY;
      console.log('TTS Service inicializado correctamente');
    } catch (error) {
      this.status = TTSStatus.ERROR;
      console.error('Error inicializando TTS Service:', error);
      throw error;
    }
  }

  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    if (this.status === TTSStatus.UNINITIALIZED) {
      console.log('TTS no inicializado, inicializando automáticamente...');
      await this.initialize();
    }

    if (this.status !== TTSStatus.READY && this.status !== TTSStatus.SPEAKING) {
      console.warn('TTS no disponible, saltando síntesis');
      return;
    }

    if (!text?.trim()) {
      console.warn('Texto vacío proporcionado');
      return;
    }

    const speechOptions: SpeechOptions = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      lang: 'es-ES',
      interrupt: true,
      priority: SpeechPriority.NORMAL,
      ...options,
    };

    if (
      speechOptions.interrupt ||
      speechOptions.priority === SpeechPriority.HIGH ||
      speechOptions.priority === SpeechPriority.EMERGENCY
    ) {
      this.stop();
    }

    try {
      if (this.isNativePlatform) {
        await this.speakNative(text, speechOptions);
      } else {
        await this.speakWeb(text, speechOptions);
      }
    } catch (error) {
      console.error('Error en síntesis de voz:', error);
      if (this.isNativePlatform) {
        console.log('Fallback a síntesis web...');
        await this.speakWeb(text, speechOptions);
      }
    }
  }

  stop(): void {
    try {
      if (this.isNativePlatform && this.capacitorTTS) {
        this.capacitorTTS.stop();
      } else if (this.webSpeechAPI) {
        this.webSpeechAPI.cancel();
      }

      this.currentSpeech = null;

      if (this.status === TTSStatus.SPEAKING || this.status === TTSStatus.PAUSED) {
        this.status = TTSStatus.READY;
      }
    } catch (error) {
      console.error('Error deteniendo síntesis:', error);
    }
  }

  pause(): void {
    try {
      if (!this.isNativePlatform && this.webSpeechAPI) {
        this.webSpeechAPI.pause();
        this.status = TTSStatus.PAUSED;
      }
    } catch (error) {
      console.error('Error pausando síntesis:', error);
    }
  }

  resume(): void {
    try {
      if (!this.isNativePlatform && this.webSpeechAPI) {
        this.webSpeechAPI.resume();
        this.status = TTSStatus.SPEAKING;
      }
    } catch (error) {
      console.error('Error reanudando síntesis:', error);
    }
  }

  isSupported(): boolean {
    if (this.isNativePlatform) {
      return true;
    } else {
      return 'speechSynthesis' in window;
    }
  }

  isReady(): boolean {
    return this.status === TTSStatus.READY;
  }

  isSpeaking(): boolean {
    return this.status === TTSStatus.SPEAKING;
  }

  getStatus(): TTSStatus {
    return this.status;
  }

  needsActivation(): boolean {
    return this.needsUserActivation;
  }

  async activateTTS(): Promise<void> {
    if (!this.isNativePlatform && this.webSpeechAPI) {
      try {
        // Intentar una síntesis muy breve para activar permisos
        const testUtterance = new SpeechSynthesisUtterance(' ');
        testUtterance.volume = 0.01; // Volumen muy bajo
        testUtterance.rate = 10; // Muy rápido para que sea imperceptible

        await new Promise<void>((resolve, reject) => {
          testUtterance.onend = () => {
            this.needsUserActivation = false;
            this.status = TTSStatus.READY;
            console.log('✅ TTS activado exitosamente en navegador');
            resolve();
          };

          testUtterance.onerror = (event) => {
            reject(new Error(`Error activando TTS: ${event.error}`));
          };

          this.webSpeechAPI!.speak(testUtterance);
        });
      } catch (error) {
        console.error('Error activando TTS:', error);
        throw error;
      }
    }
  }

  async getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.isNativePlatform && this.webSpeechAPI) {
      return this.webSpeechAPI.getVoices();
    }
    return [];
  }

  private async initializeNative(): Promise<void> {
    try {
      const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
      this.capacitorTTS = TextToSpeech;
      console.log('Capacitor TTS inicializado');
    } catch (error) {
      console.error('Error cargando Capacitor TTS:', error);
      throw new Error('Capacitor TTS no disponible');
    }
  }

  private async initializeWeb(): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('Web Speech API no soportada en este navegador');
    }

    this.webSpeechAPI = window.speechSynthesis;

    return new Promise((resolve) => {
      if (this.webSpeechAPI!.getVoices().length > 0) {
        resolve();
      } else {
        this.webSpeechAPI!.addEventListener('voiceschanged', () => resolve(), { once: true });
      }
    });
  }

  private async speakNative(text: string, options: SpeechOptions): Promise<void> {
    this.status = TTSStatus.SPEAKING;

    await this.capacitorTTS.speak({
      text,
      lang: options.lang || 'es-ES',
      rate: options.rate || 1.0,
      pitch: options.pitch || 1.0,
      volume: options.volume || 1.0,
      category: options.category || 'ambient',
    });

    this.status = TTSStatus.READY;
  }

  private async speakWeb(text: string, options: SpeechOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.webSpeechAPI) {
        reject(new Error('Web Speech API no disponible'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.lang || 'es-ES';

      utterance.onstart = () => {
        this.status = TTSStatus.SPEAKING;
        this.currentSpeech = utterance;
      };

      utterance.onend = () => {
        this.status = TTSStatus.READY;
        this.currentSpeech = null;
        resolve();
      };

      utterance.onerror = (errorEvent) => {
        this.currentSpeech = null;

        if (errorEvent.error === 'not-allowed') {
          this.needsUserActivation = true;
          this.status = TTSStatus.READY; // Mantener como listo para intentos posteriores
          console.warn('⚠️ TTS requiere activación del usuario en navegador');
          reject(new Error('TTS_NEEDS_USER_ACTIVATION'));
        } else {
          this.status = TTSStatus.ERROR;
          reject(new Error(`Web Speech API error: ${errorEvent.error || 'Unknown error'}`));
        }
      };

      this.webSpeechAPI.speak(utterance);
    });
  }
}
