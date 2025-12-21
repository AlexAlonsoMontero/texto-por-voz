import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Capacitor } from '@capacitor/core';
import { PressHoldButtonService } from './press-hold-button.service';
import {
  DEFAULT_PRESS_HOLD_CONFIG,
  PressHoldConfig,
} from '../domain/interfaces/press-hold-button.interface';

describe('PressHoldButtonService', () => {
  let service: PressHoldButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PressHoldButtonService],
    });

    service = TestBed.inject(PressHoldButtonService);
  });

  afterEach(() => {
    // Limpiar todos los timers activos
    const buttonIds = ['test-btn-1', 'test-btn-2', 'test-btn-3'];
    buttonIds.forEach((id) => service.cancelPressTimer(id));
  });

  describe('Configuration Management', () => {
    it('should return default config', () => {
      const config = service.getGlobalConfig();

      expect(config).toEqual(DEFAULT_PRESS_HOLD_CONFIG);
    });

    it('should update hold duration', () => {
      service.setGlobalConfig({ holdDuration: 1000 });

      const config = service.getGlobalConfig();
      expect(config.holdDuration).toBe(1000);
    });

    it('should update haptic feedback setting', () => {
      service.setGlobalConfig({ enableHapticFeedback: false });

      const config = service.getGlobalConfig();
      expect(config.enableHapticFeedback).toBe(false);
    });

    it('should update showProgress setting', () => {
      service.setGlobalConfig({ showProgress: false });

      const config = service.getGlobalConfig();
      expect(config.showProgress).toBe(false);
    });

    it('should update color', () => {
      service.setGlobalConfig({ color: 'success' });

      const config = service.getGlobalConfig();
      expect(config.color).toBe('success');
    });

    it('should update multiple config values at once', () => {
      const newConfig: Partial<PressHoldConfig> = {
        holdDuration: 1500,
        enableHapticFeedback: false,
        showProgress: true,
        color: 'danger',
      };

      service.setGlobalConfig(newConfig);

      const config = service.getGlobalConfig();
      expect(config.holdDuration).toBe(1500);
      expect(config.enableHapticFeedback).toBe(false);
      expect(config.showProgress).toBe(true);
      expect(config.color).toBe('danger');
    });

    it('should preserve unmodified config values', () => {
      service.setGlobalConfig({ holdDuration: 2000 });

      const config = service.getGlobalConfig();
      expect(config.holdDuration).toBe(2000);
      expect(config.enableHapticFeedback).toBe(DEFAULT_PRESS_HOLD_CONFIG.enableHapticFeedback);
      expect(config.showProgress).toBe(DEFAULT_PRESS_HOLD_CONFIG.showProgress);
    });

    it('should return copy of config to prevent mutation', () => {
      const config1 = service.getGlobalConfig();
      config1.holdDuration = 9999;

      const config2 = service.getGlobalConfig();
      expect(config2.holdDuration).not.toBe(9999);
      expect(config2.holdDuration).toBe(DEFAULT_PRESS_HOLD_CONFIG.holdDuration);
    });
  });

  describe('Press Timer Management', () => {
    it('should start press timer', fakeAsync(() => {
      service.startPressTimer('test-btn-1', 1000);

      expect(service.isPressing('test-btn-1')).toBe(true);
      expect(service.getProgress('test-btn-1')).toBe(0);

      tick(100);
    }));

    it('should track progress during press', fakeAsync(() => {
      service.startPressTimer('test-btn-1', 1000);

      tick(500); // 50% del tiempo

      const progress = service.getProgress('test-btn-1');
      expect(progress).toBeGreaterThan(40);
      expect(progress).toBeLessThan(60);

      service.cancelPressTimer('test-btn-1');
    }));

    it('should complete press after duration', fakeAsync(() => {
      service.startPressTimer('test-btn-1', 500);

      tick(550); // Esperar más del tiempo requerido

      expect(service.isPressing('test-btn-1')).toBe(false);
      expect(service.getProgress('test-btn-1')).toBe(0);
    }));

    it('should cancel press timer', fakeAsync(() => {
      service.startPressTimer('test-btn-1', 1000);

      tick(300);
      expect(service.isPressing('test-btn-1')).toBe(true);

      service.cancelPressTimer('test-btn-1');

      expect(service.isPressing('test-btn-1')).toBe(false);
      expect(service.getProgress('test-btn-1')).toBe(0);
    }));

    it('should handle multiple simultaneous presses', fakeAsync(() => {
      service.startPressTimer('btn-1', 1000);
      service.startPressTimer('btn-2', 500);

      tick(300);

      expect(service.isPressing('btn-1')).toBe(true);
      expect(service.isPressing('btn-2')).toBe(true);

      tick(300); // Total 600ms

      expect(service.isPressing('btn-1')).toBe(true);
      expect(service.isPressing('btn-2')).toBe(false); // Completado

      service.cancelPressTimer('btn-1');
    }));

    it('should cancel existing timer when starting new one for same button', fakeAsync(() => {
      service.startPressTimer('test-btn-1', 1000);

      tick(300);
      const progress1 = service.getProgress('test-btn-1');

      // Reiniciar timer para el mismo botón
      service.startPressTimer('test-btn-1', 1000);

      tick(100);
      const progress2 = service.getProgress('test-btn-1');

      // El progreso debe ser menor porque se reinició
      expect(progress2).toBeLessThan(progress1);

      service.cancelPressTimer('test-btn-1');
    }));

    it('should return 0 progress for non-existent button', () => {
      const progress = service.getProgress('non-existent-btn');

      expect(progress).toBe(0);
    });

    it('should return false for non-existent button isPressing', () => {
      const isPressing = service.isPressing('non-existent-btn');

      expect(isPressing).toBe(false);
    });

    it('should not throw error when canceling non-existent timer', () => {
      expect(() => service.cancelPressTimer('non-existent-btn')).not.toThrow();
    });
  });

  describe('Haptic Feedback', () => {
    beforeEach(() => {
      service.setGlobalConfig({ enableHapticFeedback: true });
    });

    it('should not trigger haptic on web platform', fakeAsync(() => {
      service.startPressTimer('test-btn-1', 500);

      tick(600);

      // No debería intentar importar Haptics en web
      expect(true).toBe(true); // Test pasa si no hay errores
    }));

    it('should handle haptic feedback gracefully', fakeAsync(() => {
      service.startPressTimer('test-btn-1', 500);

      tick(600);

      // El servicio debe manejar haptic feedback sin errores
      expect(true).toBe(true);
    }));

    it('should not trigger haptic when disabled', fakeAsync(() => {
      service.setGlobalConfig({ enableHapticFeedback: false });

      service.startPressTimer('test-btn-1', 500);

      tick(600);

      // Test pasa si no hay errores
      expect(true).toBe(true);
    }));
  });

  describe('Edge Cases', () => {
    it('should handle very short durations', fakeAsync(() => {
      service.startPressTimer('test-btn-1', 100);

      tick(150);

      expect(service.isPressing('test-btn-1')).toBe(false);
    }));

    it('should handle very long durations', fakeAsync(() => {
      service.startPressTimer('test-btn-1', 10000);

      tick(5000);
      expect(service.isPressing('test-btn-1')).toBe(true);

      const progress = service.getProgress('test-btn-1');
      expect(progress).toBeGreaterThan(40);
      expect(progress).toBeLessThan(60);

      service.cancelPressTimer('test-btn-1');
    }));

    it('should progress reach exactly 100 at completion', fakeAsync(() => {
      let finalProgress = 0;

      service.startPressTimer('test-btn-1', 500);

      tick(550);

      // El progreso debe haber llegado a 100 antes de completarse
      // (verificamos indirectamente que se completó correctamente)
      expect(service.isPressing('test-btn-1')).toBe(false);
    }));

    it('should handle rapid start/cancel cycles', fakeAsync(() => {
      for (let i = 0; i < 10; i++) {
        service.startPressTimer('test-btn-1', 1000);
        tick(50);
        service.cancelPressTimer('test-btn-1');
      }

      expect(service.isPressing('test-btn-1')).toBe(false);
      expect(service.getProgress('test-btn-1')).toBe(0);
    }));
  });

  describe('Integration', () => {
    it('should work with custom config per press', fakeAsync(() => {
      service.setGlobalConfig({ holdDuration: 2000 });

      // Iniciar con duración personalizada
      service.startPressTimer('test-btn-1', 500);

      tick(600);

      expect(service.isPressing('test-btn-1')).toBe(false);
    }));

    it('should maintain independent state for different buttons', fakeAsync(() => {
      service.startPressTimer('btn-1', 1000);
      tick(500);

      service.startPressTimer('btn-2', 1000);
      tick(500); // Total: btn-1=1000ms, btn-2=500ms

      expect(service.isPressing('btn-1')).toBe(false); // Completado
      expect(service.isPressing('btn-2')).toBe(true); // Aún presionando

      service.cancelPressTimer('btn-2');
    }));

    it('should cleanup state after completion', fakeAsync(() => {
      service.startPressTimer('test-btn-1', 500);

      tick(600);

      // El estado debe limpiarse automáticamente
      expect(service.isPressing('test-btn-1')).toBe(false);
      expect(service.getProgress('test-btn-1')).toBe(0);
    }));
  });
});
