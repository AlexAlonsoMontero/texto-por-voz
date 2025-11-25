import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonModal, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { warning } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { TEXT_TO_SPEECH_SERVICE, PHRASE_STORE_SERVICE } from '../../core/infrastructure/injection-tokens';
import { ITextToSpeechService, SpeechPriority } from '../../core/domain/interfaces/text-to-speech.interface';
import { IPhraseStoreService, PhraseStoreSlot } from '../../core/domain/interfaces/phrase-store.interface';
import { PressHoldConfigService } from '../../core/application/services/press-hold-config.service';
import { BackNavigationService } from '../../core/application/services/back-navigation.service';
import { TextInputSectionComponent } from './components/text-input-section/text-input-section.component';
import { PressHoldButtonComponent } from '../../shared/components/press-hold-button/press-hold-button.component';
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
    IonModal,
    IonIcon,
    TextInputSectionComponent,
    LetterKeyboardSectionComponent,
    ActionButtonsSectionComponent,
    LetterGridViewComponent,
    LetterCarouselViewComponent,
    PressHoldButtonComponent,
  ],
})
export class WritePage implements OnInit, OnDestroy {
  textContent: string = '';
  viewState: WriteViewState = 'groups';
  viewMode: WriteViewMode = 'panel';
  currentLetters: string[] = [];
  
  // Estado para el modal de guardado
  showSaveModal = false;
  showOverwriteModal = false;
  slots: PhraseStoreSlot[] = [];
  confirmOverwriteIndex: number | null = null;

  private viewModeSubscription?: Subscription;
  holdDuration$ = this.pressHoldConfig.duration$;

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
    private readonly pressHoldConfig: PressHoldConfigService,
    private readonly backNavService: BackNavigationService,
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly tts: ITextToSpeechService,
    @Inject(PHRASE_STORE_SERVICE)
    private readonly store: IPhraseStoreService,
  ) {
    addIcons({ warning });
  }

  ngOnInit(): void {
    // Cargar slots
    void this.store.getAll().then((all) => (this.slots = all));
    this.store.observeAll().subscribe((s) => (this.slots = s));

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
    this.backNavService.unregisterHandler();
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
   * Maneja el inicio de pulsación del botón Guardar (feedback TTS)
   */
  onSaveHoldStart(actionId: string): void {
    void this.tts.speak('Guardar frase', {
      priority: SpeechPriority.HIGH,
      interrupt: true,
    });
  }

  /**
   * Maneja la acción completada del botón Guardar
   * Abre el modal de selección de slot
   */
  onSaveAction(actionId: string): void {
    console.log(`💾 [Write] Acción de guardar: ${actionId}`);
    
    if (!this.textContent.trim()) {
      void this.tts.speak('Escribe algo antes de guardar', {
        priority: SpeechPriority.NORMAL,
        interrupt: true,
      });
      return;
    }

    this.showSaveModal = true;
    void this.tts.speak('Selecciona donde guardar', {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  // ========================================
  // GESTIÓN DEL MODAL DE GUARDADO
  // ========================================

  onCloseSaveModal(): void {
    this.showSaveModal = false;
    this.confirmOverwriteIndex = null;
    this.showOverwriteModal = false;
  }

  onPickSlotHoldStart(index: number): void {
    const slot = this.slots[index];
    if (slot.value) {
      void this.tts.speak(`Botón ${index + 1} ocupado. Mantén para sobrescribir.`);
    } else {
      void this.tts.speak(`Guardar en botón ${index + 1}`);
    }
  }

  async onPickSlotAction(index: number): Promise<void> {
    const slot = this.slots[index];

    // Si está vacío, guardar directamente
    if (!slot.value) {
      await this.saveToSlot(index);
      return;
    }

    // Si está ocupado, pedir confirmación
    this.confirmOverwriteIndex = index;
    this.showOverwriteModal = true;
    void this.tts.speak(`El botón ${index + 1} ya tiene una frase. ¿Sobrescribir?`);
  }

  async saveToSlot(index: number): Promise<void> {
    const textToSave = this.textContent.trim();
    await this.store.saveAt(index, textToSave, { overwrite: true });
    
    this.textContent = ''; // Limpiar texto tras guardar
    this.onCloseSaveModal();

    void this.tts.speak(`Frase guardada en botón ${index + 1}`, {
      priority: SpeechPriority.HIGH,
      interrupt: true,
    });
  }

  onConfirmOverwriteHoldStart(): void {
    void this.tts.speak('Confirmar sobrescritura');
  }

  async onConfirmOverwriteAction(): Promise<void> {
    if (this.confirmOverwriteIndex !== null) {
      await this.saveToSlot(this.confirmOverwriteIndex);
    }
  }

  onCancelOverwriteAction(): void {
    this.showOverwriteModal = false;
    this.confirmOverwriteIndex = null;
    void this.tts.speak('Cancelado');
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

    // Registrar manejador para volver a grupos con el botón atrás
    this.backNavService.registerHandler(() => {
      this.viewState = 'groups';
      this.currentLetters = [];
      this.backNavService.unregisterHandler();

      void this.tts.speak('Volviendo a grupos', {
        priority: SpeechPriority.NORMAL,
        interrupt: true,
      });
    });

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
    this.backNavService.unregisterHandler();
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
   * (Eliminado) Abre el selector de puntuación
   */
  // onPunctuationAction(actionId: string): void {
  //   console.log(`.,?! [Write] Acción de puntuación: ${actionId}`);
  //   void this.tts.speak('Función de puntuación no implementada aún', {
  //     priority: SpeechPriority.NORMAL,
  //     interrupt: true,
  //   });
  // }
}
