export interface ISafeAreaService {
  /**
   * Obtiene los insets del área segura de la pantalla
   * @returns Promise con los insets (top, bottom, left, right)
   */
  getSafeAreaInsets(): Promise<SafeAreaInsets>;

  /**
   * Calcula la altura disponible descontando las barras del sistema
   * @returns Promise con la altura disponible en píxeles
   */
  getAvailableHeight(): Promise<number>;

  /**
   * Calcula el ancho disponible descontando las barras laterales
   * @returns Promise con el ancho disponible en píxeles
   */
  getAvailableWidth(): Promise<number>;

  /**
   * Verifica si la plataforma tiene barras de navegación
   * @returns Promise<boolean>
   */
  hasSystemBars(): Promise<boolean>;

  /**
   * Método para debug - muestra información completa del safe area
   */
  debugSafeAreaInfo(): Promise<void>;
}

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
