import { Injectable } from '@angular/core';

export interface DefaultPhrase {
  slot: number;
  text: string;
  iconPath: string;
  altText: string;
}

@Injectable({ providedIn: 'root' })
export class DefaultPhrasesService {
  // Slots fijos de solo lectura (0-5)
  readonly defaultPhrases: DefaultPhrase[] = [
    { slot: 0, text: 'SI', iconPath: 'assets/default-icons/check.svg', altText: 'Sí' },
    { slot: 1, text: 'NO', iconPath: 'assets/default-icons/no.svg', altText: 'No' },
    { slot: 2, text: 'tengo hambre', iconPath: 'assets/default-icons/eating.svg', altText: 'Comida' },
    { slot: 3, text: 'quiero ir al baño', iconPath: 'assets/default-icons/bathroom.svg', altText: 'Baño' },
    { slot: 4, text: 'No me encuentro bien', iconPath: 'assets/default-icons/health.svg', altText: 'Salud' },
    { slot: 5, text: 'me cargas la tablet?', iconPath: 'assets/default-icons/battery.svg', altText: 'Batería' },
  ];

  readonly FIXED_SLOTS_COUNT = 6;

  isFixedSlot(index: number): boolean {
    return index >= 0 && index < this.FIXED_SLOTS_COUNT;
  }

  getDefaultPhrase(index: number): DefaultPhrase | undefined {
    return this.defaultPhrases.find(p => p.slot === index);
  }

  getAllDefaultPhrases(): DefaultPhrase[] {
    return this.defaultPhrases;
  }

  /**
   * Restaura los 6 botones predefinidos
   */
  async restoreDefaults(phraseStore: any): Promise<void> {
    for (const phrase of this.defaultPhrases) {
      await phraseStore.saveAt(phrase.slot, phrase.text, {
        overwrite: true,
        imageUri: phrase.iconPath,
        imageAltText: phrase.altText,
      });
    }
  }
}
