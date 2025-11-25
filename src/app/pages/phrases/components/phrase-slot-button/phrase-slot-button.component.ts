import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, image } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { PressHoldButtonComponent } from '../../../../shared/components/press-hold-button/press-hold-button.component';
import { PhraseStoreSlot } from '../../../../core/domain/interfaces/phrase-store.interface';

@Component({
  selector: 'app-phrase-slot-button',
  standalone: true,
  imports: [CommonModule, IonIcon, PressHoldButtonComponent],
  templateUrl: './phrase-slot-button.component.html',
  styleUrls: ['./phrase-slot-button.component.scss'],
})
export class PhraseSlotButtonComponent {
  @Input({ required: true }) slot!: PhraseStoreSlot;
  @Output() holdStart = new EventEmitter<void>();
  @Output() action = new EventEmitter<void>();

  constructor() {
    addIcons({ checkmarkCircle, image });
  }

  get hasPhrase(): boolean {
    return !!(this.slot.value && this.slot.value.trim());
  }

  get hasImage(): boolean {
    return !!this.slot.imageUri;
  }

  get imageSrc(): string {
    if (!this.slot.imageUri) return '';
    return Capacitor.convertFileSrc(this.slot.imageUri);
  }

  getButtonColor(): string {
    if (this.hasPhrase) return 'success';
    return this.slot.index % 2 === 0 ? 'primary' : 'secondary';
  }

  getAriaLabel(): string {
    const base = `Botón ${this.slot.index + 1}`;
    if (this.slot.imageUri && this.slot.imageAltText) {
      return `${base}. ${this.slot.imageAltText}`;
    }
    if (this.hasPhrase) {
      return `${base}. Frase asignada`;
    }
    return `${base} vacío`;
  }

  onHoldStart(): void {
    this.holdStart.emit();
  }

  onAction(): void {
    this.action.emit();
  }
}
