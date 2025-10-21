import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TEXT_TO_SPEECH_SERVICE } from '../../core/infrastructure/injection-tokens';
import { ITextToSpeechService, SpeechPriority } from '../../core/domain/interfaces/text-to-speech.interface';
import { PressHoldButtonComponent } from '../../shared/components/press-hold-button/press-hold-button.component';
import { TextInputSectionComponent } from './components/text-input-section/text-input-section.component';
import { LetterKeyboardSectionComponent } from './components/letter-keyboard-section/letter-keyboard-section.component';
import { ActionButtonsSectionComponent } from './components/action-buttons-section/action-buttons-section.component';
import { LetterGridViewComponent } from './components/letter-grid-view/letter-grid-view.component';
import { LetterCarouselViewComponent } from './components/letter-carousel-view/letter-carousel-view.component';
import { WriteViewConfigService } from '../../core/infrastructure/services/write-view-config.service';
import { WriteViewMode } from '../../core/domain/interfaces/write-view.interface';

type WriteViewState = 'groups' | 'letters';

@Component({
  selector: 'app-write',
  templateUrl: './write.page.html',
  styleUrls: ['./write.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    PressHoldButtonComponent,
    TextInputSectionComponent,
    LetterKeyboardSectionComponent,
    ActionButtonsSectionComponent,
    LetterGridViewComponent,
    LetterCarouselViewComponent,
  ],
})
export class WritePage implements OnInit, OnDestroy {
  textContent: string = '';
  viewState: WriteViewState = 'groups';
  viewMode: WriteViewMode = 'panel';
  currentLetters: string[] = [];
  private viewModeSubscription?: Subscription;

  // Grupos de letras del abecedario español (sin acentos, incluye Ñ)
  letterGroups: string[] = [
    'A-D', // A, B, C, D
    'E-H', // E, F, G, H
    'I-L', // I, J, K, L
    'M-P', // M, N, Ñ, O, P
    'Q-T', // Q, R, S, T
    'U-X', // U, V, W, X
    'Y-Ñ', // Y, Z, Ñ
    '123', // Teclado numérico
  ];

  // Mapeo de grupos a letras individuales
  private readonly groupLettersMap: Record<string, string[]> = {
    'A-D': ['A', 'B', 'C', 'D'],
    'E-H': ['E', 'F', 'G', 'H'],
    'I-L': ['I', 'J', 'K', 'L'],
    'M-P': ['M', 'N', 'Ñ', 'O', 'P'],
    'Q-T': ['Q', 'R', 'S', 'T'],
    'U-X': ['U', 'V', 'W', 'X'],
    'Y-Ñ': ['Y', 'Z', 'Ñ'],
    '123': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  };

  // Mapeo de grupos a frases TTS
  private readonly groupTTSMap: Record<string, string> = {
    'A-D': 'Desde la A hasta la D',
    'E-H': 'Desde la E hasta la H',
    'I-L': 'Desde la I hasta la L',
    'M-P': 'Desde la M hasta la P',
    'Q-T': 'Desde la Q hasta la T',
    'U-X': 'Desde la U hasta la X',
    'Y-Ñ': 'Desde la Y hasta la Ñ',
    '123': 'Números del 0 al 9',
  };

  constructor(
    private readonly navCtrl: NavController,
    private readonly writeViewConfig: WriteViewConfigService,
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly tts: ITextToSpeechService,
  ) {}

  ngOnInit(): void {
    // Cargar modo de vista
    this.viewModeSubscription = this.writeViewConfig.viewMode$.subscribe((mode) => {
      this.viewMode = mode;
    });

    // Forzar carga inicial desde almacenamiento para no quedar en 'panel' por defecto
    void this.ensureViewModeLoaded();

    // Anuncio de bienvenida
    void this.tts.speak('Página de escritura activada. Utiliza los botones alfabéticos para escribir texto.', {
      priority: SpeechPriority.HIGH,
      interrupt: true,
    });
  }

  ngOnDestroy(): void {
    this.viewModeSubscription?.unsubscribe();
  }

  /**
   * Asegura cargar el modo de vista persistido al iniciar la página
   */
  private async ensureViewModeLoaded(): Promise<void> {
    try {
      const mode = await this.writeViewConfig.getViewMode();
      this.viewMode = mode;
    } catch (e) {
      console.error('[WritePage] Error cargando modo de vista, usando panel por defecto', e);
      this.viewMode = 'panel';
    }
  }

  /**
   * Maneja la acción del botón de volver (press-hold)
   */
  async onBackAction(actionId: string): Promise<void> {
    console.log(`🔙 [Write] Acción de volver ejecutada: ${actionId}`);
    await this.goBack();
  }

  /**
   * Volver a la página principal
   */
  async goBack(): Promise<void> {
    await this.tts.speak('Volviendo a la página principal', {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });

    this.navCtrl.navigateRoot('/home');
  }

  // ========================================
  // MÉTODOS DE NAVEGACIÓN Y FEEDBACK
  // ========================================

  /**
   * Reproduce el texto en voz alta
   */
  onSpeakAction(actionId: string): void {
    console.log(`🔊 [Write] Acción de reproducir: ${actionId}`);

    if (this.textContent.trim()) {
      void this.tts.speak(this.textContent, {
        priority: SpeechPriority.HIGH,
        interrupt: true,
      });
    } else {
      void this.tts.speak('No hay texto para reproducir', {
        priority: SpeechPriority.NORMAL,
        interrupt: true,
      });
    }
  }

  /**
   * Maneja el inicio de pulsación de un grupo (feedback TTS)
   */
  onLetterGroupHoldStart(actionId: string, group: string): void {
    const ttsMessage = this.groupTTSMap[group] || group;
    void this.tts.speak(ttsMessage, {
      priority: SpeechPriority.HIGH,
      interrupt: true,
    });
  }

  /**
   * Maneja la acción completada de seleccionar un grupo de letras
   */
  onLetterGroupAction(actionId: string, group: string): void {
    console.log('📝 Grupo de letras seleccionado:', actionId, group);

    // Cambiar a vista de letras individuales
    this.currentLetters = this.groupLettersMap[group] || [];
    this.viewState = 'letters';

    void this.tts.speak(`Grupo ${group} seleccionado. Elige una letra.`, {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  /**
   * Maneja el inicio de pulsación de una letra individual (feedback TTS)
   */
  onLetterHoldStart(letter: string): void {
    // Pronunciar la letra
    const ttsText = this.isNumeric(letter) ? this.getNumberName(letter) : letter;
    void this.tts.speak(ttsText, {
      priority: SpeechPriority.HIGH,
      interrupt: true,
    });
  }

  /**
   * Maneja la selección de una letra individual (pulsación completada)
   */
  onLetterSelected(letter: string): void {
    console.log('✍️ Letra seleccionada:', letter);

    // Añadir letra al texto
    this.textContent += letter;

    // Feedback TTS
    const ttsText = this.isNumeric(letter) ? this.getNumberName(letter) : letter;
    void this.tts.speak(`${ttsText} añadida`, {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });

    // Volver al panel de grupos
    this.viewState = 'groups';
    this.currentLetters = [];
  }

  /**
   * Determina si un carácter es numérico
   */
  private isNumeric(char: string): boolean {
    return /^\d$/.test(char);
  }

  /**
   * Convierte un dígito a su nombre en español
   */
  private getNumberName(digit: string): string {
    const names: Record<string, string> = {
      '0': 'cero',
      '1': 'uno',
      '2': 'dos',
      '3': 'tres',
      '4': 'cuatro',
      '5': 'cinco',
      '6': 'seis',
      '7': 'siete',
      '8': 'ocho',
      '9': 'nueve',
    };
    return names[digit] || digit;
  }

  // ========================================
  // MÉTODOS DE BOTONES DE ACCIÓN
  // ========================================

  /**
   * Añade un espacio al texto
   */
  onSpaceAction(actionId: string): void {
    console.log(`⎵ [Write] Acción de espacio: ${actionId}`);
    this.textContent += ' ';
    void this.tts.speak('Espacio añadido', {
      priority: SpeechPriority.LOW,
      interrupt: false,
    });
  }

  /**
   * Borra el último carácter
   */
  onBackspaceAction(actionId: string): void {
    console.log(`⌫ [Write] Acción de borrar: ${actionId}`);

    if (this.textContent.length > 0) {
      this.textContent = this.textContent.slice(0, -1);
      void this.tts.speak('Carácter borrado', {
        priority: SpeechPriority.LOW,
        interrupt: false,
      });
    } else {
      void this.tts.speak('No hay texto para borrar', {
        priority: SpeechPriority.NORMAL,
        interrupt: true,
      });
    }
  }

  /**
   * Limpia todo el texto
   */
  onClearAction(actionId: string): void {
    console.log(`🗑️ [Write] Acción de limpiar: ${actionId}`);

    if (this.textContent.length > 0) {
      this.textContent = '';
      void this.tts.speak('Texto borrado completamente', {
        priority: SpeechPriority.NORMAL,
        interrupt: true,
      });
    } else {
      void this.tts.speak('El texto ya está vacío', {
        priority: SpeechPriority.NORMAL,
        interrupt: true,
      });
    }
  }

  /**
   * Abre el selector de puntuación
   */
  onPunctuationAction(actionId: string): void {
    console.log(`.,?! [Write] Acción de puntuación: ${actionId}`);
    void this.tts.speak('Función de puntuación no implementada aún', {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }
}
