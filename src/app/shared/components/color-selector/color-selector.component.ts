import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ColorSelectorComponent implements OnChanges {
  @Input() title: string = '';
  @Input() currentColor: string = '#FFD600';
  @Input() ariaLabel: string = '';

  @Output() colorChanged = new EventEmitter<{ color: string; name: string }>();

  selectedColor: string = '#FFD600';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentColor']) {
      this.selectedColor = this.currentColor;
    }
  }

  onColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newColor = target.value;
    this.selectedColor = newColor;

    // Emitir el evento de cambio
    this.colorChanged.emit({
      color: newColor,
      name: newColor,
    });
  }
}
