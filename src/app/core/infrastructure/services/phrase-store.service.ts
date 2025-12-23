import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { IPhraseStoreService, PhraseStoreSlot, SaveResult } from '../../domain/interfaces/phrase-store.interface';
import { FileStorageService } from './file-storage.service';
import { PhraseButtonConfigService } from './phrase-button-config.service';
import { DefaultPhrasesService } from './default-phrases-initializer.service';

@Injectable({ providedIn: 'root' })
export class PhraseStoreService implements IPhraseStoreService {
  private _capacity = 12; // Dinámico, se carga del config
  private readonly STORAGE_KEY = 'saved-phrases-dynamic';
  private readonly LOCAL_KEY = 'saved-phrases-dynamic';

  private slotsSubject!: BehaviorSubject<PhraseStoreSlot[]>;
  private initialized = false;

  constructor(
    private readonly fileStorage: FileStorageService,
    private readonly buttonConfig: PhraseButtonConfigService,
    private readonly defaultPhrases: DefaultPhrasesService,
  ) {
    // Inicializar con capacidad por defecto
    this.slotsSubject = new BehaviorSubject<PhraseStoreSlot[]>(
      Array.from({ length: this._capacity }, (_, i) => ({ index: i, value: '' })),
    );
  }

  get capacity(): number {
    return this._capacity;
  }

  private async ensureLoaded(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    // Cargar configuración de capacidad
    const config = await this.buttonConfig.getConfig();
    this._capacity = config.count;

    // Reinicializar subject con la capacidad correcta
    this.slotsSubject = new BehaviorSubject<PhraseStoreSlot[]>(
      Array.from({ length: this._capacity }, (_, i) => ({ index: i, value: '' })),
    );

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
      if (!loadedData || !Array.isArray(loadedData)) {
        const ls = typeof localStorage === 'undefined' ? null : localStorage.getItem(this.LOCAL_KEY);
        if (ls) {
          try {
            loadedData = JSON.parse(ls);
          } catch {}
        }
      }

      // Si no hay datos válidos, inicializar con frases por defecto
      if (!loadedData || !Array.isArray(loadedData) || loadedData.length === 0) {
        loadedData = this.createDefaultSlots();
      }

      // Procesar datos - ajustar al tamaño actual
      const slots: PhraseStoreSlot[] = [];

      for (let i = 0; i < this._capacity; i++) {
        if (i < loadedData.length) {
          const item = loadedData[i];
          if (typeof item === 'string') {
            // Formato antiguo: array de strings
            slots.push({ index: i, value: this.normalize(item), isReadOnly: false });
          } else if (typeof item === 'object' && item !== null) {
            // Formato nuevo: objeto PhraseStoreSlot
            slots.push({
              index: i,
              value: this.normalize(item.value || ''),
              imageUri: item.imageUri,
              imageAltText: item.imageAltText,
              isReadOnly: false,
            });
          } else {
            slots.push({ index: i, value: '', isReadOnly: false });
          }
        } else {
          slots.push({ index: i, value: '', isReadOnly: false });
        }
      }

      this.slotsSubject.next(slots);
    } catch {
      const arr = this.createDefaultSlots();
      this.slotsSubject.next(arr);
    }
  }

  /**
   * Crea slots iniciales con frases por defecto en los primeros 6
   */
  private createDefaultSlots(): PhraseStoreSlot[] {
    const slots: PhraseStoreSlot[] = [];
    
    for (let i = 0; i < this._capacity; i++) {
      if (this.defaultPhrases.isFixedSlot(i)) {
        const defaultPhrase = this.defaultPhrases.getDefaultPhrase(i);
        if (defaultPhrase) {
          slots.push({
            index: i,
            value: defaultPhrase.text,
            imageUri: defaultPhrase.iconPath,
            imageAltText: defaultPhrase.altText,
            isReadOnly: false, // Ahora son editables
          });
        } else {
          slots.push({ index: i, value: '', isReadOnly: false });
        }
      } else {
        slots.push({ index: i, value: '', isReadOnly: false });
      }
    }
    
    return slots;
  }

  private async persist(): Promise<void> {
    // Guardar todos los slots (ahora todos son editables)
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

  async saveAt(index: number, phrase: string, opts?: { overwrite?: boolean; imageUri?: string; imageAltText?: string }): Promise<SaveResult> {
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

    // Actualizar slot con texto e imagen si se proporciona
    slots[index] = { 
      ...slots[index], 
      value: norm,
      imageUri: opts?.imageUri ?? slots[index].imageUri,
      imageAltText: opts?.imageAltText ?? slots[index].imageAltText,
      isReadOnly: false,
    };
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

    slots[index] = { index, value: '', isReadOnly: false };
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

    const arr = Array.from({ length: this._capacity }, (_, i) => ({ index: i, value: '' }));
    this.slotsSubject.next(arr);
    await this.persist();
  }

  /**
   * Método para cambiar la capacidad dinámicamente
   * Usado cuando el usuario cambia el número de botones en configuración
   */
  async updateCapacity(newCapacity: number, deleteSurplus: boolean = false): Promise<void> {
    await this.ensureLoaded();
    const oldSlots = this.slotsSubject.value;

    // Si hay que eliminar botones excedentes
    if (newCapacity < oldSlots.length && deleteSurplus) {
      // Borrar imágenes de los slots que se eliminarán
      for (let i = newCapacity; i < oldSlots.length; i++) {
        if (oldSlots[i].imageUri) {
          await this.fileStorage.deleteImage(oldSlots[i].imageUri!);
        }
      }
    }

    // Crear nuevo array con la nueva capacidad
    const newSlots: PhraseStoreSlot[] = [];
    for (let i = 0; i < newCapacity; i++) {
      if (i < oldSlots.length) {
        newSlots.push({ ...oldSlots[i], index: i });
      } else {
        newSlots.push({ index: i, value: '' });
      }
    }

    this._capacity = newCapacity;
    this.slotsSubject.next(newSlots);
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
