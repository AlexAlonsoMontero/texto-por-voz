import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel } from '@ionic/angular/standalone';
import {
  TEXT_TO_SPEECH_SERVICE,
  ORIENTATION_SERVICE,
  SAFE_AREA_SERVICE,
} from '../core/infrastructure/injection-tokens';
import { ITextToSpeechService, SpeechPriority } from '../core/domain/interfaces/text-to-speech.interface';
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
    private readonly tts: ITextToSpeechService,
    @Inject(ORIENTATION_SERVICE)
    private readonly orientationService: IOrientationService,
    @Inject(SAFE_AREA_SERVICE)
    private readonly safeAreaService: ISafeAreaService,
  ) {}

  async ngOnInit(): Promise<void> {
    // 1. Configurar orientación landscape
    await this.setupOrientation();

    // 2. Mensaje de bienvenida accesible automático
    await this.announceWelcome();
  }

  ngOnDestroy(): void {
    // Limpiar monitoreo de orientación
    this.orientationService.stopOrientationMonitoring();
  }

  /**
   * Configura la orientación en landscape
   */
  private async setupOrientation(): Promise<void> {
    try {
      if (this.orientationService.isOrientationLockSupported()) {
        await this.orientationService.lockToLandscape();
        console.log('✅ Orientación bloqueada a landscape');
      }
    } catch (error) {
      console.error('❌ Error configurando orientación:', error);
    }
  }

  /**
   * Anuncia mensaje de bienvenida automático con contexto completo
   */
  private async announceWelcome(): Promise<void> {
    try {
      // Verificar que TTS esté listo (ya debe estarlo por AppComponent)
      if (!this.tts.isReady()) {
        console.warn('⚠️ TTS no está listo, esperando...');
        // Pequeña espera por si acaso
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const welcomeMessage = `
        Bienvenido a la página principal.
        Aplicación de texto por voz en orientación horizontal.
        Utiliza las teclas Tab para navegar entre elementos,
        Enter para seleccionar, y Escape para salir de selectores.
        Encontrarás botones disponibles para interactuar.
      `
        .replace(/\s+/g, ' ')
        .trim();

      await this.tts.speak(welcomeMessage, {
        priority: SpeechPriority.HIGH,
        interrupt: false, // No interrumpir mensaje de AppComponent si aún está sonando
      });

      console.log('✅ Mensaje de bienvenida de HomePage anunciado');
    } catch (error) {
      console.error('❌ Error en mensaje de bienvenida HomePage:', error);
    }
  }

  /**
   * Ejemplo de botón accesible con TTS
   */
  async onExampleButtonClick(): Promise<void> {
    try {
      await this.tts.speak('Botón de ejemplo presionado. Funcionalidad de prueba activada.', {
        priority: SpeechPriority.NORMAL,
        interrupt: true,
      });
    } catch (error) {
      console.error('❌ Error en botón de ejemplo:', error);
    }
  }

  /**
   * Método para probar diferentes prioridades de TTS
   */
  async testHighPrioritySpeech(): Promise<void> {
    try {
      await this.tts.speak('Mensaje de alta prioridad. Interrumpe cualquier síntesis anterior.', {
        priority: SpeechPriority.HIGH,
        interrupt: true,
      });
    } catch (error) {
      console.error('❌ Error en test de alta prioridad:', error);
    }
  }

  /**
   * Método para probar funcionalidad de pausa/reanudación (solo web)
   */
  testPauseResume(): void {
    try {
      if (this.tts.isSpeaking()) {
        this.tts.pause();
        console.log('TTS pausado');
      } else {
        this.tts.resume();
        console.log('TTS reanudado');
      }
    } catch (error) {
      console.error('❌ Error en pausa/reanudación:', error);
    }
  }

  /**
   * Método para detener síntesis actual
   */
  stopSpeech(): void {
    try {
      this.tts.stop();
      console.log('TTS detenido');
    } catch (error) {
      console.error('❌ Error deteniendo TTS:', error);
    }
  }
}
