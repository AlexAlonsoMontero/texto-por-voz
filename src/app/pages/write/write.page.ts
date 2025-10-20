import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonInput, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { TEXT_TO_SPEECH_SERVICE } from '../../core/infrastructure/injection-tokens';
import { ITextToSpeechService, SpeechPriority } from '../../core/domain/interfaces/text-to-speech.interface';
import { PressHoldButtonComponent } from '../../shared/components/press-hold-button/press-hold-button.component';

@Component({
  selector: 'app-write',
  templateUrl: './write.page.html',
  styleUrls: ['./write.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonInput,
    IonIcon,
    PressHoldButtonComponent,
  ],
})
export class WritePage implements OnInit {
  textContent: string = '';

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

  constructor(
    private readonly navCtrl: NavController,
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly tts: ITextToSpeechService,
  ) {}

  ngOnInit(): void {
    // Anuncio de bienvenida
    this.tts.speak('Página de escritura activada. Utiliza los botones alfabéticos para escribir texto.', {
      priority: SpeechPriority.HIGH,
      interrupt: true,
    });
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
  // MÉTODOS VACÍOS - Solo estructura, sin lógica
  // ========================================

  /**
   * Reproduce el texto en voz alta
   */
  onSpeakAction(actionId: string): void {
    console.log(`🔊 [Write] Acción de reproducir: ${actionId}`);
    // TODO: Implementar reproducción de texto
  }

  /**
   * Maneja la acción de abrir el selector de letras de un grupo
   * @param actionId ID del grupo de letras seleccionado
   */
  onLetterGroupAction(actionId: string, group: string): void {
    console.log('📝 Grupo de letras seleccionado:', actionId, group);

    // Si es el botón "123", abrir teclado numérico
    if (group === '123') {
      this.onNumericAction('numeric-from-group');
    } else {
      // TODO: Abrir selector de letras del grupo
    }
  }

  /**
   * Añade un espacio al texto
   */
  onSpaceAction(actionId: string): void {
    console.log(`⎵ [Write] Acción de espacio: ${actionId}`);
    // TODO: Añadir espacio
  }

  /**
   * Borra el último carácter
   */
  onBackspaceAction(actionId: string): void {
    console.log(`⌫ [Write] Acción de borrar: ${actionId}`);
    // TODO: Borrar último carácter
  }

  /**
   * Limpia todo el texto
   */
  onClearAction(actionId: string): void {
    console.log(`🗑️ [Write] Acción de limpiar: ${actionId}`);
    // TODO: Limpiar todo el texto
  }

  /**
   * Abre el selector de puntuación
   */
  onPunctuationAction(actionId: string): void {
    console.log(`.,?! [Write] Acción de puntuación: ${actionId}`);
    // TODO: Abrir selector de puntuación
  }

  /**
   * Abre el teclado numérico
   */
  onNumericAction(actionId: string): void {
    console.log(`123 [Write] Acción de numérico: ${actionId}`);
    // TODO: Abrir teclado numérico
  }
}
