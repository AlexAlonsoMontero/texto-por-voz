/**
 * Tipos de vista para la página Write
 */
export type WriteViewMode = 'panel' | 'carousel';

/**
 * Interface para el servicio de configuración de vista de Write
 */
export interface IWriteViewConfigService {
  /**
   * Obtiene el modo de vista actual
   */
  getViewMode(): Promise<WriteViewMode>;

  /**
   * Establece el modo de vista
   */
  setViewMode(mode: WriteViewMode): Promise<void>;

  /**
   * Observable del modo de vista actual
   */
  readonly viewMode$: import('rxjs').Observable<WriteViewMode>;
}
