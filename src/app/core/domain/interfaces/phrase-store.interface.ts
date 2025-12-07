export interface PhraseStoreSlot {
  index: number; // 0..11
  value: string; // '' si vacío
  imageUri?: string; // URI local de imagen opcional (undefined = mostrar número)
  imageAltText?: string; // Descripción accesible de la imagen para TTS
}

export interface SaveResult {
  ok: boolean;
  error?: 'EMPTY' | 'DUPLICATE' | 'INDEX_OUT_OF_RANGE';
  duplicateIndex?: number;
}

export interface IPhraseStoreService {
  readonly capacity: number; // Dinámico según configuración
  getAll(): Promise<PhraseStoreSlot[]>;
  observeAll(): import('rxjs').Observable<PhraseStoreSlot[]>;
  saveAt(index: number, phrase: string, opts?: { overwrite?: boolean }): Promise<SaveResult>;
  removeAt(index: number): Promise<void>;
  clearAll(): Promise<void>;
  findDuplicateIndex(phrase: string): Promise<number>; // -1 si no hay duplicado
  normalize(phrase: string): string; // trim + colapsar espacios
  setImageAt(index: number, imageUri: string, altText?: string): Promise<void>;
  removeImageAt(index: number): Promise<void>;
  updateCapacity(newCapacity: number, deleteSurplus: boolean): Promise<void>;
}
