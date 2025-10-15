import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { volumeHighOutline } from 'ionicons/icons';
import { TEXT_TO_SPEECH_SERVICE } from '../../../core/infrastructure/injection-tokens';
import type { ITextToSpeechService } from '../../../core/domain/interfaces/text-to-speech.interface';

@Component({
  selector: 'app-tts-activation',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonText, IonCard, IonCardContent, IonCardHeader, IonCardTitle],
  template: `
    <ion-card class="tts-activation-card">
      <ion-card-header>
        <ion-card-title class="activation-title">
          <ion-icon name="volume-high-outline" class="activation-icon"></ion-icon>
          Activar Síntesis de Voz
        </ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <ion-text class="activation-description">
          Para usar las funciones de voz en el navegador, es necesario activarlas manualmente.
        </ion-text>

        <ion-button
          expand="block"
          size="large"
          color="primary"
          class="activation-button"
          (click)="activateTTS()"
          [disabled]="isActivating"
          aria-label="Activar síntesis de voz en el navegador"
        >
          <ion-icon name="volume-high-outline" slot="start"></ion-icon>
          {{ isActivating ? 'Activando...' : 'Activar Voz' }}
        </ion-button>

        <ion-text class="activation-help" color="medium">
          Haz clic en el botón para permitir que la aplicación use la síntesis de voz
        </ion-text>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      .tts-activation-card {
        margin: 20px;
        border: 3px solid var(--ion-color-primary);
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 120, 215, 0.3);
        background: var(--ion-color-light);
      }

      .activation-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 24px;
        font-weight: bold;
        color: var(--ion-color-primary);
        text-align: center;
        justify-content: center;
      }

      .activation-icon {
        font-size: 32px;
      }

      .activation-description {
        display: block;
        font-size: 18px;
        line-height: 1.5;
        margin: 16px 0;
        text-align: center;
        color: var(--ion-color-dark);
      }

      .activation-button {
        margin: 24px 0 16px 0;
        height: 56px;
        font-size: 20px;
        font-weight: bold;
      }

      .activation-help {
        display: block;
        font-size: 14px;
        text-align: center;
        margin-top: 8px;
      }

      /* Accesibilidad mejorada */
      .activation-button:focus {
        outline: 4px solid #ffd600;
        outline-offset: 2px;
      }

      @media (max-width: 768px) {
        .activation-title {
          font-size: 20px;
        }

        .activation-description {
          font-size: 16px;
        }

        .activation-button {
          height: 48px;
          font-size: 18px;
        }
      }
    `,
  ],
})
export class TtsActivationComponent {
  @Output() activated = new EventEmitter<void>();

  isActivating = false;

  constructor(
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly textToSpeechService: ITextToSpeechService,
  ) {
    addIcons({ volumeHighOutline });
  }

  async activateTTS(): Promise<void> {
    if (this.isActivating) return;

    this.isActivating = true;

    try {
      await this.textToSpeechService.activateTTS();

      // Anunciar que la activación fue exitosa
      await this.textToSpeechService.speak(
        'Síntesis de voz activada correctamente. Ya puedes usar todas las funciones de la aplicación.',
        { interrupt: true },
      );

      this.activated.emit();
    } catch (error) {
      console.error('❌ Error activando TTS:', error);

      // Mostrar error de manera accesible (sin TTS ya que falló)
      alert('Error al activar la síntesis de voz. Por favor, actualiza la página e inténtalo de nuevo.');
    } finally {
      this.isActivating = false;
    }
  }
}
