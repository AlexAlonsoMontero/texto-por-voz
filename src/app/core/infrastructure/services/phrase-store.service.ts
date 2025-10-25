import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { IPhraseStoreService, PhraseStoreSlot, SaveResult } from '../../domain/interfaces/phrase-store.interface';

@Injectable({ providedIn: 'root' })
export class PhraseStoreService implements IPhraseStoreService {
  readonly capacity = 12;
  private readonly STORAGE_KEY = 'saved-phrases-12';
  private readonly LOCAL_KEY = 'saved-phrases-12';

  private readonly slotsSubject = new BehaviorSubject<PhraseStoreSlot[]>(
    Array.from({ length: this.capacity }, (_, i) => ({ index: i, value: '' })),
  );
  private initialized = false;

  private async ensureLoaded(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    await this.load();
  }

  private async load(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      let arr: string[] | null = null;
      if (value) {
        try {
          arr = JSON.parse(value) as string[];
        } catch {}
      }
      if (!arr || !Array.isArray(arr) || arr.length !== this.capacity) {
        const ls = typeof localStorage === 'undefined' ? null : localStorage.getItem(this.LOCAL_KEY);
        if (ls) {
          try {
            arr = JSON.parse(ls) as string[];
          } catch {}
        }
      }
      if (!arr || !Array.isArray(arr) || arr.length !== this.capacity) {
        arr = Array.from({ length: this.capacity }, () => '');
      }
      const norm = arr.map((v) => (typeof v === 'string' ? this.normalize(v) : ''));
      this.slotsSubject.next(norm.map((v, i) => ({ index: i, value: v })));
    } catch {
      const arr = Array.from({ length: this.capacity }, () => '');
      this.slotsSubject.next(arr.map((v, i) => ({ index: i, value: v })));
    }
  }

  private async persist(): Promise<void> {
    const arr = this.slotsSubject.value.map((s) => s.value);
    const json = JSON.stringify(arr);
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

    slots[index] = { index, value: norm };
    this.slotsSubject.next(slots);
    await this.persist();
    return { ok: true };
  }

  async removeAt(index: number): Promise<void> {
    await this.ensureLoaded();
    if (index < 0 || index >= this.capacity) return;
    const slots = [...this.slotsSubject.value];
    slots[index] = { index, value: '' };
    this.slotsSubject.next(slots);
    await this.persist();
  }

  async clearAll(): Promise<void> {
    const arr = Array.from({ length: this.capacity }, (_, i) => ({ index: i, value: '' }));
    this.slotsSubject.next(arr);
    await this.persist();
  }
}
