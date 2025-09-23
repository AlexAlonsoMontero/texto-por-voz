import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import {
  TEXT_TO_SPEECH_SERVICE,
  ORIENTATION_SERVICE,
  SAFE_AREA_SERVICE,
  PRESS_HOLD_BUTTON_SERVICE,
} from '../core/infrastructure/injection-tokens';
import { ITextToSpeechService, SpeechPriority } from '../core/domain/interfaces/text-to-speech.interface';
import { IOrientationService } from '../core/domain/interfaces/orientation.interface';
import { ISafeAreaService } from '../core/domain/interfaces/safe-area.interface';
import { IPressHoldButtonService } from '../core/domain/interfaces/press-hold-button.interface';
import { TtsActivationComponent } from '../shared/components/tts-activation/tts-activation.component';
import { PressHoldButtonComponent } from '../shared/components/press-hold-button/press-hold-button.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonContent, TtsActivationComponent, PressHoldButtonComponent],
})
export class HomePage implements OnInit, OnDestroy {
  showActivation = false;

  constructor(
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly tts: ITextToSpeechService,
    @Inject(ORIENTATION_SERVICE)
    private readonly orientationService: IOrientationService,
    @Inject(SAFE_AREA_SERVICE)
    private readonly safeAreaService: ISafeAreaService,
    @Inject(PRESS_HOLD_BUTTON_SERVICE)
    private readonly pressHoldService: IPressHoldButtonService,
  ) {}

  ngOnInit(): void {
    this.initializePageAsync();
    this.configureButtons();
  }

  ngOnDestroy(): void {
    this.orientationService.stopOrientationMonitoring();
  }

  /**
   * Inicialización asíncrona de la página
   */
  private async initializePageAsync(): Promise<void> {
    try {
      // 1. Configurar orientación landscape
      await this.setupOrientation();

      // 2. Mensaje de bienvenida accesible automático
      await this.announceWelcome();
    } catch (error) {
      console.error('❌ Error en inicialización de HomePage:', error);
    }
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

        // Verificar si necesita activación del usuario
        if (this.tts.needsActivation()) {
          console.log('🔧 TTS requiere activación manual del usuario');
          this.showActivation = true;
          return;
        }

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

      // Si falla por necesidad de activación, mostrar componente
      if (error instanceof Error && error.message === 'TTS_NEEDS_USER_ACTIVATION') {
        this.showActivation = true;
      }
    }
  }

  onTtsActivated(): void {
    this.showActivation = false;
    // Reintentar el mensaje de bienvenida
    setTimeout(() => this.announceWelcome(), 500);
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

  private configureButtons(): void {
    // Configurar comportamiento global de botones de presión sostenida
    this.pressHoldService.setGlobalConfig({
      holdDuration: 3000, // 3 segundos por defecto
      enableHapticFeedback: true,
      showProgress: true,
    });
  }

  /**
   * Configura el tiempo de presión para todos los botones
   */
  setGlobalHoldDuration(duration: number): void {
    this.pressHoldService.setGlobalConfig({ holdDuration: duration });

    this.tts.speak(`Tiempo de presión configurado a ${duration / 1000} segundos`, {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  // Acciones de los botones
  async onExampleAction(): Promise<void> {
    await this.tts.speak('Acción de ejemplo ejecutada correctamente.', {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  async onReadTextAction(): Promise<void> {
    await this.tts.speak('Leyendo texto de prueba para verificar funcionalidad.', {
      priority: SpeechPriority.HIGH,
      interrupt: true,
    });
  }

  async onConfigurationAction(): Promise<void> {
    await this.tts.speak('Abriendo configuración de la aplicación.', {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  // Eventos de botones de presión sostenida
  onPressStarted(buttonId: string): void {
    console.log(`🚀 Presión iniciada en botón: ${buttonId}`);
  }

  onPressCancelled(buttonId: string): void {
    console.log(`❌ Presión cancelada en botón: ${buttonId}`);

    this.tts.speak('Presión cancelada', {
      priority: SpeechPriority.HIGH,
      interrupt: true,
    });
  }
}
