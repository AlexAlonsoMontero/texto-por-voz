import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonRange,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import {
  THEME_SERVICE,
  TEXT_TO_SPEECH_SERVICE,
  PHRASE_BUTTON_CONFIG_SERVICE,
  PHRASE_STORE_SERVICE,
} from '../../core/infrastructure/injection-tokens';
import { IThemeService, ThemeColors, ColorType, COLOR_TYPES } from '../../core/domain/interfaces/theme.interface';
import { ITextToSpeechService, SpeechPriority } from '../../core/domain/interfaces/text-to-speech.interface';
import { PressHoldButtonComponent } from '../../shared/components/press-hold-button/press-hold-button.component';
import { PressHoldConfigService } from '../../core/application/services/press-hold-config.service';
import { WriteViewConfigService } from '../../core/infrastructure/services/write-view-config.service';
import { WriteViewMode } from '../../core/domain/interfaces/write-view.interface';
import { CarouselConfigService } from '../../core/infrastructure/services/carousel-config.service';
import {
  IPhraseButtonConfigService,
  ButtonSize,
  AVAILABLE_BUTTON_COUNTS,
  PhraseButtonConfig,
} from '../../core/domain/interfaces/phrase-button-config.interface';
import { IPhraseStoreService } from '../../core/domain/interfaces/phrase-store.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
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

  // 🆕 Configuración de botones de frases
  buttonCount: number = 12;
  buttonSize: ButtonSize = 'medium';
  availableButtonCounts = AVAILABLE_BUTTON_COUNTS;
  buttonSizes: Array<{ value: ButtonSize; label: string }> = [
    { value: 'small', label: 'Pequeño' },
    { value: 'medium', label: 'Mediano' },
    { value: 'large', label: 'Grande' },
    { value: 'xlarge', label: 'Muy Grande' },
  ];
  currentPhraseCount: number = 0; // Número de frases guardadas actualmente

  constructor(
    private readonly navCtrl: NavController,
    @Inject(THEME_SERVICE)
    private readonly themeService: IThemeService,
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly tts: ITextToSpeechService,
    private readonly pressHoldConfig: PressHoldConfigService,
    private readonly writeViewConfig: WriteViewConfigService,
    private readonly carouselConfig: CarouselConfigService,
    @Inject(PHRASE_BUTTON_CONFIG_SERVICE)
    private readonly buttonConfigService: IPhraseButtonConfigService,
    @Inject(PHRASE_STORE_SERVICE)
    private readonly phraseStore: IPhraseStoreService,
  ) {}

  ngOnInit(): void {
    // Cargar duración desde el servicio
    this.pressHoldDuration = this.pressHoldConfig.getDuration();

    // Cargar modo de vista de escritura
    void this.loadWriteViewMode();
    // Cargar delay de carrusel
    void this.loadCarouselDelay();
    // 🆕 Cargar configuración de botones de frases
    void this.loadButtonConfig();

    // Seleccionar el primer tipo de color por defecto
    this.selectedColorType = COLOR_TYPES[0];
    this.selectedColor = this.getCurrentColorForType(this.selectedColorType.key);

    // Anuncio de bienvenida según las instrucciones
    this.tts.speak('Página de configuración activada.', {
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

  /**
   * 🆕 Obtiene el label del tamaño
   */
  getSizeLabel(size: ButtonSize): string {
    const sizeObj = this.buttonSizes.find((s) => s.value === size);
    return sizeObj?.label || 'Mediano';
  }

  /**
   * 🆕 Carga la configuración de botones de frases
   */
  private async loadButtonConfig(): Promise<void> {
    const config = await this.buttonConfigService.getConfig();
    this.buttonCount = config.count;
    this.buttonSize = config.size;

    // Cargar número de frases guardadas
    const phrases = await this.phraseStore.getAll();
    this.currentPhraseCount = phrases.filter((p) => p.value.trim() !== '').length;
  }

  /**
   * 🆕 Aplica la configuración de botones directamente
   */
  async applyButtonConfig(): Promise<void> {
    const oldCount = await this.buttonConfigService.getConfig().then((c) => c.count);
    const newCount = this.buttonCount;

    await this.tts.speak('Aplicando configuración de botones');

    // Si reduce el número de botones y hay frases que se perderían, preguntar
    if (newCount < oldCount && this.currentPhraseCount > newCount) {
      const confirmed = confirm(
        `Tienes ${this.currentPhraseCount} frases guardadas. Al reducir a ${newCount} botones, algunas quedarán ocultas.\n\n¿Deseas ELIMINAR las frases excedentes?\n\nOK = Eliminar excedentes\nCancelar = Mantener ocultas (podrás recuperarlas si aumentas el número de botones)`,
      );

      await this.finalizeButtonConfig(confirmed);
    } else {
      // Aplicar directamente
      await this.finalizeButtonConfig(false);
    }
  }

  /**
   * 🆕 Finaliza la aplicación de configuración
   */
  async finalizeButtonConfig(deleteSurplus: boolean): Promise<void> {
    const config: PhraseButtonConfig = {
      count: this.buttonCount,
      size: this.buttonSize,
    };

    try {
      // Guardar configuración
      await this.buttonConfigService.setConfig(config);

      // Actualizar capacidad del store
      await this.phraseStore.updateCapacity(config.count, deleteSurplus);

      await this.tts.speak('Configuración aplicada correctamente. Recargando aplicación');

      // Recargar para aplicar cambios
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error aplicando configuración:', error);
      await this.tts.speak('Error al aplicar configuración');
    }
  }
}

