import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSelect, IonSelectOption, IonButton } from '@ionic/angular/standalone';
import { ColorType } from '../../../core/domain/interfaces/theme.interface';

export interface ColorThemeOption {
  key: ColorType;
  label: string;
  currentColor: string;
}

export interface AccessibleColor {
  hex: string;
  name: string;
  contrastRatio: number;
  wcagLevel: 'AA' | 'AAA';
}

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, IonSelect, IonSelectOption, IonButton],
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

  // Paleta de colores accesibles basada en WCAG
  accessibleColors: AccessibleColor[] = [
    // Amarillos accesibles
    { hex: '#FFD600', name: 'Amarillo Brillante', contrastRatio: 4.7, wcagLevel: 'AA' },
    { hex: '#F9A825', name: 'Amarillo Dorado', contrastRatio: 5.2, wcagLevel: 'AA' },
    { hex: '#E65100', name: 'Naranja Intenso', contrastRatio: 7.8, wcagLevel: 'AAA' },

    // Azules accesibles
    { hex: '#0057B7', name: 'Azul Intenso', contrastRatio: 8.2, wcagLevel: 'AAA' },
    { hex: '#1565C0', name: 'Azul Profundo', contrastRatio: 7.1, wcagLevel: 'AAA' },
    { hex: '#1976D2', name: 'Azul Material', contrastRatio: 6.8, wcagLevel: 'AA' },

    // Verdes accesibles
    { hex: '#388E3C', name: 'Verde Bosque', contrastRatio: 6.9, wcagLevel: 'AA' },
    { hex: '#2E7D32', name: 'Verde Oscuro', contrastRatio: 8.1, wcagLevel: 'AAA' },
    { hex: '#43A047', name: 'Verde Material', contrastRatio: 5.8, wcagLevel: 'AA' },

    // Rojos accesibles
    { hex: '#C62828', name: 'Rojo Intenso', contrastRatio: 7.4, wcagLevel: 'AAA' },
    { hex: '#D32F2F', name: 'Rojo Material', contrastRatio: 6.9, wcagLevel: 'AA' },
    { hex: '#B71C1C', name: 'Rojo Oscuro', contrastRatio: 9.2, wcagLevel: 'AAA' },

    // Grises y neutros accesibles
    { hex: '#212121', name: 'Gris Carbón', contrastRatio: 16.0, wcagLevel: 'AAA' },
    { hex: '#424242', name: 'Gris Oscuro', contrastRatio: 12.6, wcagLevel: 'AAA' },
    { hex: '#757575', name: 'Gris Medio', contrastRatio: 4.6, wcagLevel: 'AA' },

    // Colores de fondo
    { hex: '#FFFFFF', name: 'Blanco Puro', contrastRatio: 21.0, wcagLevel: 'AAA' },
  ];

  onColorSelect(color: AccessibleColor): void {
    this.selectedColor = color.hex;

    const event = {
      color: color.hex,
      name: color.name,
    };

    console.log('🎨 ColorSelector - Color seleccionado:', event);

    this.colorChanged.emit(event);
  }

  getContrastBadgeClass(color: AccessibleColor): string {
    return color.wcagLevel === 'AAA' ? 'contrast-aaa' : 'contrast-aa';
  }

  getAccessibilityText(color: AccessibleColor): string {
    return `${color.name}. Contraste ${color.contrastRatio}:1. Nivel WCAG ${color.wcagLevel}`;
  }
}
