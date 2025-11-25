import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  constructor() { }

  /**
   * Guarda una imagen desde una ruta web (blob/temp) al almacenamiento persistente de la app.
   * Retorna la URI nativa del archivo guardado.
   */
  async saveImageFromWebPath(webPath: string): Promise<string> {
    try {
      // 1. Obtener el blob de la imagen temporal
      const response = await fetch(webPath);
      const blob = await response.blob();

      // 2. Convertir a Base64
      const base64Data = await this.convertBlobToBase64(blob) as string;
      // Eliminar la cabecera "data:image/jpeg;base64," si existe
      const savedData = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

      // 3. Generar nombre único
      const fileName = `btn_img_${Date.now()}.jpg`;

      // 4. Escribir en el directorio de datos de la app
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: savedData,
        directory: Directory.Data
      });

      // 5. Retornar la URI nativa (file://...)
      return savedFile.uri;
    } catch (error) {
      console.error('Error guardando imagen persistente:', error);
      throw error;
    }
  }

  /**
   * Borra una imagen del almacenamiento persistente.
   */
  async deleteImage(fileUri: string): Promise<void> {
    try {
      if (!fileUri) return;

      // Extraer el nombre del archivo de la URI
      // Ejemplo: file:///data/.../files/btn_img_123.jpg -> btn_img_123.jpg
      const fileName = fileUri.split('/').pop();

      if (fileName) {
        await Filesystem.deleteFile({
          path: fileName,
          directory: Directory.Data
        });
        console.log('Imagen antigua eliminada:', fileName);
      }
    } catch (error) {
      // Ignoramos error si el archivo no existe
      console.warn('No se pudo borrar la imagen (quizás ya no existía):', error);
    }
  }

  private readonly convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
