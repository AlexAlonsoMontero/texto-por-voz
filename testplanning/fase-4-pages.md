# 📋 FASE 4: Tests de Páginas

## 🎯 Objetivo
Alcanzar 70% de cobertura en las páginas principales de la aplicación (`/pages/*.page.ts`), validando flujos de usuario y lógica de presentación.

## ⏱️ Duración Estimada
**2 días (16 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~65%
- **Final esperado:** ~75%
- **Tests a crear:** 40-47 tests
- **Páginas a testear:** 4 páginas

---

## 🎯 Prioridades

### P0 - Crítico (Día 1)
- `write.page.ts` - Página principal de funcionalidad

### P1 - Alto (Día 2)
- `phrases.page.ts` - Gestión de frases guardadas
- `settings.page.ts` - Configuración crucial para accesibilidad

### P2 - Medio (Día 2)
- `home.page.ts` - Página de entrada (ya tiene test base)

---

## 🔧 Tareas Detalladas

### 4.1 WritePage (P0 - Día 1)
**Archivo:** `src/app/pages/write/write.page.spec.ts`

**Complejidad:** ALTA
**Tests requeridos:** 12-15 tests

#### Template de Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritePage } from './write.page';
import { TEST_PROVIDERS, createMockTTSService, createMockOrientationService } from '@testing';
import { TEXT_TO_SPEECH_SERVICE, ORIENTATION_SERVICE } from '@core/infrastructure/injection-tokens';

describe('WritePage', () => {
  let component: WritePage;
  let fixture: ComponentFixture<WritePage>;
  let mockTtsService: jasmine.SpyObj<ITextToSpeechService>;
  let mockOrientationService: jasmine.SpyObj<IOrientationService>;

  beforeEach(async () => {
    mockTtsService = createMockTTSService();
    mockOrientationService = createMockOrientationService();
    
    mockTtsService.speak.and.returnValue(Promise.resolve());
    mockOrientationService.lock.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [WritePage],
      providers: [
        { provide: TEXT_TO_SPEECH_SERVICE, useValue: mockTtsService },
        { provide: ORIENTATION_SERVICE, useValue: mockOrientationService },
        ...TEST_PROVIDERS
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WritePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty text', () => {
      expect(component.currentText).toBe('');
    });

    it('should lock orientation to landscape on mobile', () => {
      // Simular plataforma móvil
      component.ngOnInit();
      expect(mockOrientationService.lock).toHaveBeenCalledWith('landscape');
    });

    it('should have default view mode (grid or carousel)', () => {
      expect(component.viewMode).toBeDefined();
      expect(['grid', 'carousel']).toContain(component.viewMode);
    });
  });

  describe('Text Input Management', () => {
    it('should update currentText when letter is added', () => {
      component.onLetterSelected('A');
      expect(component.currentText).toBe('A');
    });

    it('should append multiple letters', () => {
      component.onLetterSelected('H');
      component.onLetterSelected('O');
      component.onLetterSelected('L');
      component.onLetterSelected('A');
      expect(component.currentText).toBe('HOLA');
    });

    it('should handle space character', () => {
      component.onLetterSelected('H');
      component.onLetterSelected('I');
      component.onLetterSelected(' ');
      component.onLetterSelected('!');
      expect(component.currentText).toBe('HI !');
    });

    it('should clear text when clear button is pressed', () => {
      component.currentText = 'Test text';
      component.onClearText();
      expect(component.currentText).toBe('');
    });

    it('should delete last character on backspace', () => {
      component.currentText = 'HOLA';
      component.onBackspace();
      expect(component.currentText).toBe('HOL');
    });
  });

  describe('Text-to-Speech Integration', () => {
    it('should speak text when speak button is pressed', async () => {
      component.currentText = 'Hello world';
      await component.onSpeakText();
      
      expect(mockTtsService.speak).toHaveBeenCalledWith(
        'Hello world',
        jasmine.any(Object)
      );
    });

    it('should not speak empty text', async () => {
      component.currentText = '';
      await component.onSpeakText();
      
      expect(mockTtsService.speak).not.toHaveBeenCalled();
    });

    it('should handle TTS errors gracefully', async () => {
      mockTtsService.speak.and.returnValue(Promise.reject(new Error('TTS failed')));
      component.currentText = 'Test';
      
      await expectAsync(component.onSpeakText()).toBeResolved();
    });
  });

  describe('View Mode Toggle', () => {
    it('should toggle between grid and carousel view', () => {
      const initialMode = component.viewMode;
      component.toggleViewMode();
      
      expect(component.viewMode).not.toBe(initialMode);
      expect(['grid', 'carousel']).toContain(component.viewMode);
    });

    it('should persist view mode preference', () => {
      component.toggleViewMode();
      // Verificar que se guardó en storage
      expect(component.viewMode).toBeDefined();
    });
  });

  describe('Action Buttons', () => {
    it('should have action buttons section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-action-buttons-section')).toBeTruthy();
    });

    it('should have text input section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-text-input-section')).toBeTruthy();
    });

    it('should have letter keyboard section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-letter-keyboard-section')).toBeTruthy();
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should unlock orientation on destroy', () => {
      component.ngOnDestroy();
      expect(mockOrientationService.unlock).toHaveBeenCalled();
    });

    it('should stop TTS on destroy', () => {
      component.ngOnDestroy();
      expect(mockTtsService.stop).toHaveBeenCalled();
    });
  });
});
```

**Cobertura objetivo:** ≥ 75%

---

### 4.2 PhrasesPage (P1 - Día 2)
**Archivo:** `src/app/pages/phrases/phrases.page.spec.ts`

**Complejidad:** MEDIA
**Tests requeridos:** 10-12 tests

```typescript
describe('PhrasesPage', () => {
  let component: PhrasesPage;
  let fixture: ComponentFixture<PhrasesPage>;
  let mockPhraseStoreService: jasmine.SpyObj<IPhraseStoreService>;
  let mockTtsService: jasmine.SpyObj<ITextToSpeechService>;

  beforeEach(async () => {
    mockPhraseStoreService = createMockPhraseStoreService();
    mockTtsService = createMockTTSService();
    
    mockPhraseStoreService.getAllPhrases.and.returnValue(Promise.resolve([]));

    await TestBed.configureTestingModule({
      imports: [PhrasesPage],
      providers: [
        { provide: PHRASE_STORE_SERVICE, useValue: mockPhraseStoreService },
        { provide: TEXT_TO_SPEECH_SERVICE, useValue: mockTtsService },
        ...TEST_PROVIDERS
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PhrasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create');
    it('should load saved phrases on init');
    it('should display 12 phrase slots');
  });

  describe('Phrase Management', () => {
    it('should save phrase to slot');
    it('should load phrase from slot');
    it('should delete phrase from slot');
    it('should show empty slot message when no phrase');
  });

  describe('TTS Integration', () => {
    it('should speak phrase when button is pressed');
    it('should not speak empty slot');
    it('should announce slot number on focus');
  });

  describe('Phrase Editing', () => {
    it('should open edit modal for slot');
    it('should save edited phrase');
    it('should cancel edit without saving');
  });

  describe('Accessibility', () => {
    it('should navigate slots with keyboard');
    it('should announce current slot on navigation');
  });
});
```

**Cobertura objetivo:** ≥ 70%

---

### 4.3 SettingsPage (P1 - Día 2)
**Archivo:** `src/app/pages/settings/settings.page.spec.ts`

**Complejidad:** MEDIA
**Tests requeridos:** 10-12 tests

```typescript
describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let mockThemeService: jasmine.SpyObj<IThemeService>;
  let mockPressHoldService: jasmine.SpyObj<IPressHoldButtonService>;

  beforeEach(async () => {
    mockThemeService = createMockThemeService();
    mockPressHoldService = createMockPressHoldButtonService();
    
    mockThemeService.getCurrentTheme.and.returnValue({
      primary: '#0066cc',
      secondary: '#004499',
      background: '#ffffff',
      text: '#000000'
    });

    await TestBed.configureTestingModule({
      imports: [SettingsPage],
      providers: [
        { provide: THEME_SERVICE, useValue: mockThemeService },
        { provide: PRESS_HOLD_BUTTON_SERVICE, useValue: mockPressHoldService },
        ...TEST_PROVIDERS
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create');
    it('should load current theme settings');
    it('should load press-hold configuration');
  });

  describe('Theme Management', () => {
    it('should display color selectors');
    it('should update primary color');
    it('should update secondary color');
    it('should update background color');
    it('should update text color');
    it('should validate contrast when color changes');
    it('should prevent invalid contrast combinations');
  });

  describe('Press-Hold Configuration', () => {
    it('should display hold duration slider');
    it('should update hold duration');
    it('should toggle haptic feedback');
    it('should toggle visual feedback');
  });

  describe('Settings Persistence', () => {
    it('should save settings when changed');
    it('should load saved settings on init');
  });

  describe('Reset Functionality', () => {
    it('should reset theme to defaults');
    it('should reset press-hold config to defaults');
  });
});
```

**Cobertura objetivo:** ≥ 70%

---

### 4.4 HomePage (P2 - Día 2)
**Archivo:** `src/app/home/home.page.spec.ts` (MEJORAR EXISTENTE)

**Complejidad:** BAJA
**Tests requeridos:** 6-8 tests

```typescript
describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage, RouterTestingModule],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create');
    it('should have ion-header');
    it('should have ion-content');
  });

  describe('Navigation', () => {
    it('should navigate to write page');
    it('should navigate to phrases page');
    it('should navigate to settings page');
  });

  describe('Welcome Message', () => {
    it('should display welcome message');
    it('should announce welcome with TTS');
  });

  describe('Quick Actions', () => {
    it('should show quick action buttons');
  });
});
```

**Cobertura objetivo:** ≥ 65%

---

## ✅ Checklist de Completitud

### Página por Página
- [ ] `write.page.spec.ts` - 12+ tests, cobertura ≥ 75%
- [ ] `phrases.page.spec.ts` - 10+ tests, cobertura ≥ 70%
- [ ] `settings.page.spec.ts` - 10+ tests, cobertura ≥ 70%
- [ ] `home.page.spec.ts` - 6+ tests, cobertura ≥ 65%

### Validaciones por Página
- [ ] Lifecycle hooks testeados (ngOnInit, ngOnDestroy)
- [ ] Navegación validada
- [ ] Integración con servicios mockeados
- [ ] Estados de carga/error manejados
- [ ] Accesibilidad validada

---

## 📊 Validación de Progreso

**Después de cada página:**
```bash
npm test -- --include="**/pages/**/*.page.spec.ts" --code-coverage
```

**Al final de la fase:**
```bash
npm test -- --no-watch --code-coverage --browsers=ChromeHeadless
```

**Resultado esperado:**
- Cobertura global: ~75%
- Cobertura en `/pages/*.page.ts`: ≥ 70%
- Tests pasando: 100%

---

## 🎯 Entregables

1. ✅ 4 archivos .spec.ts creados/mejorados
2. ✅ 40-47 tests implementados
3. ✅ Cobertura global ≥ 75%
4. ✅ Cobertura pages ≥ 70%
5. ✅ Flujos de usuario validados

---

## 🚨 Problemas Potenciales

### Problema 1: Componentes hijos causan errores
**Solución:** Usar `NO_ERRORS_SCHEMA` temporalmente o importar componentes reales

### Problema 2: Router no inyecta correctamente
**Solución:** Usar `RouterTestingModule.withRoutes([])` en imports

### Problema 3: Lifecycle hooks no se ejecutan
**Solución:** Llamar explícitamente `fixture.detectChanges()` después de setup

### Problema 4: Async operations no completan
**Solución:** Usar `await fixture.whenStable()` o `fakeAsync/tick`

---

## 📚 Referencias

- [Testing Pages](../context/testing-context.md)
- [Router Testing](https://angular.io/guide/testing-components-scenarios#routing-component)
- [Lifecycle Hooks Testing](https://angular.io/guide/testing-components-scenarios#component-with-async-service)

---

## ➡️ Siguiente Fase

Una vez completada esta fase, continuar con:
**[FASE 5: Tests de Componentes de Páginas](./fase-5-page-components.md)**
