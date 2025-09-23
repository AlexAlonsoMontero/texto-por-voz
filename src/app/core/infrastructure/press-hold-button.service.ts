import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  DEFAULT_PRESS_HOLD_CONFIG,
  IPressHoldButtonService,
  PressHoldConfig,
  PressHoldEvent,
  PressHoldEventType,
  PressHoldState,
} from '../domain/interfaces/press-hold-button.interface';

@Injectable({
  providedIn: 'root',
})
export class PressHoldButtonService implements IPressHoldButtonService {
  private readonly buttonStates = new Map<string, PressHoldState>();
  private readonly isNativePlatform = Capacitor.isNativePlatform();
  private globalConfig: PressHoldConfig = { ...DEFAULT_PRESS_HOLD_CONFIG };

  setGlobalConfig(config: Partial<PressHoldConfig>): void {
    this.globalConfig = { ...this.globalConfig, ...config };
    console.log('✅ Configuración global de botones actualizada:', this.globalConfig);
  }

  getGlobalConfig(): PressHoldConfig {
    return { ...this.globalConfig };
  }

  startPressTimer(buttonId: string, duration: number): void {
    // Cancelar timer existente si lo hay
    this.cancelPressTimer(buttonId);

    const startTime = Date.now();
    const state: PressHoldState = {
      isPressed: true,
      startTime,
      progress: 0,
      config: { ...this.globalConfig, holdDuration: duration },
    };

    this.buttonStates.set(buttonId, state);

    // Vibración inicial en dispositivos móviles
    if (this.globalConfig.enableHapticFeedback && this.isNativePlatform) {
      this.triggerHapticFeedback();
    }

    // Timer principal de progreso
    state.timerId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      state.progress = progress;
      this.buttonStates.set(buttonId, state);

      // Progreso completado
      if (progress >= 100) {
        this.completePress(buttonId);
        return;
      }

      // Emitir evento de progreso
      this.emitProgressEvent(buttonId, progress, duration, this.globalConfig.color);
    }, 50); // Actualizar cada 50ms para suavidad visual
  }

  cancelPressTimer(buttonId: string): void {
    const state = this.buttonStates.get(buttonId);
    if (state) {
      // Limpiar timers
      if (state.timerId) {
        clearInterval(state.timerId);
      }

      // Emitir evento de cancelación
      this.emitEvent({
        type: PressHoldEventType.PRESS_CANCELLED,
        buttonId,
        progress: state.progress,
        duration: state.config.holdDuration,
        color: this.globalConfig.color,
      });

      // Eliminar estado
      this.buttonStates.delete(buttonId);
    }
  }

  isPressing(buttonId: string): boolean {
    const state = this.buttonStates.get(buttonId);
    return state?.isPressed ?? false;
  }

  getProgress(buttonId: string): number {
    const state = this.buttonStates.get(buttonId);
    return state?.progress ?? 0;
  }

  private completePress(buttonId: string): void {
    const state = this.buttonStates.get(buttonId);
    if (!state) return;

    // Limpiar timers
    if (state.timerId) {
      clearInterval(state.timerId);
    }

    // Vibración de confirmación
    if (this.globalConfig.enableHapticFeedback && this.isNativePlatform) {
      this.triggerHapticFeedback('success');
    }

    // Emitir evento de completado
    this.emitEvent({
      type: PressHoldEventType.PRESS_COMPLETE,
      buttonId,
      progress: 100,
      duration: state.config.holdDuration,
      color: this.globalConfig.color,
    });

    // Eliminar estado
    this.buttonStates.delete(buttonId);
  }

  private emitProgressEvent(buttonId: string, progress: number, duration: number, color: string): void {
    this.emitEvent({
      type: PressHoldEventType.PROGRESS_UPDATE,
      buttonId,
      progress,
      duration,
      color,
    });
  }

  private emitEvent(event: PressHoldEvent): void {
    console.log('PressHold Event:', event);
  }

  private async triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' = 'light'): Promise<void> {
    try {
      if (this.isNativePlatform) {
        const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics');

        if (type === 'success') {
          await Haptics.notification({ type: NotificationType.Success });
          return;
        }

        let style = ImpactStyle.Light;
        switch (type) {
          case 'medium':
            style = ImpactStyle.Medium;
            break;
          case 'heavy':
            style = ImpactStyle.Heavy;
            break;
        }

        await Haptics.impact({ style });
      }
    } catch (error) {
      console.warn('Haptic feedback no disponible:', error);
    }
  }
}
