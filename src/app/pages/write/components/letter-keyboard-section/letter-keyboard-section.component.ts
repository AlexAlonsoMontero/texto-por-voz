import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PressHoldButtonComponent } from '../../../../shared/components/press-hold-button/press-hold-button.component';

@Component({
  selector: 'app-letter-keyboard-section',
  templateUrl: './letter-keyboard-section.component.html',
  styleUrls: ['./letter-keyboard-section.component.scss'],
  standalone: true,
  imports: [CommonModule, PressHoldButtonComponent],
})
export class LetterKeyboardSectionComponent {
  @Input() letterGroups: string[] = [];
  @Output() letterGroupAction = new EventEmitter<{ actionId: string; group: string }>();

  onLetterGroupClick(actionId: string, group: string): void {
    this.letterGroupAction.emit({ actionId, group });
  }
}
