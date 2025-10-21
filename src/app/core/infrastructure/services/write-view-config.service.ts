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
      const mode = value as WriteViewMode;

      if (mode === 'panel' || mode === 'carousel') {
        this.viewModeSubject.next(mode);
      } else {
        this.viewModeSubject.next(this.DEFAULT_MODE);
      }
    } catch (error) {
      console.error('Error al cargar modo de vista:', error);
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
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: mode,
      });
      this.viewModeSubject.next(mode);
      console.log(`✅ Modo de vista cambiado a: ${mode}`);
    } catch (error) {
      console.error('Error al guardar modo de vista:', error);
      throw error;
    }
  }
}
