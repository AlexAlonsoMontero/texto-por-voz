export interface PhraseStoreSlot {
  index: number; // 0..11
  value: string; // '' si vacío
}

export interface SaveResult {
  ok: boolean;
  error?: 'EMPTY' | 'DUPLICATE' | 'INDEX_OUT_OF_RANGE';
  duplicateIndex?: number;
}

export interface IPhraseStoreService {
  readonly capacity: number; // 12
  getAll(): Promise<PhraseStoreSlot[]>;
  observeAll(): import('rxjs').Observable<PhraseStoreSlot[]>;
  saveAt(index: number, phrase: string, opts?: { overwrite?: boolean }): Promise<SaveResult>;
  removeAt(index: number): Promise<void>;
  clearAll(): Promise<void>;
  findDuplicateIndex(phrase: string): Promise<number>; // -1 si no hay duplicado
  normalize(phrase: string): string; // trim + colapsar espacios
}
