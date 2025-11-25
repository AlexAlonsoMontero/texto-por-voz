export interface GalleryImage {
  uri: string; // URI local del archivo
  webPath?: string; // Path web para preview
  format?: string; // 'jpeg', 'png', etc.
}

export interface IGalleryService {
  /**
   * Abre el selector de imágenes del dispositivo
   * @returns URI local de la imagen seleccionada o null si cancela
   */
  pickImage(): Promise<GalleryImage | null>;

  /**
   * Verifica si hay permisos de galería (importante en móvil)
   */
  checkPermissions(): Promise<boolean>;

  /**
   * Solicita permisos de galería si no los tiene
   */
  requestPermissions(): Promise<boolean>;
}
