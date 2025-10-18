import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-press-hold-button',
  templateUrl: './press-hold-button.component.html',
  styleUrls: ['./press-hold-button.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton],
})
export class PressHoldButtonComponent implements OnInit, OnDestroy {
  // ✅ Inputs
  @Input() buttonId!: string;
  @Input() color: string = 'primary';
  @Input() holdDuration: number = 3000;
  @Input() ariaLabel?: string;
  @Input() actionId: string = ''; // ✅ Debe existir para emitir
  @Input() disabled: boolean = false; // ✅ Añadido para HTML

  // ✅ Output - DEBE emitir string (el actionId)
  @Output() actionExecuted = new EventEmitter<string>();

  @ViewChild('buttonRef', { static: false }) buttonRef?: ElementRef<HTMLIonButtonElement>;

  progress: number = 0;
  isPressed: boolean = false;
  isCompleted: boolean = false;

  private pressTimer: any = null;
  private progressInterval: any = null;
  private readonly PROGRESS_UPDATE_INTERVAL = 50;

  constructor(private readonly renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.buttonId) {
      console.error('❌ [PressHoldButton] buttonId es requerido');
    }

    // Log de inicialización para debug
    console.log(`🔧 [PressHoldButton] Inicializado:`, {
      buttonId: this.buttonId,
      actionId: this.actionId,
      holdDuration: this.holdDuration,
    });
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  @HostListener('mousedown')
  @HostListener('touchstart')
  onPressStart(): void {
    // ✅ Si ya completó, esperar al reset
    if (this.isCompleted) return;

    // ✅ Evitar múltiples inicios si ya está presionado
    if (this.isPressed) return;

    console.log(`▶️ [PressHoldButton] Inicio de presión: ${this.buttonId}`);
    this.isPressed = true;

    // ✅ Verificar que buttonRef existe antes de acceder a nativeElement
    if (this.buttonRef?.nativeElement) {
      this.renderer.addClass(this.buttonRef.nativeElement, 'pressed');
    }

    this.startProgress();
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onPressEnd(): void {
    // ✅ Si ya completó la acción, no hacer nada
    if (this.isCompleted) return;

    // ✅ Si el progreso está muy cerca del final (>95%), dejar que complete
    if (this.progress > 95) {
      console.log(`⏭️ [PressHoldButton] Progreso >95%, permitiendo completar: ${this.buttonId}`);
      return;
    }

    console.log(`⏸️ [PressHoldButton] Fin de presión: ${this.buttonId} - Progreso: ${this.progress}%`);

    this.isPressed = false;

    // ✅ Verificar que buttonRef existe antes de acceder a nativeElement
    if (this.buttonRef?.nativeElement) {
      this.renderer.removeClass(this.buttonRef.nativeElement, 'pressed');
    }

    this.clearTimers();
    this.resetProgress();
  }

  private startProgress(): void {
    const increment = (this.PROGRESS_UPDATE_INTERVAL / this.holdDuration) * 100;

    console.log(
      `🚀 [PressHoldButton] Iniciando progreso - Incremento: ${increment.toFixed(2)}% cada ${this.PROGRESS_UPDATE_INTERVAL}ms`,
    );

    this.progressInterval = setInterval(() => {
      this.progress += increment;

      // Log cada 25% para debug
      if (Math.floor(this.progress) % 25 === 0) {
        console.log(`📊 [PressHoldButton] Progreso: ${this.progress.toFixed(1)}%`);
      }

      if (this.progress >= 95) {
        console.log(`🎯 [PressHoldButton] Progreso alcanzó 100%, llamando a completeAction()`);
        this.completeAction();
      }
    }, this.PROGRESS_UPDATE_INTERVAL);
  }

  // ✅ MÉTODO CRÍTICO - Aquí se emite el evento
  private completeAction(): void {
    console.log(`✅ [PressHoldButton] Acción completada: ${this.buttonId}`);

    this.progress = 100;
    this.isCompleted = true;

    // ✅ Verificar que buttonRef existe
    if (this.buttonRef?.nativeElement) {
      this.renderer.addClass(this.buttonRef.nativeElement, 'completed');
    }

    this.clearTimers();

    // 🎯 CRÍTICO: Emitir el actionId si existe
    if (this.actionId) {
      console.log(`🚀 [PressHoldButton] Emitiendo actionId: "${this.actionId}"`);
      this.actionExecuted.emit(this.actionId);
    } else {
      console.warn(`⚠️ [PressHoldButton] No hay actionId configurado para ${this.buttonId}`);
      this.actionExecuted.emit(''); // Emitir string vacío por compatibilidad
    }

    // Reset después de un pequeño delay para mostrar el estado completado
    setTimeout(() => this.resetButton(), 500);
  }

  private resetButton(): void {
    console.log(`🔄 [PressHoldButton] Reseteando botón: ${this.buttonId}`);

    this.isPressed = false;
    this.isCompleted = false;

    // ✅ Verificar que buttonRef existe
    if (this.buttonRef?.nativeElement) {
      this.renderer.removeClass(this.buttonRef.nativeElement, 'pressed');
      this.renderer.removeClass(this.buttonRef.nativeElement, 'completed');
    }

    this.resetProgress();
  }

  private resetProgress(): void {
    this.progress = 0;
  }

  private clearTimers(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // ✅ Métodos públicos para el template
  isPressing(): boolean {
    return this.isPressed;
  }

  getProgress(): number {
    return this.progress;
  }

  getAccessibilityText(): string {
    if (this.ariaLabel) {
      return this.ariaLabel;
    }
    return `Botón ${this.buttonId}. Mantener presionado ${this.holdDuration / 1000} segundos para activar`;
  }

  getCircumference(): number {
    return 2 * Math.PI * 14; // radio = 14
  }

  onTestAction(): void {
    console.log('Acción de prueba ejecutada correctamente.');
  }
}
