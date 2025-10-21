import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PressHoldButtonComponent } from '../../../../shared/components/press-hold-button/press-hold-button.component';

/**
 * Componente para mostrar letras individuales en formato grid (panel)
 */
@Component({
  selector: 'app-letter-grid-view',
  templateUrl: './letter-grid-view.component.html',
  styleUrls: ['./letter-grid-view.component.scss'],
  standalone: true,
  imports: [CommonModule, PressHoldButtonComponent],
})
export class LetterGridViewComponent {
  @Input() letters: string[] = [];
  @Output() letterHoldStart = new EventEmitter<string>();
  @Output() letterSelected = new EventEmitter<string>();

  onLetterHoldStart(actionId: string): void {
    this.letterHoldStart.emit(actionId);
  }

  onLetterSelected(actionId: string): void {
    this.letterSelected.emit(actionId);
  }
}
