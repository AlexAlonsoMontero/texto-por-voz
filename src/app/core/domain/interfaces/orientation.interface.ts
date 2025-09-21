/**
 * Opciones de configuración para el servicio de orientación
 */
export interface OrientationOptions {
  /** Mostrar alerta automática cuando esté en vertical */
  showAutoAlert?: boolean;
  /** Texto personalizado para el mensaje de orientación */
  customMessage?: string;
  /** Usar TTS para anunciar cambios de orientación */
  useTtsAnnouncement?: boolean;
}

/**
 * Interface para el servicio de gestión de orientación
 * Sigue el patrón de puerto de arquitectura hexagonal
 */
export interface IOrientationService {
  /**
   * Verifica si el dispositivo está en orientación horizontal (landscape)
   */
  isLandscape(): boolean;

  /**
   * Verifica si el dispositivo está en orientación vertical (portrait)
   */
  isPortrait(): boolean;

  /**
   * Obtiene la orientación actual del dispositivo
   */
  getCurrentOrientation(): 'landscape' | 'portrait';

  /**
   * Inicia el monitoreo de cambios de orientación
   * @param callback Función que se ejecuta cuando cambia la orientación
   * @param options Opciones de configuración
   */
  startOrientationMonitoring(
    callback: (orientation: 'landscape' | 'portrait') => void,
    options?: OrientationOptions,
  ): void;

  /**
   * Detiene el monitoreo de cambios de orientación
   */
  stopOrientationMonitoring(): void;

  /**
   * Fuerza la orientación landscape (solo nativo)
   */
  lockToLandscape(): Promise<void>;

  /**
   * Libera el bloqueo de orientación (solo nativo)
   */
  unlockOrientation(): Promise<void>;

  /**
   * Verifica si la orientación landscape está disponible
   */
  isOrientationLockSupported(): boolean;
}
