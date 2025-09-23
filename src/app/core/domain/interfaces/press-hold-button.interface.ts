export interface IPressHoldButtonService {
  startPressTimer(buttonId: string, duration: number): void;
  cancelPressTimer(buttonId: string): void;
  isPressing(buttonId: string): boolean;
  getProgress(buttonId: string): number;
  setGlobalConfig(config: Partial<PressHoldConfig>): void;
  getGlobalConfig(): PressHoldConfig;
}

export type IonicColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'medium'
  | 'dark'
  | string; // Para colores personalizados

export interface PressHoldConfig {
  holdDuration: number; // Tiempo en ms que debe mantenerse presionado
  showProgress: boolean; // Mostrar barra de progreso visual
  announceProgress: boolean; // Anunciar progreso por TTS cada segundo
  enableHapticFeedback: boolean; // Vibración en dispositivos móviles
  progressAnnounceInterval: number; // Cada cuántos ms anunciar progreso
  color: IonicColor; // Color del botón siguiendo estándar Ionic
  progressColor?: IonicColor; // Color de la barra de progreso (opcional)
  size: 'small' | 'default' | 'large'; // Tamaño del botón
}

export interface PressHoldState {
  isPressed: boolean;
  startTime: number;
  progress: number; // 0-100
  timerId?: any;
  config: PressHoldConfig;
}

export enum PressHoldEventType {
  PRESS_START = 'press_start',
  PROGRESS_UPDATE = 'progress_update',
  PRESS_COMPLETE = 'press_complete',
  PRESS_CANCELLED = 'press_cancelled',
}

export interface PressHoldEvent {
  type: PressHoldEventType;
  buttonId: string;
  progress: number;
  duration: number;
  color: IonicColor;
}

// Configuración por defecto siguiendo las instrucciones de accesibilidad
export const DEFAULT_PRESS_HOLD_CONFIG: PressHoldConfig = {
  holdDuration: 3000, // 3 segundos por defecto
  showProgress: true,
  announceProgress: false, // Sin anuncios TTS por defecto
  enableHapticFeedback: true,
  progressAnnounceInterval: 0, // Deshabilitado
  color: 'warning', // Amarillo (#FFD600) por accesibilidad
  progressColor: 'primary', // Azul para contraste
  size: 'large', // Botones grandes para accesibilidad
};
