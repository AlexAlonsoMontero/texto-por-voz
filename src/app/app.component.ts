import { Component, Inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonSplitPane, IonMenu } from '@ionic/angular/standalone';
import { SidebarNavigationComponent } from './shared/components/sidebar-navigation/sidebar-navigation.component';
import {
  SAFE_AREA_SERVICE,
  TEXT_TO_SPEECH_SERVICE,
  THEME_SERVICE,
  PHRASE_STORE_SERVICE,
} from './core/infrastructure/injection-tokens';
import { WriteViewConfigService } from './core/infrastructure/services/write-view-config.service';
import { PressHoldConfigService } from './core/application/services/press-hold-config.service';
import { ISafeAreaService } from './core/domain/interfaces/safe-area.interface';
import { ITextToSpeechService, SpeechPriority } from './core/domain/interfaces/text-to-speech.interface';
import { IThemeService } from './core/domain/interfaces/theme.interface';
import { IPhraseStoreService } from './core/domain/interfaces/phrase-store.interface';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonSplitPane, IonMenu, SidebarNavigationComponent],
})
export class AppComponent implements OnInit, ViewDidEnter {
  constructor(
    @Inject(SAFE_AREA_SERVICE)
    private readonly safeAreaService: ISafeAreaService,
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly ttsService: ITextToSpeechService,
    @Inject(THEME_SERVICE)
    private readonly themeService: IThemeService,
    @Inject(PHRASE_STORE_SERVICE)
    private readonly phraseStore: IPhraseStoreService,
    private readonly writeViewConfig: WriteViewConfigService,
    private readonly pressHoldConfig: PressHoldConfigService,
  ) {}

  ngOnInit(): void {
    // Inicialización asíncrona sin bloquear el lifecycle de Angular
    this.initializeAppAsync();
  }

  ionViewDidEnter(): void {
    // El DOM de Ionic está completamente renderizado
    this.debugSplitPaneLayout();
  }

  /**
   * Inicialización asíncrona de la aplicación con manejo de errores robusto
   */
  private async initializeAppAsync(): Promise<void> {
    try {
      // 1. Cargar configuración de press-hold buttons
      this.pressHoldConfig.getDuration();

      // 2. Inicializar tema por defecto
      this.initializeTheme();

      // 3. Pre-cargar modo de vista de escritura para evitar flickers y asegurar persistencia
      await this.warmupWriteViewConfig();

      // 4. Pre-cargar frases guardadas para hidratar BehaviorSubject y asegurar persistencia
      await this.warmupPhraseStore();

      // 5. Inicializar TTS Service globalmente
      await this.initializeTTSService();

      // 6. Aplicar safe areas
      await this.applySafeAreaMargins();

      // 7. Mensaje de bienvenida accesible
      await this.announceAppReady();
    } catch (error) {
      console.error('❌ Error crítico en AppComponent:', error);
      this.handleCriticalAppError(error);
    }
  }

  /**
   * Precarga el modo de vista de escritura desde storage para hidratar el BehaviorSubject
   */
  private async warmupWriteViewConfig(): Promise<void> {
    try {
      await this.writeViewConfig.getViewMode();
    } catch {}
  }

  /**
   * Precarga las frases guardadas desde storage para hidratar el BehaviorSubject
   */
  private async warmupPhraseStore(): Promise<void> {
    try {
      await this.phraseStore.getAll();
    } catch {}
  }

  /**
   * Inicializa el tema por defecto al arrancar la aplicación
   */
  private initializeTheme(): void {
    // Cargar y aplicar tema persistido antes de anunciar la app
    // Nota: initialize() puede aplicar el tema restaurado internamente
    void this.themeService
      .initialize()
      .then(() => {
        const currentTheme = this.themeService.getThemeColors();
        this.themeService.applyTheme(currentTheme);
      })
      .catch((error) => console.error('❌ Error inicializando tema:', error));
  }

  /**
   * Inicializa el servicio TTS globalmente una sola vez
   */
  private async initializeTTSService(): Promise<void> {
    try {
      await this.ttsService.initialize();
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

  /**
   * Maneja errores críticos de inicialización de la aplicación
   */
  private handleCriticalAppError(error: any): void {
    console.error('❌ Error crítico en inicialización de la app:', error);

    // Fallback para aplicaciones de accesibilidad crítica
    setTimeout(async () => {
      try {
        if (this.ttsService?.isReady()) {
          await this.ttsService.speak(
            'Error crítico al inicializar la aplicación. Algunas funciones pueden no estar disponibles. Reinicia la aplicación si persiste el problema.',
            { priority: SpeechPriority.EMERGENCY, interrupt: true },
          );
        }
      } catch (ttsError) {
        console.error('❌ Error crítico total: TTS no disponible', { originalError: error, ttsError });
      }
    }, 2000); // Delay para asegurar que el TTS tenga oportunidad de inicializarse
  }

  private debugSplitPaneLayout(): void {
    const splitPane = document.querySelector('ion-split-pane') as HTMLElement;
    if (splitPane) {
      console.log('Split Pane encontrado:', splitPane);
    }
  }
}
