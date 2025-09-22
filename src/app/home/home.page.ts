import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel } from '@ionic/angular/standalone';
import {
  TEXT_TO_SPEECH_SERVICE,
  ORIENTATION_SERVICE,
  SAFE_AREA_SERVICE,
} from '../core/infrastructure/injection-tokens';
import { ITextToSpeechService } from '../core/domain/interfaces/text-to-speech.interface';
import { IOrientationService } from '../core/domain/interfaces/orientation.interface';
import { ISafeAreaService } from '../core/domain/interfaces/safe-area.interface';

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
    @Inject(SAFE_AREA_SERVICE)
    private readonly safeAreaService: ISafeAreaService,
  ) {}

  ngOnInit(): void {
    // Bloquear orientación a landscape (solo nativo)
    if (this.orientationService.isOrientationLockSupported()) {
      this.orientationService.lockToLandscape();
    }

    if (this.textToSpeechService.isSupported()) {
      this.speak('Bienvenido a la aplicación de texto por voz');
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
}
