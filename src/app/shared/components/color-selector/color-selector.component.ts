import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { THEME_SERVICE } from '../../../core/infrastructure/injection-tokens';
import { IThemeService, ColorOption } from '../../../core/domain/interfaces/theme.interface';

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
  predefinedColors: ColorOption[] = [];
  showCustomInput: boolean = false;

  constructor(
    @Inject(THEME_SERVICE)
    private readonly themeService: IThemeService,
  ) {
    this.predefinedColors = this.themeService.getPredefinedColors();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentColor']) {
      this.selectedColor = this.currentColor;
    }
  }

  /**
   * Selecciona un color de la paleta predefinida
   */
  onPredefinedColorSelected(colorOption: ColorOption): void {
    this.selectedColor = colorOption.value;
    this.colorChanged.emit({
      color: colorOption.value,
      name: colorOption.name,
    });
  }

  /**
   * Maneja cambios en el input de color personalizado
   */
  onCustomColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newColor = target.value;
    this.selectedColor = newColor;

    this.colorChanged.emit({
      color: newColor,
      name: `Color personalizado ${newColor}`,
    });
  }

  /**
   * Alterna la visibilidad del selector de color personalizado
   */
  toggleCustomInput(): void {
    this.showCustomInput = !this.showCustomInput;
  }

  /**
   * Verifica si un color está seleccionado actualmente
   */
  isSelectedColor(color: string): boolean {
    return this.selectedColor === color;
  }

  /**
   * Maneja la navegación por teclado en los botones de color
   */
  onColorKeyDown(event: KeyboardEvent, colorOption: ColorOption): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onPredefinedColorSelected(colorOption);
    }
  }

  /**
   * TrackBy function para optimizar el renderizado del *ngFor
   */
  trackByColorValue(index: number, colorOption: ColorOption): string {
    return colorOption.value;
  }
}
