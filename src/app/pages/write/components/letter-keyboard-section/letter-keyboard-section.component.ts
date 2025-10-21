import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';
import { PressHoldButtonComponent } from '../../../../shared/components/press-hold-button/press-hold-button.component';
import { WriteViewMode } from '../../../../core/domain/interfaces/write-view.interface';
import { CarouselConfigService } from '../../../../core/infrastructure/services/carousel-config.service';

@Component({
  selector: 'app-letter-keyboard-section',
  templateUrl: './letter-keyboard-section.component.html',
  styleUrls: ['./letter-keyboard-section.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, PressHoldButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LetterKeyboardSectionComponent {
  @Input() letterGroups: string[] = [];
  @Input() viewMode: WriteViewMode = 'panel';
  @Output() letterGroupHoldStart = new EventEmitter<{ actionId: string; group: string }>();
  @Output() letterGroupAction = new EventEmitter<{ actionId: string; group: string }>();

  currentSlideIndex = 0;
  carouselDelayMs = 1000;

  constructor(private readonly carouselConfig: CarouselConfigService) {
    // Suscribirse para reactividad si cambia en Settings
    this.carouselConfig.delay$.subscribe((ms) => (this.carouselDelayMs = ms));
  }

  onLetterGroupHoldStart(actionId: string, group: string): void {
    this.letterGroupHoldStart.emit({ actionId, group });
  }

  onLetterGroupClick(actionId: string, group: string): void {
    this.letterGroupAction.emit({ actionId, group });
  }

  // Para carrusel
  async onSlidePrev(swiper: any): Promise<void> {
    await swiper.slidePrev();
  }

  async onSlideNext(swiper: any): Promise<void> {
    await swiper.slideNext();
  }

  onSlideChange(swiper: any): void {
    swiper.getActiveIndex().then((index: number) => {
      this.currentSlideIndex = index;
    });
  }
}
