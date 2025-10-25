import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { PressHoldButtonComponent } from '../../../../shared/components/press-hold-button/press-hold-button.component';

@Component({
  selector: 'app-action-buttons-section',
  templateUrl: './action-buttons-section.component.html',
  styleUrls: ['./action-buttons-section.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, PressHoldButtonComponent],
})
export class ActionButtonsSectionComponent {
  @Output() spaceAction = new EventEmitter<string>();
  @Output() backspaceAction = new EventEmitter<string>();
  @Output() clearAction = new EventEmitter<string>();

  onSpaceClick(actionId: string): void {
    this.spaceAction.emit(actionId);
  }

  onBackspaceClick(actionId: string): void {
    this.backspaceAction.emit(actionId);
  }

  onClearClick(actionId: string): void {
    this.clearAction.emit(actionId);
  }
}
