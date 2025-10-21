import { Component, Input, Output, EventEmitter, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';
import { PressHoldButtonComponent } from '../../../../shared/components/press-hold-button/press-hold-button.component';

/**
 * Componente para mostrar letras individuales en formato carrusel (slider)
 */
@Component({
  selector: 'app-letter-carousel-view',
  templateUrl: './letter-carousel-view.component.html',
  styleUrls: ['./letter-carousel-view.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, PressHoldButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LetterCarouselViewComponent {
  @Input() letters: string[] = [];
  @Output() letterHoldStart = new EventEmitter<string>();
  @Output() letterSelected = new EventEmitter<string>();

  @ViewChild('swiper', { static: false }) swiper?: any;

  currentIndex = 0;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: false,
    centeredSlides: true,
    slidesPerView: 1,
  };

  onLetterHoldStart(actionId: string): void {
    this.letterHoldStart.emit(actionId);
  }

  onLetterSelected(actionId: string): void {
    this.letterSelected.emit(actionId);
  }

  async slidePrev(): Promise<void> {
    if (this.swiper) {
      await this.swiper.slidePrev();
    }
  }

  async slideNext(): Promise<void> {
    if (this.swiper) {
      await this.swiper.slideNext();
    }
  }

  onSlideChange(): void {
    if (this.swiper) {
      this.swiper.getActiveIndex().then((index: number) => {
        this.currentIndex = index;
      });
    }
  }
}
