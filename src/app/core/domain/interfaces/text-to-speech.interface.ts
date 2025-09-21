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
}

/**
 * Interface para el servicio de Text-to-Speech
 * Sigue el patrón de puerto de arquitectura hexagonal
 */
export interface ITextToSpeechService {
  /**
   * Convierte texto a voz
   * @param text Texto a sintetizar
   * @param options Opciones de configuración de voz
   */
  speak(text: string, options?: SpeechOptions): Promise<void>;

  /**
   * Detiene la síntesis de voz actual
   */
  stop(): Promise<void>;

  /**
   * Verifica si el Text-to-Speech está soportado en la plataforma actual
   */
  isSupported(): boolean;

  /**
   * Verifica si actualmente se está reproduciendo voz
   */
  isSpeaking(): boolean;

  /**
   * Obtiene las voces disponibles en el sistema
   */
  getAvailableVoices(): Promise<SpeechSynthesisVoice[]>;
}
