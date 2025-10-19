import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { TEXT_TO_SPEECH_SERVICE } from '../../core/infrastructure/injection-tokens';
import { ITextToSpeechService, SpeechPriority } from '../../core/domain/interfaces/text-to-speech.interface';
import { PressHoldButtonComponent } from '../../shared/components/press-hold-button/press-hold-button.component';

@Component({
  selector: 'app-write',
  templateUrl: './write.page.html',
  styleUrls: ['./write.page.scss'],
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, PressHoldButtonComponent],
})
export class WritePage implements OnInit {
  constructor(
    private readonly navCtrl: NavController,
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly tts: ITextToSpeechService,
  ) {}

  ngOnInit(): void {
    // Anuncio de bienvenida
    this.tts.speak('Página de escritura activada.', {
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
}
