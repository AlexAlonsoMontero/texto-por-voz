# 📋 FASE 5: Tests de Componentes de Páginas

## 🎯 Objetivo
Alcanzar 75% de cobertura en componentes específicos de páginas (`/pages/*/components/`), que implementan funcionalidad especializada y lógica de UI compleja.

## ⏱️ Duración Estimada
**3 días (24 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~75%
- **Final esperado:** ~85%
- **Tests a crear:** 58-71 tests
- **Componentes a testear:** 6 componentes

---

## 🎯 Prioridades por Complejidad

### P0 - Crítico (Día 1-2)
- `letter-keyboard-section.component.ts` - Lógica compleja de teclado
- `letter-grid-view.component.ts` - Vista grid con navegación
- `letter-carousel-view.component.ts` - Vista carrusel con Swiper

### P1 - Alto (Día 2-3)
- `phrase-slot-button.component.ts` - Gestión de slots
- `text-input-section.component.ts` - Input y visualización
- `action-buttons-section.component.ts` - Acciones principales

---

## 🔧 Tareas Detalladas

### 5.1 LetterKeyboardSectionComponent (P0 - Día 1)
**Archivo:** `src/app/pages/write/components/letter-keyboard-section/letter-keyboard-section.component.spec.ts`

**Complejidad:** ALTA
**Tests requeridos:** 12-15 tests

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterKeyboardSectionComponent } from './letter-keyboard-section.component';
import { TEST_PROVIDERS } from '@testing';
import { By } from '@angular/platform-browser';

describe('LetterKeyboardSectionComponent', () => {
  let component: LetterKeyboardSectionComponent;
  let fixture: ComponentFixture<LetterKeyboardSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterKeyboardSectionComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(LetterKeyboardSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with grid view by default', () => {
      expect(component.viewMode).toBe('grid');
    });

    it('should load alphabet letters', () => {
      expect(component.letters).toBeDefined();
      expect(component.letters.length).toBeGreaterThan(0);
    });

    it('should include special characters', () => {
      const hasSpace = component.letters.some(l => l === ' ');
      expect(hasSpace).toBeTrue();
    });
  });

  describe('View Mode Switching', () => {
    it('should switch to grid view', () => {
      component.viewMode = 'carousel';
      component.switchToGridView();
      expect(component.viewMode).toBe('grid');
    });

    it('should switch to carousel view', () => {
      component.viewMode = 'grid';
      component.switchToCarouselView();
      expect(component.viewMode).toBe('carousel');
    });

    it('should emit viewModeChanged event', () => {
      spyOn(component.viewModeChanged, 'emit');
      component.switchToCarouselView();
      expect(component.viewModeChanged.emit).toHaveBeenCalledWith('carousel');
    });

    it('should render correct child component for view mode', () => {
      component.viewMode = 'grid';
      fixture.detectChanges();
      
      const gridView = fixture.debugElement.query(By.css('app-letter-grid-view'));
      expect(gridView).toBeTruthy();
    });
  });

  describe('Letter Selection', () => {
    it('should emit letterSelected when letter is clicked', () => {
      spyOn(component.letterSelected, 'emit');
      component.onLetterSelected('A');
      expect(component.letterSelected.emit).toHaveBeenCalledWith('A');
    });

    it('should handle multiple letter selections', () => {
      const emissions: string[] = [];
      component.letterSelected.subscribe(letter => emissions.push(letter));
      
      component.onLetterSelected('H');
      component.onLetterSelected('O');
      component.onLetterSelected('L');
      component.onLetterSelected('A');
      
      expect(emissions).toEqual(['H', 'O', 'L', 'A']);
    });

    it('should handle space character', () => {
      spyOn(component.letterSelected, 'emit');
      component.onLetterSelected(' ');
      expect(component.letterSelected.emit).toHaveBeenCalledWith(' ');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate with arrow keys in grid view', () => {
      component.viewMode = 'grid';
      fixture.detectChanges();
      
      const gridComponent = fixture.debugElement.query(
        By.css('app-letter-grid-view')
      ).componentInstance;
      
      expect(gridComponent).toBeTruthy();
    });

    it('should pass keyboard events to active view', () => {
      // Test propagation of keyboard events
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeyboardEvent(event);
      // Verificar que se manejó correctamente
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      const section = fixture.nativeElement as HTMLElement;
      const keyboardSection = section.querySelector('.letter-keyboard-section');
      expect(keyboardSection?.getAttribute('role')).toBeTruthy();
    });

    it('should announce view mode changes', () => {
      const liveRegion = fixture.nativeElement.querySelector('[aria-live]');
      expect(liveRegion).toBeTruthy();
    });
  });

  describe('TTS Integration', () => {
    it('should announce letters on selection', () => {
      // Mock TTS service already injected
      component.onLetterSelected('A');
      // Verificar que TTS fue llamado
    });

    it('should provide audio feedback on view switch', () => {
      component.switchToCarouselView();
      // Verificar feedback TTS
    });
  });
});
```

**Cobertura objetivo:** ≥ 80%

---

### 5.2 LetterGridViewComponent (P0 - Día 1-2)
**Archivo:** `src/app/pages/write/components/letter-grid-view/letter-grid-view.component.spec.ts`

**Complejidad:** ALTA
**Tests requeridos:** 10-12 tests

```typescript
describe('LetterGridViewComponent', () => {
  let component: LetterGridViewComponent;
  let fixture: ComponentFixture<LetterGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterGridViewComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(LetterGridViewComponent);
    component = fixture.componentInstance;
    
    component.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create');
    it('should render letter buttons in grid');
    it('should calculate grid columns dynamically');
  });

  describe('Grid Navigation', () => {
    it('should navigate right with ArrowRight', () => {
      component.currentFocusIndex = 0;
      component.onArrowRight();
      expect(component.currentFocusIndex).toBe(1);
    });

    it('should navigate left with ArrowLeft', () => {
      component.currentFocusIndex = 1;
      component.onArrowLeft();
      expect(component.currentFocusIndex).toBe(0);
    });

    it('should navigate down with ArrowDown', () => {
      component.currentFocusIndex = 0;
      component.gridColumns = 3;
      component.onArrowDown();
      expect(component.currentFocusIndex).toBe(3);
    });

    it('should navigate up with ArrowUp', () => {
      component.currentFocusIndex = 3;
      component.gridColumns = 3;
      component.onArrowUp();
      expect(component.currentFocusIndex).toBe(0);
    });

    it('should wrap around at grid boundaries', () => {
      component.currentFocusIndex = 8;
      component.onArrowRight();
      expect(component.currentFocusIndex).toBe(0);
    });

    it('should not go below 0 index', () => {
      component.currentFocusIndex = 0;
      component.onArrowLeft();
      expect(component.currentFocusIndex).toBe(0);
    });
  });

  describe('Letter Selection', () => {
    it('should emit letterSelected on click');
    it('should emit letterSelected on Enter key');
    it('should emit letterSelected on Space key');
  });

  describe('Focus Management', () => {
    it('should focus button at current index');
    it('should update focus indicator visually');
  });

  describe('Responsive Grid', () => {
    it('should adjust columns for mobile');
    it('should adjust columns for desktop');
  });
});
```

**Cobertura objetivo:** ≥ 80%

---

### 5.3 LetterCarouselViewComponent (P0 - Día 2)
**Archivo:** `src/app/pages/write/components/letter-carousel-view/letter-carousel-view.component.spec.ts`

**Complejidad:** ALTA
**Tests requeridos:** 10-12 tests

```typescript
describe('LetterCarouselViewComponent', () => {
  let component: LetterCarouselViewComponent;
  let fixture: ComponentFixture<LetterCarouselViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterCarouselViewComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(LetterCarouselViewComponent);
    component = fixture.componentInstance;
    
    component.letters = ['A', 'B', 'C', 'D', 'E'];
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create');
    it('should initialize Swiper instance');
    it('should render letter slides');
  });

  describe('Carousel Navigation', () => {
    it('should navigate to next slide with ArrowRight');
    it('should navigate to previous slide with ArrowLeft');
    it('should navigate with swipe gestures');
    it('should loop to beginning at end');
  });

  describe('Swiper Configuration', () => {
    it('should configure slides per view');
    it('should configure spacing between slides');
    it('should enable/disable loop mode');
    it('should handle mobile breakpoints');
  });

  describe('Letter Selection', () => {
    it('should emit letterSelected on slide click');
    it('should emit letterSelected on Enter key on focused slide');
    it('should select centered slide by default');
  });

  describe('Accessibility', () => {
    it('should announce current slide on change');
    it('should provide swipe instructions for screen readers');
  });

  describe('Cleanup', () => {
    it('should destroy Swiper on component destroy');
  });
});
```

**Cobertura objetivo:** ≥ 75%

---

### 5.4 PhraseSlotButtonComponent (P1 - Día 2-3)
**Archivo:** `src/app/pages/phrases/components/phrase-slot-button/phrase-slot-button.component.spec.ts`

**Complejidad:** MEDIA
**Tests requeridos:** 10-12 tests

```typescript
describe('PhraseSlotButtonComponent', () => {
  let component: PhraseSlotButtonComponent;
  let fixture: ComponentFixture<PhraseSlotButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhraseSlotButtonComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(PhraseSlotButtonComponent);
    component = fixture.componentInstance;
    
    component.slotNumber = 0;
    component.phrase = { text: 'Hello', imageUrl: null };
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create');
    it('should display slot number');
    it('should display phrase text');
  });

  describe('Press & Hold Interaction', () => {
    it('should emit speakPhrase on press-hold completion');
    it('should emit editPhrase on short press');
    it('should show visual feedback during hold');
  });

  describe('Empty Slot Handling', () => {
    it('should show "Empty slot" message when no phrase');
    it('should emit addPhrase on empty slot click');
  });

  describe('Image Display', () => {
    it('should display phrase image if provided');
    it('should show text-only if no image');
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label with slot number');
    it('should announce phrase on focus');
    it('should be keyboard navigable');
  });

  describe('Visual Customization', () => {
    it('should apply custom colors from config');
    it('should respect size configuration');
  });
});
```

**Cobertura objetivo:** ≥ 75%

---

### 5.5 TextInputSectionComponent (P1 - Día 3)
**Archivo:** `src/app/pages/write/components/text-input-section/text-input-section.component.spec.ts`

**Complejidad:** MEDIA
**Tests requeridos:** 8-10 tests

```typescript
describe('TextInputSectionComponent', () => {
  let component: TextInputSectionComponent;
  let fixture: ComponentFixture<TextInputSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputSectionComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(TextInputSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create');
    it('should display empty text area');
  });

  describe('Text Display', () => {
    it('should display input text from parent');
    it('should update when text changes');
    it('should handle long text with scrolling');
  });

  describe('Text Area Interaction', () => {
    it('should be focusable');
    it('should allow direct text editing if enabled');
    it('should be readonly by default');
  });

  describe('Visual Feedback', () => {
    it('should show placeholder when empty');
    it('should adjust font size for readability');
    it('should apply high contrast styles');
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label');
    it('should announce text changes to screen readers');
    it('should maintain focus when text updates');
  });
});
```

**Cobertura objetivo:** ≥ 75%

---

### 5.6 ActionButtonsSectionComponent (P1 - Día 3)
**Archivo:** `src/app/pages/write/components/action-buttons-section/action-buttons-section.component.spec.ts`

**Complejidad:** MEDIA
**Tests requeridos:** 8-10 tests

```typescript
describe('ActionButtonsSectionComponent', () => {
  let component: ActionButtonsSectionComponent;
  let fixture: ComponentFixture<ActionButtonsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionButtonsSectionComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionButtonsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create');
    it('should display all action buttons');
  });

  describe('Action Button Events', () => {
    it('should emit speakText event');
    it('should emit clearText event');
    it('should emit backspace event');
    it('should emit toggleView event');
  });

  describe('Press-Hold Buttons', () => {
    it('should use PressHoldButtonComponent for actions');
    it('should complete action after hold duration');
    it('should cancel on early release');
  });

  describe('Button States', () => {
    it('should disable speak button when text is empty');
    it('should disable backspace when text is empty');
    it('should enable all buttons when text exists');
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all buttons');
    it('should announce button purpose on focus');
    it('should be keyboard accessible');
  });

  describe('Visual Layout', () => {
    it('should arrange buttons in accessible grid');
    it('should maintain touch target sizes (44x44px minimum)');
  });
});
```

**Cobertura objetivo:** ≥ 70%

---

## ✅ Checklist de Completitud

### Componente por Componente
- [ ] `letter-keyboard-section.component.spec.ts` - 12+ tests, ≥ 80%
- [ ] `letter-grid-view.component.spec.ts` - 10+ tests, ≥ 80%
- [ ] `letter-carousel-view.component.spec.ts` - 10+ tests, ≥ 75%
- [ ] `phrase-slot-button.component.spec.ts` - 10+ tests, ≥ 75%
- [ ] `text-input-section.component.spec.ts` - 8+ tests, ≥ 75%
- [ ] `action-buttons-section.component.spec.ts` - 8+ tests, ≥ 70%

### Validaciones Globales
- [ ] Navegación por teclado validada
- [ ] Eventos padre-hijo testeados
- [ ] Estados visuales verificados
- [ ] Integración con componentes compartidos validada

---

## 📊 Validación de Progreso

**Después de cada componente:**
```bash
npm test -- --include="**/pages/**/components/**/*.spec.ts" --code-coverage
```

**Al final de la fase:**
```bash
npm test -- --no-watch --code-coverage --browsers=ChromeHeadless
```

**Resultado esperado:**
- Cobertura global: ~85%
- Cobertura en page components: ≥ 75%
- Tests pasando: 100%

---

## 🎯 Entregables

1. ✅ 6 archivos .spec.ts creados
2. ✅ 58-71 tests implementados
3. ✅ Cobertura global ≥ 85%
4. ✅ Cobertura page components ≥ 75%

---

## 🚨 Problemas Potenciales

### Problema 1: Swiper no se inicializa en tests
**Solución:** Mockear Swiper o usar `NO_ERRORS_SCHEMA`

### Problema 2: Eventos @Output no se emiten
**Solución:** Usar `spyOn(component.eventName, 'emit')` y verificar

### Problema 3: Grid navigation tests fallan
**Solución:** Verificar que `gridColumns` esté configurado correctamente

---

## 📚 Referencias

- [Component Testing](../context/testing-context.md)
- [Event Emitter Testing](https://angular.io/guide/testing-components-scenarios#component-with-output)
- [Keyboard Event Testing](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)

---

## ➡️ Siguiente Fase

Una vez completada esta fase, continuar con:
**[FASE 6: Tests de Application Services](./fase-6-application-services.md)**
