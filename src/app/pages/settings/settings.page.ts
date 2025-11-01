import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonRange,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { THEME_SERVICE, TEXT_TO_SPEECH_SERVICE } from '../../core/infrastructure/injection-tokens';
import { IThemeService, ThemeColors, ColorType, COLOR_TYPES } from '../../core/domain/interfaces/theme.interface';
import { ITextToSpeechService, SpeechPriority } from '../../core/domain/interfaces/text-to-speech.interface';
import { PressHoldButtonComponent } from '../../shared/components/press-hold-button/press-hold-button.component';
import { PressHoldConfigService } from '../../core/application/services/press-hold-config.service';
import { WriteViewConfigService } from '../../core/infrastructure/services/write-view-config.service';
import { WriteViewMode } from '../../core/domain/interfaces/write-view.interface';
import { CarouselConfigService } from '../../core/infrastructure/services/carousel-config.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonRange,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
    PressHoldButtonComponent,
  ],
})
export class SettingsPage implements OnInit {
  colorTypes = COLOR_TYPES;
  selectedColorType: ColorType | null = null;
  selectedColor: string = '#FFD600';
  predefinedColors = this.themeService.getPredefinedColors();
  showCustomInput: boolean = false;

  // Duración de presión de botones (en milisegundos)
  pressHoldDuration: number = 2000; // Por defecto 2 segundos
  holdDuration$ = this.pressHoldConfig.duration$;

  // Modo de vista de escritura
  writeViewMode: WriteViewMode = 'panel';
  // Delay de carrusel (ms)
  carouselDelayMs: number = 1000;

  constructor(
    private readonly navCtrl: NavController,
    @Inject(THEME_SERVICE)
    private readonly themeService: IThemeService,
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly tts: ITextToSpeechService,
    private readonly pressHoldConfig: PressHoldConfigService,
    private readonly writeViewConfig: WriteViewConfigService,
    private readonly carouselConfig: CarouselConfigService,
  ) {}

  ngOnInit(): void {
    // Cargar duración desde el servicio
    this.pressHoldDuration = this.pressHoldConfig.getDuration();

    // Cargar modo de vista de escritura
    void this.loadWriteViewMode();
    // Cargar delay de carrusel
    void this.loadCarouselDelay();

    // Seleccionar el primer tipo de color por defecto
    this.selectedColorType = COLOR_TYPES[0];
    this.selectedColor = this.getCurrentColorForType(this.selectedColorType.key);

    // Anuncio de bienvenida según las instrucciones
    this.tts.speak('Página de configuración de colores activada. Selecciona qué tipo de color quieres modificar.', {
      priority: SpeechPriority.HIGH,
      interrupt: true,
    });
  }

  /**
   * Carga el modo de vista de escritura actual
   */
  private async loadWriteViewMode(): Promise<void> {
    this.writeViewMode = await this.writeViewConfig.getViewMode();
  }

  /**
   * Carga el delay de carrusel actual
   */
  private async loadCarouselDelay(): Promise<void> {
    this.carouselDelayMs = await this.carouselConfig.getDelayMs();
  }

  async goBack(): Promise<void> {
    await this.tts.speak('Volviendo a la página principal', {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });

    this.navCtrl.navigateRoot('/home');
  }

  /**
   * Maneja la acción del botón de volver (press-hold)
   */
  async onBackAction(actionId: string): Promise<void> {
    console.log(`🔙 [Settings] Acción de volver ejecutada: ${actionId}`);
    await this.goBack();
  }

  /**
   * Selecciona qué tipo de color modificar
   */
  async selectColorType(colorType: ColorType): Promise<void> {
    this.selectedColorType = colorType;
    this.selectedColor = this.getCurrentColorForType(colorType.key);

    await this.tts.speak(`Seleccionado ${colorType.name}. ${colorType.description}`, {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  /**
   * Obtiene el color actual para un tipo específico
   */
  getCurrentColorForType(colorType: keyof ThemeColors): string {
    const theme = this.themeService.getThemeColors();
    return theme[colorType];
  }

  /**
   * Maneja la selección de un nuevo color
   */
  async onColorSelected(event: { color: string; name: string }): Promise<void> {
    if (!this.selectedColorType) return;

    this.selectedColor = event.color;

    const currentTheme = this.themeService.getThemeColors();
    const newTheme: ThemeColors = {
      ...currentTheme,
      [this.selectedColorType.key]: event.color,
    };

    this.themeService.setThemeColors(newTheme);

    await this.tts.speak(`${this.selectedColorType.name} cambiado a ${event.name}`, {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  /**
   * Maneja la navegación por teclado en los botones de tipo de color
   */
  onColorTypeKeyDown(event: KeyboardEvent, colorType: ColorType): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectColorType(colorType);
    }
  }

  /**
   * TrackBy function para optimizar el renderizado
   */
  trackByColorType(index: number, colorType: ColorType): string {
    return colorType.key;
  }

  /**
   * TrackBy function para la paleta de colores
   */
  trackByColorOption(index: number, colorOption: any): string {
    return colorOption.value;
  }

  /**
   * Verifica si un color está seleccionado actualmente
   */
  isSelectedColor(color: string): boolean {
    if (!this.selectedColorType) return false;
    return this.getCurrentColorForType(this.selectedColorType.key) === color;
  }

  /**
   * Maneja la navegación por teclado en los botones de color
   */
  onColorKeyDown(event: KeyboardEvent, colorOption: any): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onColorSelected({ color: colorOption.value, name: colorOption.name });
    }
  }

  /**
   * Alterna la visibilidad del selector de color personalizado
   */
  toggleCustomInput(): void {
    this.showCustomInput = !this.showCustomInput;
  }

  /**
   * Maneja cambios en el input de color personalizado
   */
  async onCustomColorChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const newColor = target.value;

    await this.onColorSelected({
      color: newColor,
      name: `Color personalizado ${newColor}`,
    });
  }

  /**
   * Maneja el cambio del slider de duración
   */
  async onDurationChange(event: any): Promise<void> {
    const seconds = event.detail.value;
    this.pressHoldDuration = seconds * 1000; // Convertir a milisegundos
    this.pressHoldConfig.setDuration(this.pressHoldDuration);

    await this.tts.speak(`Duración establecida a ${seconds} segundo${seconds === 1 ? '' : 's'}`, {
      priority: SpeechPriority.NORMAL,
      interrupt: false,
    });
  }

  /**
   * Establece una duración rápida predefinida
   */
  async setQuickDuration(durationMs: number): Promise<void> {
    this.pressHoldDuration = durationMs;
    this.pressHoldConfig.setDuration(durationMs);

    const seconds = durationMs / 1000;
    await this.tts.speak(`Duración establecida a ${seconds} segundo${seconds === 1 ? '' : 's'}`, {
      priority: SpeechPriority.NORMAL,
      interrupt: false,
    });
  }

  async resetToDefault(): Promise<void> {
    this.themeService.resetToDefault();

    await this.tts.speak('Colores restablecidos a los valores por defecto', {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  /**
   * Maneja el cambio del modo de vista de escritura
   */
  async onWriteViewChange(event: any): Promise<void> {
    const newMode: WriteViewMode = event.detail.value;
    this.writeViewMode = newMode;
    await this.writeViewConfig.setViewMode(newMode);

    const modeName = newMode === 'panel' ? 'Panel (Rejilla)' : 'Carrusel (Deslizar)';
    await this.tts.speak(`Vista de escritura cambiada a ${modeName}`, {
      priority: SpeechPriority.NORMAL,
      interrupt: false,
    });
  }

  /**
   * Maneja el cambio del tiempo de transición del carrusel
   */
  async onCarouselDelayChange(event: any): Promise<void> {
    const seconds = event.detail.value as number; // valor en segundos
    const ms = Math.max(0.5, seconds) * 1000; // mínimo 0.5s
    this.carouselDelayMs = ms;
    await this.carouselConfig.setDelayMs(ms);

    await this.tts.speak(`Transición del carrusel establecida a ${seconds} segundo${seconds === 1 ? '' : 's'}`, {
      priority: SpeechPriority.NORMAL,
      interrupt: false,
    });
  }
}
