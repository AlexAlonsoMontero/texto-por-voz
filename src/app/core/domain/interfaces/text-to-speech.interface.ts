/**
 * Opciones para configurar la síntesis de voz
 */
export interface SpeechOptions {
  /** Velocidad de habla (0.1 - 2.0) */
  rate?: number;
  /** Tono de voz (0.0 - 2.0) */
  pitch?: number;
  /** Volumen (0.0 - 1.0) */
  volume?: number;
  /** Idioma ('es-ES', 'en-US', etc.) */
  lang?: string;
  /** Categoría de audio para iOS (ambient, playback, etc.) */
  category?: string;
  /** Si interrumpir síntesis anterior (default: true) */
  interrupt?: boolean;
  /** Prioridad del mensaje */
  priority?: SpeechPriority;
}

/**
 * Niveles de prioridad para síntesis de voz
 */
export enum SpeechPriority {
  /** Baja prioridad - se puede interrumpir */
  LOW = 'low',
  /** Prioridad normal - comportamiento estándar */
  NORMAL = 'normal',
  /** Alta prioridad - siempre interrumpe */
  HIGH = 'high',
  /** Emergencia - interrumpe todo y tiene máxima prioridad */
  EMERGENCY = 'emergency',
}

/**
 * Estados posibles del servicio TTS
 */
export enum TTSStatus {
  UNINITIALIZED = 'uninitialized',
  INITIALIZING = 'initializing',
  READY = 'ready',
  SPEAKING = 'speaking',
  PAUSED = 'paused',
  ERROR = 'error',
}

/**
 * Interface para el servicio de Text-to-Speech
 * Sigue el patrón de puerto de arquitectura hexagonal
 */
export interface ITextToSpeechService {
  /**
   * Inicializa el servicio TTS una sola vez al arranque de la aplicación
   */
  initialize(): Promise<void>;

  /**
   * Convierte texto a voz
   * @param text Texto a sintetizar
   * @param options Opciones de configuración de voz
   */
  speak(text: string, options?: SpeechOptions): Promise<void>;

  /**
   * Detiene la síntesis de voz actual
   */
  stop(): void;

  /**
   * Pausa la síntesis actual (si es soportado por la plataforma)
   */
  pause(): void;

  /**
   * Reanuda la síntesis pausada (si es soportado por la plataforma)
   */
  resume(): void;

  /**
   * Verifica si el Text-to-Speech está soportado en la plataforma actual
   */
  isSupported(): boolean;

  /**
   * Verifica si el servicio ha sido inicializado correctamente
   */
  isReady(): boolean;

  /**
   * Verifica si actualmente se está reproduciendo voz
   */
  isSpeaking(): boolean;

  /**
   * Obtiene las voces disponibles en el sistema
   */
  getAvailableVoices(): Promise<SpeechSynthesisVoice[]>;

  /**
   * Obtiene el estado actual del servicio TTS
   */
  getStatus(): TTSStatus;
}
