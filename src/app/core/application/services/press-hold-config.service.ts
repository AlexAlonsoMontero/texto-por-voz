import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio para gestionar la configuración global de botones press-hold
 * Permite cambiar la duración de presión desde los ajustes
 */
@Injectable({
  providedIn: 'root',
})
export class PressHoldConfigService {
  private readonly STORAGE_KEY = 'pressHoldDuration';
  private readonly DEFAULT_DURATION = 500; // 0.5 segundos por defecto (mínimo permitido)

  private readonly durationSubject: BehaviorSubject<number>;
  public readonly duration$: Observable<number>;

  constructor() {
    const savedDuration = this.loadFromStorage();
    this.durationSubject = new BehaviorSubject<number>(savedDuration);
    this.duration$ = this.durationSubject.asObservable();
  }

  /**
   * Obtiene la duración actual de presión
   */
  getDuration(): number {
    return this.durationSubject.value;
  }

  /**
   * Actualiza la duración de presión y notifica a todos los suscriptores
   */
  setDuration(durationMs: number): void {
    this.durationSubject.next(durationMs);
    this.saveToStorage(durationMs);
  }

  /**
   * Carga la duración desde localStorage
   */
  private loadFromStorage(): number {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const duration = parseInt(saved, 10);
        // Validar rango (0.5-5 segundos)
        if (duration >= 500 && duration <= 5000) {
          return duration;
        }
      }
    } catch (error) {
      console.error('Error loading press-hold duration:', error);
    }
    return this.DEFAULT_DURATION;
  }

  /**
   * Guarda la duración en localStorage
   */
  private saveToStorage(durationMs: number): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, durationMs.toString());
    } catch (error) {
      console.error('Error saving press-hold duration:', error);
    }
  }
}
