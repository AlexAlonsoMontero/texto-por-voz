import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { IPhraseStoreService, PhraseStoreSlot, SaveResult } from '../../domain/interfaces/phrase-store.interface';
import { FileStorageService } from './file-storage.service';

@Injectable({ providedIn: 'root' })
export class PhraseStoreService implements IPhraseStoreService {
  readonly capacity = 12;
  private readonly STORAGE_KEY = 'saved-phrases-12';
  private readonly LOCAL_KEY = 'saved-phrases-12';

  private readonly slotsSubject = new BehaviorSubject<PhraseStoreSlot[]>(
    Array.from({ length: this.capacity }, (_, i) => ({ index: i, value: '' })),
  );
  private initialized = false;

  constructor(private readonly fileStorage: FileStorageService) {}

  private async ensureLoaded(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    await this.load();
  }

  private async load(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      let loadedData: any[] | null = null;

      if (value) {
        try {
          loadedData = JSON.parse(value);
        } catch {}
      }

      // Fallback a localStorage
      if (!loadedData || !Array.isArray(loadedData) || loadedData.length !== this.capacity) {
        const ls = typeof localStorage === 'undefined' ? null : localStorage.getItem(this.LOCAL_KEY);
        if (ls) {
          try {
            loadedData = JSON.parse(ls);
          } catch {}
        }
      }

      // Si no hay datos válidos, inicializar vacío
      if (!loadedData || !Array.isArray(loadedData) || loadedData.length !== this.capacity) {
        const arr = Array.from({ length: this.capacity }, (_, i) => ({ index: i, value: '' }));
        this.slotsSubject.next(arr);
        return;
      }

      // Procesar datos (migración de string[] a PhraseStoreSlot[])
      const slots: PhraseStoreSlot[] = loadedData.map((item, i) => {
        if (typeof item === 'string') {
          // Formato antiguo: array de strings
          return { index: i, value: this.normalize(item) };
        } else if (typeof item === 'object' && item !== null) {
          // Formato nuevo: objeto PhraseStoreSlot
          return {
            index: i,
            value: this.normalize(item.value || ''),
            imageUri: item.imageUri,
            imageAltText: item.imageAltText,
          };
        }
        return { index: i, value: '' };
      });

      this.slotsSubject.next(slots);
    } catch {
      const arr = Array.from({ length: this.capacity }, (_, i) => ({ index: i, value: '' }));
      this.slotsSubject.next(arr);
    }
  }

  private async persist(): Promise<void> {
    // Guardar el objeto completo para preservar imágenes
    const slots = this.slotsSubject.value;
    const json = JSON.stringify(slots);

    await Preferences.set({ key: this.STORAGE_KEY, value: json });
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(this.LOCAL_KEY, json);
    } catch {}
  }

  normalize(phrase: string): string {
    return (phrase ?? '').replaceAll(/\s+/g, ' ').trim();
  }

  async getAll(): Promise<PhraseStoreSlot[]> {
    await this.ensureLoaded();
    return this.slotsSubject.value;
  }

  observeAll() {
    return this.slotsSubject.asObservable();
  }

  async findDuplicateIndex(phrase: string): Promise<number> {
    await this.ensureLoaded();
    const norm = this.normalize(phrase).toLocaleLowerCase();
    return this.slotsSubject.value.findIndex((s) => s.value && s.value.toLocaleLowerCase() === norm);
  }

  async saveAt(index: number, phrase: string, opts?: { overwrite?: boolean }): Promise<SaveResult> {
    await this.ensureLoaded();
    if (index < 0 || index >= this.capacity) return { ok: false, error: 'INDEX_OUT_OF_RANGE' };
    const norm = this.normalize(phrase);
    if (!norm) return { ok: false, error: 'EMPTY' };

    const dupIndex = await this.findDuplicateIndex(norm);
    if (dupIndex >= 0 && dupIndex !== index) {
      return { ok: false, error: 'DUPLICATE', duplicateIndex: dupIndex };
    }

    const slots = [...this.slotsSubject.value];
    const current = slots[index].value;
    const overwrite = opts?.overwrite === true;
    if (current && !overwrite) {
      // Necesita confirmación desde UI
      return { ok: false, error: 'DUPLICATE' };
    }

    // Preservar imagen si existe
    slots[index] = { ...slots[index], value: norm };
    this.slotsSubject.next(slots);
    await this.persist();
    return { ok: true };
  }

  async removeAt(index: number): Promise<void> {
    await this.ensureLoaded();
    if (index < 0 || index >= this.capacity) return;
    const slots = [...this.slotsSubject.value];
    
    // Borrar imagen si existe
    if (slots[index].imageUri) {
      await this.fileStorage.deleteImage(slots[index].imageUri!);
    }

    slots[index] = { index, value: '' };
    this.slotsSubject.next(slots);
    await this.persist();
  }

  async clearAll(): Promise<void> {
    await this.ensureLoaded();
    const slots = this.slotsSubject.value;
    
    // Borrar todas las imágenes
    for (const slot of slots) {
      if (slot.imageUri) {
        await this.fileStorage.deleteImage(slot.imageUri);
      }
    }

    const arr = Array.from({ length: this.capacity }, (_, i) => ({ index: i, value: '' }));
    this.slotsSubject.next(arr);
    await this.persist();
  }

  async setImageAt(index: number, imageUri: string, altText?: string): Promise<void> {
    await this.ensureLoaded();
    if (index < 0 || index >= this.capacity) return;

    const slots = [...this.slotsSubject.value];
    
    // 1. Borrar imagen anterior si existe
    if (slots[index].imageUri) {
      await this.fileStorage.deleteImage(slots[index].imageUri!);
    }

    // 2. Guardar nueva imagen persistentemente
    let permanentUri = imageUri;
    try {
      // Solo guardar si es una ruta temporal (webPath) o content://
      // Si ya es file:// en data, asumimos que ya está guardada (aunque esto es raro en este flujo)
      if (!imageUri.includes('file://') || !imageUri.includes('btn_img_')) {
         permanentUri = await this.fileStorage.saveImageFromWebPath(imageUri);
      }
    } catch (e) {
      console.error('Error persistiendo imagen, usando original', e);
    }

    slots[index] = {
      ...slots[index],
      imageUri: permanentUri,
      imageAltText: altText || `Imagen personalizada ${index + 1}`,
    };

    this.slotsSubject.next(slots);
    await this.persist();
  }

  async removeImageAt(index: number): Promise<void> {
    await this.ensureLoaded();
    if (index < 0 || index >= this.capacity) return;

    const slots = [...this.slotsSubject.value];
    
    // Borrar imagen física
    if (slots[index].imageUri) {
      await this.fileStorage.deleteImage(slots[index].imageUri!);
    }

    slots[index] = {
      ...slots[index],
      imageUri: undefined,
      imageAltText: undefined,
    };

    this.slotsSubject.next(slots);
    await this.persist();
  }
}
