import { Injectable } from '@angular/core';

type BackHandler = () => void;

@Injectable({
  providedIn: 'root',
})
export class BackNavigationService {
  private customBackHandler: BackHandler | null = null;

  /**
   * Registra una acción personalizada para el botón de atrás.
   * @param handler Función que se ejecutará al pulsar atrás.
   */
  registerHandler(handler: BackHandler): void {
    this.customBackHandler = handler;
  }

  /**
   * Elimina la acción personalizada actual.
   */
  unregisterHandler(): void {
    this.customBackHandler = null;
  }

  /**
   * Ejecuta la acción personalizada si existe.
   * @returns true si se ejecutó una acción personalizada, false si no había ninguna.
   */
  handleBack(): boolean {
    if (this.customBackHandler) {
      this.customBackHandler();
      return true;
    }
    return false;
  }
}
