import { Component, Inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonSplitPane, IonMenu } from '@ionic/angular/standalone';
import { SidebarNavigationComponent } from './shared/components/sidebar-navigation/sidebar-navigation.component';
import { SAFE_AREA_SERVICE, TEXT_TO_SPEECH_SERVICE } from './core/infrastructure/injection-tokens';
import { ISafeAreaService } from './core/domain/interfaces/safe-area.interface';
import { ITextToSpeechService, SpeechPriority } from './core/domain/interfaces/text-to-speech.interface';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonSplitPane, IonMenu, SidebarNavigationComponent],
})
export class AppComponent implements ViewDidEnter {
  constructor(
    @Inject(SAFE_AREA_SERVICE)
    private readonly safeAreaService: ISafeAreaService,
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly ttsService: ITextToSpeechService,
  ) {}

  async ngOnInit(): Promise<void> {
    // 1. Inicializar TTS Service globalmente
    await this.initializeTTSService();

    // 2. Aplicar safe areas
    await this.applySafeAreaMargins();

    // 3. Mensaje de bienvenida accesible
    await this.announceAppReady();
  }

  ionViewDidEnter(): void {
    // El DOM de Ionic está completamente renderizado
    this.debugSplitPaneLayout();
  }

  /**
   * Inicializa el servicio TTS globalmente una sola vez
   */
  private async initializeTTSService(): Promise<void> {
    try {
      await this.ttsService.initialize();
      console.log('✅ TTS Service inicializado globalmente en AppComponent');
    } catch (error) {
      console.error('❌ Error inicializando TTS Service:', error);
    }
  }

  /**
   * Anuncia que la aplicación está lista para usar
   */
  private async announceAppReady(): Promise<void> {
    try {
      await this.ttsService.speak(
        'Aplicación de texto por voz accesible activada. Navegación horizontal disponible. Utiliza las teclas Tab para navegar entre opciones y Enter para seleccionar.',
        { priority: SpeechPriority.HIGH },
      );
    } catch (error) {
      console.error('❌ Error en mensaje de bienvenida:', error);
    }
  }

  /**
   * Aplica márgenes automáticamente basados en las barras del sistema detectadas
   */
  private async applySafeAreaMargins(): Promise<void> {
    try {
      const insets = await this.safeAreaService.getSafeAreaInsets();
      const availableHeight = await this.safeAreaService.getAvailableHeight();
      const availableWidth = await this.safeAreaService.getAvailableWidth();

      // Crear variables CSS dinámicas para toda la aplicación
      const root = document.documentElement;

      // Variables de insets
      root.style.setProperty('--safe-area-top', `${insets.top}px`);
      root.style.setProperty('--safe-area-bottom', `${insets.bottom}px`);
      root.style.setProperty('--safe-area-left', `${insets.left}px`);
      root.style.setProperty('--safe-area-right', `${insets.right}px`);

      // Variables de dimensiones disponibles
      root.style.setProperty('--available-height', `${availableHeight}px`);
      root.style.setProperty('--available-width', `${availableWidth}px`);

      // Variables calculadas para layout
      root.style.setProperty('--content-height', `calc(100vh - ${insets.top}px - ${insets.bottom}px)`);
      root.style.setProperty('--content-width', `calc(100vw - ${insets.left}px - ${insets.right}px)`);
    } catch (error) {
      console.error('❌ Error aplicando Safe Area margins:', error);
    }
  }

  private debugSplitPaneLayout(): void {
    const splitPane = document.querySelector('ion-split-pane') as HTMLElement;
    if (splitPane) {
      console.log('Split Pane encontrado:', splitPane);
    }
  }
}
