import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';
import { IWriteViewConfigService, WriteViewMode } from '../../domain/interfaces/write-view.interface';

/**
 * Servicio para gestionar la configuración de vista de la página Write
 * Almacena la preferencia de forma persistente usando Capacitor Preferences
 */
@Injectable({
  providedIn: 'root',
})
export class WriteViewConfigService implements IWriteViewConfigService {
  private readonly STORAGE_KEY = 'write-view-mode';
  private readonly LOCAL_KEY = 'write-view-mode';
  private readonly DEFAULT_MODE: WriteViewMode = 'panel';

  private readonly viewModeSubject = new BehaviorSubject<WriteViewMode>(this.DEFAULT_MODE);
  private initialized = false;

  /**
   * Observable del modo de vista actual
   */
  public readonly viewMode$: Observable<WriteViewMode> = this.viewModeSubject.asObservable();

  constructor() {
    // La carga se realiza en el primer getViewMode()
  }

  /**
   * Inicializa el servicio cargando el modo desde storage
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    this.initialized = true;
    await this.loadViewMode();
  }

  /**
   * Carga el modo de vista desde el almacenamiento persistente
   */
  private async loadViewMode(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      const normalized = (value ?? '').toString().trim().toLowerCase();
      const mode = normalized === 'panel' || normalized === 'carousel' ? (normalized as WriteViewMode) : undefined;

      if (mode) {
        this.viewModeSubject.next(mode);
      } else {
        // Intentar fallback a localStorage (WebView) si no hay valor en Preferences
        const ls = typeof localStorage === 'undefined' ? null : localStorage.getItem(this.LOCAL_KEY);
        const lsNorm = (ls ?? '').toString().trim().toLowerCase();
        if (lsNorm === 'panel' || lsNorm === 'carousel') {
          this.viewModeSubject.next(lsNorm as WriteViewMode);
        } else {
          this.viewModeSubject.next(this.DEFAULT_MODE);
        }
      }
    } catch (error) {
      console.error('Error al cargar modo de vista:', error);
      // Fallback final a localStorage
      try {
        const ls = typeof localStorage === 'undefined' ? null : localStorage.getItem(this.LOCAL_KEY);
        const lsNorm = (ls ?? '').toString().trim().toLowerCase();
        if (lsNorm === 'panel' || lsNorm === 'carousel') {
          this.viewModeSubject.next(lsNorm as WriteViewMode);
          return;
        }
      } catch {}
      this.viewModeSubject.next(this.DEFAULT_MODE);
    }
  }

  /**
   * Obtiene el modo de vista actual
   */
  public async getViewMode(): Promise<WriteViewMode> {
    await this.initialize();
    return this.viewModeSubject.value;
  }

  /**
   * Establece el modo de vista y lo persiste
   */
  public async setViewMode(mode: WriteViewMode): Promise<void> {
    try {
      const normalized = (mode as string).trim().toLowerCase() as WriteViewMode;
      await Preferences.set({ key: this.STORAGE_KEY, value: normalized });
      // También persistir en localStorage como respaldo
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.LOCAL_KEY, normalized);
        }
      } catch {}
      this.viewModeSubject.next(normalized);
      console.log(`✅ Modo de vista cambiado a: ${normalized}`);
    } catch (error) {
      console.error('Error al guardar modo de vista:', error);
      // Intentar persistir en localStorage si falla Preferences
      try {
        const normalized = (mode as string).trim().toLowerCase() as WriteViewMode;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.LOCAL_KEY, normalized);
        }
        this.viewModeSubject.next(normalized);
        console.warn('⚠️ Preferences falló; persistido en localStorage.');
      } catch {}
    }
  }
}
