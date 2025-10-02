import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { THEME_SERVICE, TEXT_TO_SPEECH_SERVICE } from '../../core/infrastructure/injection-tokens';
import { IThemeService, ThemeColors } from '../../core/domain/interfaces/theme.interface';
import { ITextToSpeechService, SpeechPriority } from '../../core/domain/interfaces/text-to-speech.interface';
import { PressHoldButtonComponent } from '../../shared/components/press-hold-button/press-hold-button.component';
import { ColorSelectorComponent } from '../../shared/components/color-selector/color-selector.component';

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
    IonBackButton,
    IonButtons,
    PressHoldButtonComponent,
    ColorSelectorComponent,
  ],
})
export class SettingsPage implements OnInit {

  constructor(
    private readonly navCtrl: NavController,
    @Inject(THEME_SERVICE)
    private readonly themeService: IThemeService,
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly tts: ITextToSpeechService,
  ) {}

  ngOnInit(): void {
    // Anuncio de bienvenida según las instrucciones
    this.tts.speak(
      'Página de configuración de colores activada. Usa los selectores de color para personalizar la aplicación.',
      {
        priority: SpeechPriority.HIGH,
        interrupt: true,
      },
    );
  }

  async goBack(): Promise<void> {
    await this.tts.speak('Volviendo a la página principal', {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });

    this.navCtrl.navigateRoot('/home');
  }

  async onPrimaryColorSelected(event: { color: string; name: string }): Promise<void> {
    const currentTheme = this.themeService.getThemeColors();
    const newTheme: ThemeColors = {
      ...currentTheme,
      primary: event.color,
    };

    this.themeService.setThemeColors(newTheme);

    await this.tts.speak(`Color principal cambiado a ${event.name}`, {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  async onSecondaryColorSelected(event: { color: string; name: string }): Promise<void> {
    const currentTheme = this.themeService.getThemeColors();
    const newTheme: ThemeColors = {
      ...currentTheme,
      secondary: event.color,
    };

    this.themeService.setThemeColors(newTheme);

    await this.tts.speak(`Color secundario cambiado a ${event.name}`, {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  async onBackgroundColorSelected(event: { color: string; name: string }): Promise<void> {
    const currentTheme = this.themeService.getThemeColors();
    const newTheme: ThemeColors = {
      ...currentTheme,
      background: event.color,
    };

    this.themeService.setThemeColors(newTheme);

    await this.tts.speak(`Color de fondo cambiado a ${event.name}`, {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }

  getCurrentPrimaryColor(): string {
    return this.themeService.getThemeColors().primary;
  }

  getCurrentSecondaryColor(): string {
    return this.themeService.getThemeColors().secondary;
  }

  getCurrentBackgroundColor(): string {
    return this.themeService.getThemeColors().background;
  }

  async resetToDefault(): Promise<void> {
    this.themeService.resetToDefault();

    await this.tts.speak('Colores restablecidos a los valores por defecto', {
      priority: SpeechPriority.NORMAL,
      interrupt: true,
    });
  }
}
