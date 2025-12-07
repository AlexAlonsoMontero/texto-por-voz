import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonModal, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { warning, image } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { PressHoldButtonComponent } from '../../shared/components/press-hold-button/press-hold-button.component';
import { TextInputSectionComponent } from '../write/components/text-input-section/text-input-section.component';
import { PhraseSlotButtonComponent } from './components/phrase-slot-button/phrase-slot-button.component';
import {
  PHRASE_STORE_SERVICE,
  TEXT_TO_SPEECH_SERVICE,
  GALLERY_SERVICE,
  PHRASE_BUTTON_CONFIG_SERVICE,
} from '../../core/infrastructure/injection-tokens';
import { IPhraseStoreService, PhraseStoreSlot } from '../../core/domain/interfaces/phrase-store.interface';
import { ITextToSpeechService } from '../../core/domain/interfaces/text-to-speech.interface';
import { IGalleryService } from '../../core/domain/interfaces/gallery.interface';
import {
  IPhraseButtonConfigService,
  ButtonSizeConfig,
  GridLayout,
} from '../../core/domain/interfaces/phrase-button-config.interface';

@Component({
  selector: 'app-phrases',
  standalone: true,
  templateUrl: './phrases.page.html',
  styleUrls: ['./phrases.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonModal,
    IonIcon,
    PressHoldButtonComponent,
    TextInputSectionComponent,
    PhraseSlotButtonComponent,
  ],
})
export class PhrasesPage implements OnInit {
  slots: PhraseStoreSlot[] = [];
  showSaveModal = false;
  showImageManageModal = false;
  showImageConfigModal = false;
  showDeleteManageModal = false;
  showDeleteConfirmModal = false;
  confirmOverwriteIndex: number | null = null;
  currentText = signal<string>('');
  currentConfigIndex = -1;
  imageAltTextInput = '';
  slotToDeleteIndex = -1;

  // 🆕 Configuración dinámica
  sizeConfig: ButtonSizeConfig = {
    height: 220,
    numberSize: '3.5rem',
    numberSizeTablet: '4.5rem',
    gap: 8,
  };
  gridLayout: GridLayout = {
    portraitCols: 2,
    landscapeCols: 3,
  };

  constructor(
    @Inject(PHRASE_STORE_SERVICE) private readonly store: IPhraseStoreService,
    @Inject(TEXT_TO_SPEECH_SERVICE) private readonly tts: ITextToSpeechService,
    @Inject(GALLERY_SERVICE) private readonly gallery: IGalleryService,
    @Inject(PHRASE_BUTTON_CONFIG_SERVICE) private readonly buttonConfig: IPhraseButtonConfigService,
  ) {
    addIcons({ warning, image });
  }

  ngOnInit(): void {
    void this.loadConfig();
    void this.store.getAll().then((all) => (this.slots = all));
    this.store.observeAll().subscribe((s) => (this.slots = s));
  }

  private async loadConfig(): Promise<void> {
    const config = await this.buttonConfig.getConfig();
    this.sizeConfig = this.buttonConfig.getSizeConfig(config.size);
    this.gridLayout = this.buttonConfig.getGridLayoutForSize(config.count, config.size);

    // Aplicar estilos CSS dinámicamente
    this.applyDynamicStyles();
  }

  private applyDynamicStyles(): void {
    const root = document.documentElement;
    root.style.setProperty('--phrase-button-height', `${this.sizeConfig.height}px`);
    root.style.setProperty('--phrase-button-gap', `${this.sizeConfig.gap}px`);
    root.style.setProperty('--phrase-number-size', this.sizeConfig.numberSize);
    root.style.setProperty('--phrase-number-size-tablet', this.sizeConfig.numberSizeTablet);
    root.style.setProperty('--phrase-grid-portrait-cols', `${this.gridLayout.portraitCols}`);
    root.style.setProperty('--phrase-grid-landscape-cols', `${this.gridLayout.landscapeCols}`);
  }

  // TextInputSection -> emisión del texto actual
  onTextChange(text: string) {
    this.currentText.set(text);
  }

  // Abrir modal de selección (tras press-hold en Guardar)
  onSaveHoldStart() {
    void this.tts.speak('Guardar frase');
  }
  onSaveAction() {
    this.showSaveModal = true;
  }
  onCloseModalHoldStart() {
    void this.tts.speak('Cerrar');
  }
  onCloseModalAction() {
    this.showSaveModal = false;
    this.confirmOverwriteIndex = null;
  }

  // Acciones de slots en la página (reproducir / vacío)
  onSlotHoldStart(i: number) {
    const slot = this.slots[i];
    const hasContent = slot?.value?.trim();
    if (hasContent) {
      void this.tts.speak(slot.value);
    } else {
      void this.tts.speak(`${i + 1}`);
    }
  }
  onSlotAction(i: number) {
    const slot = this.slots[i];
    if (slot?.value === '' || !slot) return void this.tts.speak(`El botón ${i + 1} no tiene frase asignada`);
    void this.tts.speak(slot.value);
  }

  // Gestión global de imágenes
  openImageManageModal(): void {
    this.showImageManageModal = true;
    void this.tts.speak('Selecciona un botón para gestionar su imagen');
  }

  closeImageManageModal(): void {
    this.showImageManageModal = false;
  }

  // Gestión global de borrados
  openDeleteManageModal(): void {
    this.showDeleteManageModal = true;
    void this.tts.speak('Selecciona un botón para eliminarlo');
  }

  closeDeleteManageModal(): void {
    this.showDeleteManageModal = false;
  }

  onDeleteSlotSelected(index: number): void {
    const slot = this.slots[index];
    if (!slot?.value && !slot?.imageUri) {
      void this.tts.speak(`El botón ${index + 1} está vacío`);
      return;
    }
    this.openDeleteConfirmModal(index);
  }

  openDeleteConfirmModal(index: number): void {
    this.slotToDeleteIndex = index;
    this.showDeleteConfirmModal = true;
    void this.tts.speak(`¿Borrar botón ${index + 1}? Mantén pulsado para confirmar`);
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.slotToDeleteIndex = -1;
  }

  async confirmDeleteSlot(): Promise<void> {
    if (this.slotToDeleteIndex < 0) return;
    await this.store.removeAt(this.slotToDeleteIndex);
    await this.tts.speak('Botón eliminado');
    // Recargar la página para evitar problemas de UI con los modales
    globalThis.location.reload();
  }

  getSlotesConContenido(): { index: number; slot: PhraseStoreSlot }[] {
    return this.slots
      .map((slot, index) => ({ index, slot }))
      .filter(({ slot }) => (slot?.value?.trim?.()?.length ?? 0) > 0 || !!slot?.imageUri);
  }

  // Modal: seleccionar slot para guardar
  onPickSlotHoldStart(i: number) {
    const slot = this.slots[i];
    if (slot?.value === '' || !slot) {
      void this.tts.speak(`Guardar en botón ${i + 1}`);
    } else {
      void this.tts.speak(`Se reemplazará la frase del botón ${i + 1}. Mantenga pulsado de nuevo para confirmar`);
    }
  }

  async onPickSlotAction(i: number) {
    const text = this.currentText();
    const norm = this.store.normalize(text);
    if (!norm) {
      return void this.tts.speak('No hay texto para guardar');
    }
    const dup = await this.store.findDuplicateIndex(norm);
    if (dup >= 0 && dup !== i) {
      return void this.tts.speak(`La frase ya existe en el botón ${dup + 1}`);
    }

    const slot = this.slots[i];
    if (slot?.value) {
      if (this.confirmOverwriteIndex === i) {
        const res = await this.store.saveAt(i, norm, { overwrite: true });
        if (res.ok) {
          this.showSaveModal = false;
          this.confirmOverwriteIndex = null;
          this.currentText.set('');
          await this.tts.speak(`Frase reemplazada en el botón ${i + 1}`);
        }
      } else {
        this.confirmOverwriteIndex = i;
      }
    } else {
      const res = await this.store.saveAt(i, norm, { overwrite: true });
      if (res.ok) {
        this.showSaveModal = false;
        this.confirmOverwriteIndex = null;
        this.currentText.set('');
        await this.tts.speak(`Frase guardada en el botón ${i + 1}`);
      }
    }
  }

  // 🆕 Nuevos métodos para gestión de imágenes

  openImageConfig(index: number): void {
    this.currentConfigIndex = index;
    const slot = this.slots[index];
    this.imageAltTextInput = slot?.imageAltText || '';
    this.closeImageManageModal();

    void this.tts.speak(`Configurar imagen del botón ${index + 1}`);
  }

  closeImageConfig(): void {
    this.currentConfigIndex = -1;
    this.imageAltTextInput = '';
  }

  getCurrentSlot(): PhraseStoreSlot | undefined {
    if (this.currentConfigIndex < 0) return undefined;
    return this.slots[this.currentConfigIndex];
  }

  onSelectImageHoldStart(): void {
    void this.tts.speak('Seleccionar imagen de la galería');
  }

  async selectImageFromGallery(): Promise<void> {
    try {
      const image = await this.gallery.pickImage();

      if (!image) {
        await this.tts.speak('No se seleccionó ninguna imagen');
        return;
      }

      // Usar webPath si está disponible para asegurar que se vea en el WebView
      const imageUri = image.webPath || image.uri;

      // Guardar imagen en el slot
      await this.store.setImageAt(
        this.currentConfigIndex,
        imageUri,
        this.imageAltTextInput || `Imagen ${this.currentConfigIndex + 1}`,
      );

      await this.tts.speak('Imagen guardada correctamente');
      this.closeImageConfig();
    } catch (error) {
      console.error('[PhrasesPage] Error al seleccionar imagen:', error);
      await this.tts.speak('Error al seleccionar imagen');
    }
  }

  onRemoveImageHoldStart(): void {
    void this.tts.speak('Quitar imagen personalizada');
  }

  async removeImage(): Promise<void> {
    await this.store.removeImageAt(this.currentConfigIndex);
    await this.tts.speak('Imagen eliminada. Se mostrará el número nuevamente');
    this.closeImageConfig();
  }

  async saveAltText(): Promise<void> {
    const slot = this.getCurrentSlot();
    if (!slot?.imageUri) return;

    await this.store.setImageAt(this.currentConfigIndex, slot.imageUri, this.imageAltTextInput);

    await this.tts.speak('Descripción guardada');
  }

  onImageActionHoldStart(): void {
    void this.tts.speak('Gestionar imágenes');
  }

  onDeleteActionHoldStart(): void {
    void this.tts.speak('Eliminar botones');
  }

  onConfirmDeleteHoldStart(): void {
    void this.tts.speak('Borrar botón');
  }

  getImageSrc(imageUri: string | undefined): string {
    if (!imageUri) return '';
    return Capacitor.convertFileSrc(imageUri);
  }
}
