import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { IOrientationService, OrientationOptions } from '../../domain/interfaces/orientation.interface';

/**
 * Servicio híbrido de gestión de orientación.
 * Usa ScreenOrientation plugin en móvil y media queries en web.
 * Fuerza orientación landscape siguiendo convenciones de accesibilidad.
 */
@Injectable({
  providedIn: 'root',
})
export class HybridOrientationService implements IOrientationService {
  private readonly isNativePlatform: boolean = Capacitor.isNativePlatform();
  private orientationCallback: ((orientation: 'landscape' | 'portrait') => void) | null = null;
  private readonly mediaQueryList: MediaQueryList | null = null;
  private isMonitoring = false;
  private webOrientationHandler: ((event: MediaQueryListEvent) => void) | null = null;

  constructor() {
    console.log(`Orientation: Inicializando servicio en plataforma: ${this.isNativePlatform ? 'nativa' : 'web'}`);

    if (!this.isNativePlatform && typeof window !== 'undefined') {
      this.mediaQueryList = window.matchMedia('(orientation: landscape)');
      console.log('Orientation: Media Query API disponible:', !!this.mediaQueryList);
    }
  }

  /**
   * Verifica si el dispositivo está en orientación horizontal
   */
  isLandscape(): boolean {
    if (this.isNativePlatform) {
      // En nativo, asumimos landscape por configuración
      return true;
    }

    if (this.mediaQueryList) {
      return this.mediaQueryList.matches;
    }

    // Fallback usando dimensiones de ventana
    return window.innerWidth > window.innerHeight;
  }

  /**
   * Verifica si el dispositivo está en orientación vertical
   */
  isPortrait(): boolean {
    return !this.isLandscape();
  }

  /**
   * Obtiene la orientación actual del dispositivo
   */
  getCurrentOrientation(): 'landscape' | 'portrait' {
    return this.isLandscape() ? 'landscape' : 'portrait';
  }

  /**
   * Inicia el monitoreo de cambios de orientación con opciones de accesibilidad
   */
  startOrientationMonitoring(
    callback: (orientation: 'landscape' | 'portrait') => void,
    options?: OrientationOptions,
  ): void {
    if (this.isMonitoring) {
      console.warn('Orientation: El monitoreo ya está activo');
      return;
    }

    this.orientationCallback = callback;
    this.isMonitoring = true;

    const defaultOptions: OrientationOptions = {
      showAutoAlert: true,
      customMessage: 'Por favor, gira tu dispositivo a horizontal para una mejor experiencia accesible',
      useTtsAnnouncement: true,
      ...options,
    };

    console.log('Orientation: Iniciando monitoreo con opciones:', defaultOptions);

    if (this.isNativePlatform) {
      this.startNativeOrientationMonitoring(defaultOptions);
    } else {
      this.startWebOrientationMonitoring(defaultOptions);
    }

    // Ejecutar callback inicial
    const currentOrientation = this.getCurrentOrientation();
    callback(currentOrientation);
    console.log(`Orientation: Orientación inicial: ${currentOrientation}`);
  }

  /**
   * Detiene el monitoreo de cambios de orientación
   */
  stopOrientationMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    console.log('Orientation: Deteniendo monitoreo');
    this.isMonitoring = false;
    this.orientationCallback = null;

    if (this.mediaQueryList && this.webOrientationHandler && !this.isNativePlatform) {
      this.mediaQueryList.removeEventListener('change', this.webOrientationHandler);
      this.webOrientationHandler = null;
    }
  }

  /**
   * Fuerza la orientación landscape (solo nativo)
   */
  async lockToLandscape(): Promise<void> {
    if (!this.isNativePlatform) {
      console.warn('Orientation: lockToLandscape solo disponible en plataforma nativa');
      return;
    }

    try {
      const { ScreenOrientation } = await import('@capacitor/screen-orientation');
      await ScreenOrientation.lock({ orientation: 'landscape' });
      console.log('Orientation: Orientación bloqueada en landscape');
    } catch (error) {
      console.error('Orientation: Error bloqueando orientación:', error);
      throw new Error(`Error bloqueando orientación: ${error}`);
    }
  }

  /**
   * Libera el bloqueo de orientación (solo nativo)
   */
  async unlockOrientation(): Promise<void> {
    if (!this.isNativePlatform) {
      console.warn('Orientation: unlockOrientation solo disponible en plataforma nativa');
      return;
    }

    try {
      const { ScreenOrientation } = await import('@capacitor/screen-orientation');
      await ScreenOrientation.unlock();
      console.log('Orientation: Orientación desbloqueada');
    } catch (error) {
      console.error('Orientation: Error desbloqueando orientación:', error);
    }
  }

  /**
   * Verifica si el bloqueo de orientación está soportado
   */
  isOrientationLockSupported(): boolean {
    if (this.isNativePlatform) {
      return true; // Asumimos que el plugin está instalado
    }

    // En web, verificar si la Screen Orientation API está disponible
    return typeof screen !== 'undefined' && typeof screen.orientation !== 'undefined';
  }

  /**
   * Monitoreo nativo usando @capacitor/screen-orientation
   */
  private async startNativeOrientationMonitoring(options: OrientationOptions): Promise<void> {
    try {
      const { ScreenOrientation } = await import('@capacitor/screen-orientation');

      // Forzar landscape al iniciar
      await this.lockToLandscape();

      // Escuchar cambios (aunque debería mantenerse en landscape)
      ScreenOrientation.addListener('screenOrientationChange', (result) => {
        console.log('Orientation: Cambio nativo detectado:', result);
        const orientation = result.type.includes('landscape') ? 'landscape' : 'portrait';

        if (this.orientationCallback) {
          this.orientationCallback(orientation);
        }

        // Si cambia a portrait, mostrar alerta y volver a landscape
        if (orientation === 'portrait' && options.showAutoAlert) {
          this.handlePortraitWarning(options);
          this.lockToLandscape(); // Volver a forzar landscape
        }
      });
    } catch (error) {
      console.error('Orientation: Error iniciando monitoreo nativo:', error);
    }
  }

  /**
   * Monitoreo web usando Media Query API
   */
  private startWebOrientationMonitoring(options: OrientationOptions): void {
    if (!this.mediaQueryList) {
      console.error('Orientation: Media Query API no disponible');
      return;
    }

    this.webOrientationHandler = (event: MediaQueryListEvent) => {
      const orientation = event.matches ? 'landscape' : 'portrait';
      console.log(`Orientation: Cambio web detectado: ${orientation}`);

      if (this.orientationCallback) {
        this.orientationCallback(orientation);
      }

      if (orientation === 'portrait' && options.showAutoAlert) {
        this.handlePortraitWarning(options);
      }
    };

    this.mediaQueryList.addEventListener('change', this.webOrientationHandler);

    // También escuchar resize events como backup
    window.addEventListener('resize', () => {
      const orientation = this.getCurrentOrientation();
      if (this.orientationCallback) {
        this.orientationCallback(orientation);
      }

      if (orientation === 'portrait' && options.showAutoAlert) {
        this.handlePortraitWarning(options);
      }
    });
  }

  /**
   * Maneja la advertencia cuando el dispositivo está en portrait
   */
  private handlePortraitWarning(options: OrientationOptions): void {
    const message =
      options.customMessage || 'Por favor, gira tu dispositivo a horizontal para una mejor experiencia accesible';

    console.warn('Orientation: Dispositivo en portrait, mostrando advertencia');

    // Mostrar alerta visual si está habilitada
    if (options.showAutoAlert) {
      // En lugar de alert(), podrías usar un toast de Ionic
      alert(message);
    }

    // Si hay TTS disponible, usar para anuncio accesible
    if (options.useTtsAnnouncement) {
      // Aquí podrías inyectar el TTS service para anunciar el mensaje
      console.log('Orientation: Mensaje TTS:', message);
    }
  }
}
