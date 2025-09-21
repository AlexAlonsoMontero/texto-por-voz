import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel } from '@ionic/angular/standalone';
import { TEXT_TO_SPEECH_SERVICE, ORIENTATION_SERVICE } from '../core/infrastructure/injection-tokens';
import { ITextToSpeechService } from '../core/domain/interfaces/text-to-speech.interface';
import { IOrientationService } from '../core/domain/interfaces/orientation.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel],
})
export class HomePage implements OnInit, OnDestroy {
  constructor(
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly textToSpeechService: ITextToSpeechService,
    @Inject(ORIENTATION_SERVICE)
    private readonly orientationService: IOrientationService,
  ) {}

  ngOnInit(): void {
    // Bloquear orientación a landscape (solo nativo)
    if (this.orientationService.isOrientationLockSupported()) {
      this.orientationService.lockToLandscape();
    }

    // Mensaje de bienvenida automático
    if (this.textToSpeechService.isSupported()) {
      this.speak('Bienvenido a la aplicación de texto por voz accesible');
    } else {
      console.warn('TTS no soportado en esta plataforma');
    }
  }

  ngOnDestroy(): void {
    // Limpiar monitoreo de orientación
    this.orientationService.stopOrientationMonitoring();
  }

  /**
   * Ejemplo de uso básico del servicio TTS
   */
  async speak(text: string): Promise<void> {
    try {
      await this.textToSpeechService.speak(text);
    } catch (error) {
      console.error('Error al hablar:', error);
    }
  }

  /**
   * Ejemplo con opciones personalizadas
   */
  async speakWithOptions(): Promise<void> {
    try {
      await this.textToSpeechService.speak('Este es un ejemplo con opciones personalizadas de velocidad y tono', {
        rate: 0.8,
        pitch: 1.2,
        volume: 0.9,
        lang: 'es-ES',
      });
    } catch (error) {
      console.error('Error al hablar con opciones:', error);
    }
  }

  /**
   * Detener la síntesis actual
   */
  async stopSpeaking(): Promise<void> {
    try {
      await this.textToSpeechService.stop();
    } catch (error) {
      console.error('Error al detener:', error);
    }
  }

  /**
   * Verificar si está hablando
   */
  checkIfSpeaking(): void {
    const speaking = this.textToSpeechService.isSpeaking();
    this.speak(speaking ? 'Actualmente estoy hablando' : 'No estoy hablando ahora');
  }

  /**
   * Obtener voces disponibles (solo web)
   */
  async getVoices(): Promise<void> {
    try {
      const voices = await this.textToSpeechService.getAvailableVoices();
      console.log('Voces disponibles:', voices);
      await this.speak(`Hay ${voices.length} voces disponibles en el sistema`);
    } catch (error) {
      console.error('Error obteniendo voces:', error);
    }
  }
}
