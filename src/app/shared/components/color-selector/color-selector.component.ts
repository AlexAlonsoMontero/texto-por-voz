import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton]
})
export class ColorSelectorComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentColor: string = '#FFD600';
  @Input() ariaLabel: string = '';
  @Output() colorChanged = new EventEmitter<{ color: string; name: string }>();

  selectedColor: string = this.currentColor;

  ngOnInit(): void {
    this.selectedColor = this.currentColor;
  }

  onColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedColor = input.value;
  }

  onApplyColor(): void {
    const colorName = this.getColorName(this.selectedColor);
    this.colorChanged.emit({ 
      color: this.selectedColor, 
      name: colorName 
    });
  }

  getColorName(hex: string): string {
    // Convertir hex a nombre descriptivo
    const colorMap: { [key: string]: string } = {
      '#ffd600': 'amarillo',
      '#0057b7': 'azul',
      '#43a047': 'verde',
      '#d32f2f': 'rojo',
      '#6c757d': 'gris',
      '#ffffff': 'blanco',
      '#f5f5f5': 'gris claro',
      '#222222': 'negro',
      '#ff8c00': 'naranja',
      '#800080': 'morado'
    };

    return colorMap[hex.toLowerCase()] || `color personalizado ${hex}`;
  }

  getAccessibilityText(): string {
    const colorName = this.getColorName(this.selectedColor);
    return `${this.title}. Color actual: ${colorName}. Selecciona un nuevo color y pulsa aplicar.`;
  }
}