import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { PRESS_HOLD_BUTTON_SERVICE } from '../../../core/infrastructure/injection-tokens';
import {
  IPressHoldButtonService,
  IonicColor,
  DEFAULT_PRESS_HOLD_CONFIG,
} from '../../../core/domain/interfaces/press-hold-button.interface';
import { PressHoldConfigService } from '../../../core/application/services/press-hold-config.service';

@Component({
  selector: 'app-press-hold-button',
  templateUrl: './press-hold-button.component.html',
  styleUrls: ['./press-hold-button.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton],
})
export class PressHoldButtonComponent implements OnInit, OnDestroy {
  @Input() buttonId!: string;
  @Input() color: IonicColor = DEFAULT_PRESS_HOLD_CONFIG.color;
  @Input() disabled: boolean = false;
  @Input() ariaLabel: string = '';

  @Output() actionExecuted = new EventEmitter<void>();
  @Output() pressStarted = new EventEmitter<void>();
  @Output() pressCancelled = new EventEmitter<void>();

  @ViewChild('progressCircle', { static: false }) progressCircle!: ElementRef<SVGCircleElement>;

  private progressAnimationId?: number;
  private durationSubscription?: Subscription;

  // Duración dinámica controlada por el servicio
  public holdDuration: number = DEFAULT_PRESS_HOLD_CONFIG.holdDuration;

  constructor(
    @Inject(PRESS_HOLD_BUTTON_SERVICE)
    private readonly pressHoldService: IPressHoldButtonService,
    private readonly configService: PressHoldConfigService,
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en la duración de presión
    this.durationSubscription = this.configService.duration$.subscribe((duration) => {
      this.holdDuration = duration;
    });
  }

  ngOnDestroy(): void {
    this.cancelPress();
    this.durationSubscription?.unsubscribe();
  }

  /**
   * Inicia la presión sostenida del botón
   */
  onPressStart(event: Event): void {
    if (this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    // API simplificada: solo buttonId y duration
    this.pressHoldService.startPressTimer(this.buttonId, this.holdDuration);
    this.pressStarted.emit();
    this.startProgressAnimation();

    console.log(`✅ Presión iniciada en botón ${this.buttonId} por ${this.holdDuration}ms`);
  }

  /**
   * Cancela la presión sostenida
   */
  onPressEnd(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const wasPressed = this.isPressing();
    const progress = this.getProgress();

    if (progress >= 100) {
      this.actionExecuted.emit();
      console.log(`✅ Acción ejecutada en botón ${this.buttonId}`);
    } else if (wasPressed) {
      this.pressCancelled.emit();
      console.log(`❌ Presión cancelada en botón ${this.buttonId} con ${progress.toFixed(1)}% progreso`);
    }

    this.cancelPress();
  }

  private cancelPress(): void {
    this.pressHoldService.cancelPressTimer(this.buttonId);
    this.stopProgressAnimation();
  }

  isPressing(): boolean {
    return this.pressHoldService.isPressing(this.buttonId);
  }

  getProgress(): number {
    return this.pressHoldService.getProgress(this.buttonId);
  }

  private startProgressAnimation(): void {
    this.updateProgressCircle();
  }

  private stopProgressAnimation(): void {
    if (this.progressAnimationId) {
      cancelAnimationFrame(this.progressAnimationId);
      this.progressAnimationId = undefined;
    }
    this.resetProgressCircle();
  }

  private updateProgressCircle(): void {
    if (!this.isPressing()) {
      this.stopProgressAnimation();
      return;
    }

    const progress = this.getProgress();

    if (this.progressCircle?.nativeElement) {
      const circle = this.progressCircle.nativeElement;
      const radius = 22;
      const circumference = 2 * Math.PI * radius;
      const strokeDasharray = circumference;
      const strokeDashoffset = circumference - (progress / 100) * circumference;

      circle.style.strokeDasharray = strokeDasharray.toString();
      circle.style.strokeDashoffset = strokeDashoffset.toString();
    }

    this.progressAnimationId = requestAnimationFrame(() => {
      this.updateProgressCircle();
    });
  }

  private resetProgressCircle(): void {
    if (this.progressCircle?.nativeElement) {
      const circle = this.progressCircle.nativeElement;
      const circumference = 2 * Math.PI * 22;
      circle.style.strokeDasharray = circumference.toString();
      circle.style.strokeDashoffset = circumference.toString();
    }
  }

  getButtonClasses(): string {
    // Sin clases personalizadas - Ionic maneja los estilos nativamente
    return '';
  }

  getAccessibilityText(): string {
    if (this.ariaLabel) {
      return `${this.ariaLabel}. Mantén presionado durante ${this.holdDuration / 1000} segundos para activar`;
    }
    return `Botón de presión sostenida. Mantén presionado durante ${this.holdDuration / 1000} segundos para activar`;
  }
}
