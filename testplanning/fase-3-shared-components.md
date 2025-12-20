# 📋 FASE 3: Tests de Componentes Compartidos

## 🎯 Objetivo
Alcanzar 85% de cobertura en componentes compartidos (`/shared/components/`), que son fundamentales para la accesibilidad y reutilizables en toda la aplicación.

## ⏱️ Duración Estimada
**2-3 días (16-24 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~50%
- **Final esperado:** ~65%
- **Tests a crear:** 45-50 tests
- **Componentes a testear:** 4 componentes

---

## 🎯 Prioridades

Todos los componentes compartidos son **P0 (Críticos)** porque:
- Son fundamentales para la accesibilidad
- Se usan en múltiples páginas
- Implementan patrones complejos (press-hold, TTS, navegación)

---

## 🔧 Tareas Detalladas

### 3.1 PressHoldButtonComponent (P0 - Día 1)
**Archivo:** `src/app/shared/components/press-hold-button/press-hold-button.component.spec.ts`

**Complejidad:** ALTA
**Tests requeridos:** 15-18 tests

#### Template de Test Base

```typescript
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PressHoldButtonComponent } from './press-hold-button.component';
import { TEST_PROVIDERS } from '@testing';
import { By } from '@angular/platform-browser';

describe('PressHoldButtonComponent', () => {
  let component: PressHoldButtonComponent;
  let fixture: ComponentFixture<PressHoldButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressHoldButtonComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(PressHoldButtonComponent);
    component = fixture.componentInstance;
    
    // Configuración básica
    component.buttonId = 'test-button';
    component.holdDuration = 1000;
    component.ariaLabel = 'Test button';
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have required inputs', () => {
      expect(component.buttonId).toBe('test-button');
      expect(component.holdDuration).toBe(1000);
      expect(component.ariaLabel).toBe('Test button');
    });

    it('should initialize state correctly', () => {
      expect(component.isPressed).toBeFalse();
      expect(component.progress).toBe(0);
    });
  });

  describe('Mouse/Touch Events - Press & Hold', () => {
    it('should start action on mousedown', () => {
      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
      expect(component.isPressed).toBeTrue();
    });

    it('should emit actionExecuted after hold duration', fakeAsync(() => {
      let emitted = false;
      component.actionExecuted.subscribe(() => emitted = true);

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
      
      tick(999);
      expect(emitted).toBeFalse();
      
      tick(2);
      expect(emitted).toBeTrue();
    }));

    it('should cancel on mouseup before completion', fakeAsync(() => {
      let actionEmitted = false;
      let cancelEmitted = false;
      
      component.actionExecuted.subscribe(() => actionEmitted = true);
      component.pressCancelled.subscribe(() => cancelEmitted = true);

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
      
      tick(500);
      button.nativeElement.dispatchEvent(new MouseEvent('mouseup'));
      tick(600);
      
      expect(actionEmitted).toBeFalse();
      expect(cancelEmitted).toBeTrue();
    }));

    it('should work with touchstart/touchend', fakeAsync(() => {
      let emitted = false;
      component.actionExecuted.subscribe(() => emitted = true);

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new TouchEvent('touchstart'));
      
      tick(1001);
      expect(emitted).toBeTrue();
    }));

    it('should cancel on mouseleave', fakeAsync(() => {
      let cancelEmitted = false;
      component.pressCancelled.subscribe(() => cancelEmitted = true);

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
      
      tick(500);
      button.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
      
      expect(cancelEmitted).toBeTrue();
    }));
  });

  describe('Keyboard Accessibility', () => {
    it('should work with Space key', fakeAsync(() => {
      let emitted = false;
      component.actionExecuted.subscribe(() => emitted = true);

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      
      tick(1001);
      expect(emitted).toBeTrue();
    }));

    it('should work with Enter key', fakeAsync(() => {
      let emitted = false;
      component.actionExecuted.subscribe(() => emitted = true);

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      
      tick(1001);
      expect(emitted).toBeTrue();
    }));

    it('should cancel on keyup before completion', fakeAsync(() => {
      let cancelEmitted = false;
      component.pressCancelled.subscribe(() => cancelEmitted = true);

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      
      tick(500);
      button.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
      
      expect(cancelEmitted).toBeTrue();
    }));
  });

  describe('Visual Progress Feedback', () => {
    it('should update progress during hold', fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
      
      tick(500);
      expect(component.progress).toBeCloseTo(50, 1);
      
      tick(250);
      expect(component.progress).toBeCloseTo(75, 1);
    }));

    it('should reset progress on cancel', fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
      
      tick(500);
      expect(component.progress).toBeGreaterThan(0);
      
      button.nativeElement.dispatchEvent(new MouseEvent('mouseup'));
      expect(component.progress).toBe(0);
    }));

    it('should show progress indicator in DOM', fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
      
      tick(500);
      fixture.detectChanges();
      
      const progressBar = fixture.debugElement.query(By.css('.progress-indicator'));
      expect(progressBar).toBeTruthy();
    }));
  });

  describe('Accessibility Attributes', () => {
    it('should have proper aria-label', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.getAttribute('aria-label')).toBe('Test button');
    });

    it('should have aria-describedby for instructions', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.getAttribute('aria-describedby')).toBeTruthy();
    });

    it('should update aria-pressed during hold', fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('button'));
      
      button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
      fixture.detectChanges();
      
      expect(button.nativeElement.getAttribute('aria-pressed')).toBe('true');
      
      tick(1001);
      fixture.detectChanges();
      
      expect(button.nativeElement.getAttribute('aria-pressed')).toBe('false');
    }));
  });

  describe('Edge Cases', () => {
    it('should handle rapid press/release cycles', fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('button'));
      
      for (let i = 0; i < 5; i++) {
        button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
        tick(200);
        button.nativeElement.dispatchEvent(new MouseEvent('mouseup'));
      }
      
      expect(component.isPressed).toBeFalse();
    }));

    it('should not emit multiple times on long hold', fakeAsync(() => {
      let emitCount = 0;
      component.actionExecuted.subscribe(() => emitCount++);

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
      
      tick(3000); // Hold for 3x duration
      
      expect(emitCount).toBe(1);
    }));
  });
});
```

**Cobertura objetivo:** ≥ 90%

---

### 3.2 SidebarNavigationComponent (P0 - Día 1-2)
**Archivo:** `src/app/shared/components/sidebar-navigation/sidebar-navigation.component.spec.ts`

**Complejidad:** MEDIA
**Tests requeridos:** 10-12 tests

```typescript
describe('SidebarNavigationComponent', () => {
  let component: SidebarNavigationComponent;
  let fixture: ComponentFixture<SidebarNavigationComponent>;
  let router: Router;
  let mockTtsService: jasmine.SpyObj<ITextToSpeechService>;

  beforeEach(async () => {
    mockTtsService = createMockTTSService();
    
    await TestBed.configureTestingModule({
      imports: [SidebarNavigationComponent, RouterTestingModule],
      providers: [
        { provide: TEXT_TO_SPEECH_SERVICE, useValue: mockTtsService },
        ...TEST_PROVIDERS
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavigationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create');
    it('should render navigation menu');
    it('should load menu items from config');
  });

  describe('Navigation', () => {
    it('should navigate to home');
    it('should navigate to write page');
    it('should navigate to phrases page');
    it('should navigate to settings');
  });

  describe('TTS Integration', () => {
    it('should announce page name on navigation');
    it('should provide audio feedback on hover');
  });

  describe('Keyboard Navigation', () => {
    it('should navigate with arrow keys');
    it('should select with Enter key');
    it('should focus management on open/close');
  });

  describe('Accessibility', () => {
    it('should have proper ARIA navigation role');
    it('should mark current page as aria-current');
  });
});
```

**Cobertura objetivo:** ≥ 85%

---

### 3.3 ColorSelectorComponent (P0 - Día 2)
**Archivo:** `src/app/shared/components/color-selector/color-selector.component.spec.ts`

**Complejidad:** MEDIA
**Tests requeridos:** 8-10 tests

```typescript
describe('ColorSelectorComponent', () => {
  let component: ColorSelectorComponent;
  let fixture: ComponentFixture<ColorSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSelectorComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Color Selection', () => {
    it('should emit selected color');
    it('should display color preview');
    it('should handle hex color input');
    it('should handle RGB color input');
  });

  describe('Contrast Validation', () => {
    it('should validate contrast ratio ≥ 7:1');
    it('should show warning for low contrast');
    it('should prevent selection of invalid colors');
  });

  describe('Accessibility', () => {
    it('should have color name announced');
    it('should be keyboard navigable');
  });

  describe('Predefined Colors', () => {
    it('should show predefined accessible colors');
    it('should all predefined colors pass WCAG AAA');
  });
});
```

**Cobertura objetivo:** ≥ 85%

---

### 3.4 TtsActivationComponent (P0 - Día 2-3)
**Archivo:** `src/app/shared/components/tts-activation/tts-activation.component.spec.ts`

**Complejidad:** MEDIA
**Tests requeridos:** 8-10 tests

```typescript
describe('TtsActivationComponent', () => {
  let component: TtsActivationComponent;
  let fixture: ComponentFixture<TtsActivationComponent>;
  let mockTtsService: jasmine.SpyObj<ITextToSpeechService>;

  beforeEach(async () => {
    mockTtsService = createMockTTSService();
    mockTtsService.isSupported.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [TtsActivationComponent],
      providers: [
        { provide: TEXT_TO_SPEECH_SERVICE, useValue: mockTtsService },
        ...TEST_PROVIDERS
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TtsActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Modal Display', () => {
    it('should show modal on web platform');
    it('should not show modal on native platform');
    it('should have activation button');
  });

  describe('TTS Activation', () => {
    it('should activate TTS on button click');
    it('should test TTS after activation');
    it('should emit activated event');
    it('should close modal after activation');
  });

  describe('Platform Detection', () => {
    it('should detect web platform correctly');
    it('should detect native platform correctly');
  });

  describe('Error Handling', () => {
    it('should show error if TTS not supported');
    it('should handle activation failure');
  });

  describe('Accessibility', () => {
    it('should trap focus in modal');
    it('should close on Escape key');
  });
});
```

**Cobertura objetivo:** ≥ 85%

---

## ✅ Checklist de Completitud

### Componente por Componente
- [ ] `press-hold-button.component.spec.ts` - 15+ tests, cobertura ≥ 90%
- [ ] `sidebar-navigation.component.spec.ts` - 10+ tests, cobertura ≥ 85%
- [ ] `color-selector.component.spec.ts` - 8+ tests, cobertura ≥ 85%
- [ ] `tts-activation.component.spec.ts` - 8+ tests, cobertura ≥ 85%

### Validaciones Globales
- [ ] Todos los tests de accesibilidad pasando
- [ ] Navegación por teclado validada en todos
- [ ] ARIA labels correctos en todos
- [ ] TTS feedback testeado donde aplica

---

## 📊 Validación de Progreso

**Después de cada componente:**
```bash
npm test -- --include="**/shared/components/**/*.spec.ts" --code-coverage
```

**Al final de la fase:**
```bash
npm test -- --no-watch --code-coverage --browsers=ChromeHeadless
```

**Resultado esperado:**
- Cobertura global: ~65%
- Cobertura en `/shared/components/`: ≥ 85%
- Tests pasando: 100%

---

## 🎯 Entregables

1. ✅ 4 archivos .spec.ts creados
2. ✅ 45-50 tests implementados
3. ✅ Cobertura global ≥ 65%
4. ✅ Cobertura shared components ≥ 85%
5. ✅ Todos los tests de accesibilidad pasando

---

## 🚨 Problemas Potenciales

### Problema 1: fakeAsync no funciona con Promises
**Solución:** Usar `flush()` o `await fixture.whenStable()`

### Problema 2: Eventos de teclado no se disparan
**Solución:** Usar `new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })`

### Problema 3: Progress visual no se actualiza
**Solución:** Llamar `fixture.detectChanges()` después de cada `tick()`

### Problema 4: Router no navega en tests
**Solución:** Usar `RouterTestingModule` y espiar `router.navigate()`

---

## 📚 Referencias

- [Testing Components](../context/testing-context.md#patrones-de-testing-de-componentes)
- [fakeAsync Guide](https://angular.io/guide/testing-components-scenarios#async-test-with-fakeasync)
- [Accessibility Testing](../context/accessibility-context.md)

---

## ➡️ Siguiente Fase

Una vez completada esta fase, continuar con:
**[FASE 4: Tests de Páginas](./fase-4-pages.md)**
