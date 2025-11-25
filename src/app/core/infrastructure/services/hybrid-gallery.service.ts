import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IGalleryService, GalleryImage } from '../../domain/interfaces/gallery.interface';

@Injectable({ providedIn: 'root' })
export class HybridGalleryService implements IGalleryService {
  async pickImage(): Promise<GalleryImage | null> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) return null;
      }

      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos, // Solo galería, no cámara
      });

      return {
        uri: image.path || image.webPath || '',
        webPath: image.webPath,
        format: image.format,
      };
    } catch (error) {
      console.error('[HybridGalleryService] Error al seleccionar imagen:', error);
      return null;
    }
  }

  async checkPermissions(): Promise<boolean> {
    try {
      const result = await Camera.checkPermissions();
      return result.photos === 'granted';
    } catch {
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const result = await Camera.requestPermissions({ permissions: ['photos'] });
      return result.photos === 'granted';
    } catch {
      return false;
    }
  }
}
