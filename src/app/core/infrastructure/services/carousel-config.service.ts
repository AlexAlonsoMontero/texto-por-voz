import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Configuración del carrusel (autoplay delay)
 * Persistido con Capacitor Preferences
 */
@Injectable({ providedIn: 'root' })
export class CarouselConfigService {
  private readonly STORAGE_KEY_DELAY = 'carousel-delay-ms';
  private readonly DEFAULT_DELAY_MS = 1000; // 1 segundo por defecto

  private readonly delaySubject = new BehaviorSubject<number>(this.DEFAULT_DELAY_MS);
  private initialized = false;

  public readonly delay$: Observable<number> = this.delaySubject.asObservable();

  private async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    await this.loadDelay();
  }

  private async loadDelay(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY_DELAY });
      const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
      if (!Number.isNaN(parsed) && parsed > 0) {
        this.delaySubject.next(parsed);
      } else {
        this.delaySubject.next(this.DEFAULT_DELAY_MS);
      }
    } catch (e) {
      console.error('[CarouselConfig] Error cargando delay:', e);
      this.delaySubject.next(this.DEFAULT_DELAY_MS);
    }
  }

  public async getDelayMs(): Promise<number> {
    await this.initialize();
    return this.delaySubject.value;
  }

  public async setDelayMs(delayMs: number): Promise<void> {
    try {
      if (delayMs < 100) delayMs = 100; // mínimo de seguridad
      await Preferences.set({ key: this.STORAGE_KEY_DELAY, value: String(delayMs) });
      this.delaySubject.next(delayMs);
      console.log(`✅ [CarouselConfig] Delay actualizado: ${delayMs}ms`);
    } catch (e) {
      console.error('[CarouselConfig] Error guardando delay:', e);
      throw e;
    }
  }
}
