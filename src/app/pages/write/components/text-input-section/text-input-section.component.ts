import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput, IonIcon } from '@ionic/angular/standalone';
import { PressHoldButtonComponent } from '../../../../shared/components/press-hold-button/press-hold-button.component';

@Component({
  selector: 'app-text-input-section',
  templateUrl: './text-input-section.component.html',
  styleUrls: ['./text-input-section.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput, IonIcon, PressHoldButtonComponent],
})
export class TextInputSectionComponent {
  @Input() textContent: string = '';
  @Output() textContentChange = new EventEmitter<string>();
  @Output() speakAction = new EventEmitter<string>();
  // Mostrar botón Guardar (opt-in para evitar romper layouts existentes)
  @Input() showSave: boolean = false;
  // Eventos para Guardar
  @Output() saveHoldStart = new EventEmitter<string>();
  @Output() saveAction = new EventEmitter<string>();

  onTextChange(value: string): void {
    this.textContentChange.emit(value);
  }

  onSpeakClick(actionId: string): void {
    this.speakAction.emit(actionId);
  }

  onSaveHold(actionId: string): void {
    this.saveHoldStart.emit(actionId);
  }

  onSaveClick(actionId: string): void {
    this.saveAction.emit(actionId);
  }
}
