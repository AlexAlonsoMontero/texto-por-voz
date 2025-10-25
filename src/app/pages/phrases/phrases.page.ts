import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import { PressHoldButtonComponent } from '../../shared/components/press-hold-button/press-hold-button.component';
import { TextInputSectionComponent } from '../write/components/text-input-section/text-input-section.component';
import { PHRASE_STORE_SERVICE, TEXT_TO_SPEECH_SERVICE } from '../../core/infrastructure/injection-tokens';
import { IPhraseStoreService, PhraseStoreSlot } from '../../core/domain/interfaces/phrase-store.interface';
import { ITextToSpeechService } from '../../core/domain/interfaces/text-to-speech.interface';

@Component({
  selector: 'app-phrases',
  standalone: true,
  templateUrl: './phrases.page.html',
  styleUrls: ['./phrases.page.scss'],
  imports: [CommonModule, IonContent, IonModal, PressHoldButtonComponent, TextInputSectionComponent],
})
export class PhrasesPage implements OnInit {
  slots: PhraseStoreSlot[] = [];
  showSaveModal = false;
  confirmOverwriteIndex: number | null = null;
  currentText = signal<string>('');

  constructor(
    @Inject(PHRASE_STORE_SERVICE) private readonly store: IPhraseStoreService,
    @Inject(TEXT_TO_SPEECH_SERVICE) private readonly tts: ITextToSpeechService,
  ) {}

  ngOnInit(): void {
    void this.store.getAll().then((all) => (this.slots = all));
    this.store.observeAll().subscribe((s) => (this.slots = s));
  }

  // TextInputSection -> emisión del texto actual
  onTextChange(text: string) {
    this.currentText.set(text);
  }

  // Abrir modal de selección (tras press-hold en Guardar)
  onSaveHoldStart() {
    void this.tts.speak('Guardar frase');
  }
  onSaveAction() {
    this.showSaveModal = true;
  }
  onCloseModalHoldStart() {
    void this.tts.speak('Cerrar');
  }
  onCloseModalAction() {
    this.showSaveModal = false;
    this.confirmOverwriteIndex = null;
  }

  // Acciones de slots en la página (reproducir / vacío)
  onSlotHoldStart(i: number) {
    const slot = this.slots[i];
    const hasContent = slot?.value?.trim();
    if (hasContent) {
      void this.tts.speak(slot.value);
    } else {
      void this.tts.speak(`${i + 1}`);
    }
  }
  onSlotAction(i: number) {
    const slot = this.slots[i];
    if (slot?.value === '' || !slot) return void this.tts.speak(`El botón ${i + 1} no tiene frase asignada`);
    void this.tts.speak(slot.value);
  }

  // Borrar slot (botón rojo bajo cada slot ocupado)
  onDeleteSlotHoldStart(i: number) {
    void this.tts.speak(`Eliminar frase del botón ${i + 1}`);
  }
  async onDeleteSlotAction(i: number) {
    await this.store.removeAt(i);
    await this.tts.speak('Frase eliminada');
  }

  // Modal: seleccionar slot para guardar
  onPickSlotHoldStart(i: number) {
    const slot = this.slots[i];
    if (slot?.value === '' || !slot) {
      void this.tts.speak(`Guardar en botón ${i + 1}`);
    } else {
      void this.tts.speak(`Se reemplazará la frase del botón ${i + 1}. Mantenga pulsado de nuevo para confirmar`);
    }
  }

  async onPickSlotAction(i: number) {
    const text = this.currentText();
    const norm = this.store.normalize(text);
    if (!norm) {
      return void this.tts.speak('No hay texto para guardar');
    }
    const dup = await this.store.findDuplicateIndex(norm);
    if (dup >= 0 && dup !== i) {
      return void this.tts.speak(`La frase ya existe en el botón ${dup + 1}`);
    }

    const slot = this.slots[i];
    if (slot?.value) {
      if (this.confirmOverwriteIndex === i) {
        const res = await this.store.saveAt(i, norm, { overwrite: true });
        if (res.ok) {
          await this.tts.speak(`Frase reemplazada en el botón ${i + 1}`);
          this.showSaveModal = false;
          this.confirmOverwriteIndex = null;
        }
      } else {
        this.confirmOverwriteIndex = i;
      }
    } else {
      const res = await this.store.saveAt(i, norm, { overwrite: true });
      if (res.ok) {
        await this.tts.speak(`Frase guardada en el botón ${i + 1}`);
        this.showSaveModal = false;
        this.confirmOverwriteIndex = null;
      }
    }
  }
}
