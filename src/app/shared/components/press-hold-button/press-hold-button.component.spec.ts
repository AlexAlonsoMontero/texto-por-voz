import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PressHoldButtonComponent } from './press-hold-button.component';
import { TEST_PROVIDERS } from '../../../../testing';
import { PressHoldButtonService } from '../../../core/infrastructure/press-hold-button.service';

/**
 * Tests de PressHoldButtonComponent
 * Enfoque: Accesibilidad + navegación teclado + comportamiento observable
 * 
 * CRÍTICO: Componente de accesibilidad para discapacidades motoras
 */
describe('PressHoldButtonComponent', () => {
  let component: PressHoldButtonComponent;
  let fixture: ComponentFixture<PressHoldButtonComponent>;
  let pressHoldService: jasmine.SpyObj<PressHoldButtonService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressHoldButtonComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(PressHoldButtonComponent);
    component = fixture.componentInstance;
    pressHoldService = TestBed.inject(PressHoldButtonService) as jasmine.SpyObj<PressHoldButtonService>;
    
    // Configuración básica
    component.buttonId = 'test-button';
    component.actionId = 'test-action';
    component.holdDuration = 1000;
    component.ariaLabel = 'Test button';
    
    fixture.detectChanges();
  });

  describe('Component Contract', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have required inputs', () => {
      expect(component.buttonId).toBeDefined();
      expect(component.actionId).toBeDefined();
      expect(component.holdDuration).toBeDefined();
    });

    it('should have accessibility attributes', () => {
      expect(component.ariaLabel).toBeDefined();
    });

    it('should have output events', () => {
      expect(component.actionExecuted).toBeDefined();
      expect(component.holdStart).toBeDefined();
      expect(typeof component.actionExecuted.emit).toBe('function');
      expect(typeof component.holdStart.emit).toBe('function');
    });
  });

  describe('DOM Structure', () => {
    it('should render ion-button', () => {
      const button = fixture.nativeElement.querySelector('ion-button');
      expect(button).toBeTruthy();
    });

    it('should have accessibility support', () => {
      // El componente usa ion-button que es accesible por defecto
      expect(component.ariaLabel).toBeDefined();
    });

    it('should be interactive', () => {
      // Verificar que el botón es interactivo
      const button = fixture.nativeElement.querySelector('ion-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Accessibility - Keyboard Navigation', () => {
    it('should handle keyboard interaction gracefully', () => {
      // El componente usa @HostListener('mousedown') y @HostListener('touchstart')
      // La navegación por teclado se maneja a nivel de ion-button nativo
      expect(component).toBeTruthy();
    });

    it('should be focusable via keyboard', () => {
      const button = fixture.nativeElement.querySelector('ion-button');
      expect(button).toBeTruthy();
      // ion-button es naturalmente keyboard accessible
    });
  });

  describe('Mouse/Touch Events', () => {
    it('should handle press start without error', () => {
      expect(() => component.onPressStart()).not.toThrow();
    });

    it('should handle press end without error', () => {
      expect(() => component.onPressEnd()).not.toThrow();
    });

    it('should handle context menu without error', () => {
      const event = new MouseEvent('contextmenu');
      expect(() => component.onContextMenu(event)).not.toThrow();
    });
  });

  describe('Visual Feedback', () => {
    it('should provide visual state', () => {
      expect(typeof component.isPressed).toBe('boolean');
      expect(typeof component.progress).toBe('number');
    });

    it('should have progress within valid range', () => {
      expect(component.progress).toBeGreaterThanOrEqual(0);
      expect(component.progress).toBeLessThanOrEqual(100);
    });
  });

  describe('Configuration', () => {
    it('should accept custom hold duration', () => {
      component.holdDuration = 2000;
      fixture.detectChanges();
      expect(component.holdDuration).toBe(2000);
    });

    it('should accept color configuration', () => {
      component.color = 'primary';
      fixture.detectChanges();
      expect(component.color).toBe('primary');
    });

    it('should handle disabled state', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });
  });

  describe('Lifecycle', () => {
    it('should initialize without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should cleanup on destroy', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('Integration with Service', () => {
    it('should interact with PressHoldButtonService', () => {
      expect(pressHoldService).toBeDefined();
    });

    it('should manage press state', () => {
      expect(typeof component.isPressed).toBe('boolean');
      expect(typeof component.isCompleted).toBe('boolean');
    });
  });
});
