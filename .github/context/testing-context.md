# 🧪 Contexto de Testing - Estrategias y Patrones de Pruebas

## 🎯 Filosofía de Testing

### Principios de Pruebas para Accesibilidad

1. **Testing con tecnologías asistivas** - Lectores de pantalla, navegación por teclado
2. **Testing de contraste y visibilidad** - Validar ratios WCAG
3. **Testing de flujos TTS** - Verificar retroalimentación por voz
4. **Testing híbrido** - Web y móvil con mismo código
5. **Testing de estados de carga** - Spinners, mensajes de estado

### Estrategia de Testing por Capas

```
Tests de Componente (70%) - UI, interacciones, accesibilidad
├── Renderizado correcto
├── Navegación por teclado
├── Estados aria-live
├── Integración TTS
└── Responsive design

Tests de Servicio (20%) - Lógica de negocio
├── Servicios híbridos web/móvil
├── Estados de inicialización
├── Manejo de errores
└── Persistencia de datos

Tests E2E (10%) - Flujos completos
├── Flujos de usuario con TTS
├── Cambio de temas
├── Navegación entre páginas
└── Funcionalidad en diferentes dispositivos
```

## 🔧 Configuración de Testing

### Jest + Angular Testing Utilities

```typescript
// jest.config.js
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/android/',
    '<rootDir>/ios/',
    '<rootDir>/capacitor/',
  ],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.module.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Setup para Testing de Accesibilidad

```typescript
// src/setup-jest.ts
import 'jest-preset-angular/setup-jest';
import { configure } from '@testing-library/angular';

// Configurar testing-library para accesibilidad
configure({
  testIdAttribute: 'data-testid',
  defaultHidden: true, // Ocultar elementos no accesibles por defecto
});

// Mock para Web Speech API
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: jest.fn(),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    getVoices: jest.fn(() => []),
  },
});

// Mock para Capacitor
jest.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: jest.fn(() => false),
    getPlatform: jest.fn(() => 'web'),
  },
}));
```

## 🧪 Patrones de Testing de Componentes

### Test Base para Componentes Accesibles

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { screen, fireEvent } from '@testing-library/angular';
import { ITextToSpeechService } from '@core/domain/interfaces';
import { TEXT_TO_SPEECH_SERVICE } from '@core/infrastructure/injection-tokens';

describe('AccessibleComponent', () => {
  let component: AccessibleComponent;
  let fixture: ComponentFixture<AccessibleComponent>;
  let mockTtsService: jasmine.SpyObj<ITextToSpeechService>;

  beforeEach(async () => {
    mockTtsService = jasmine.createSpyObj('ITextToSpeechService', ['speak', 'stop', 'isSupported', 'getVoices']);

    await TestBed.configureTestingModule({
      imports: [AccessibleComponent],
      providers: [{ provide: TEXT_TO_SPEECH_SERVICE, useValue: mockTtsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Accesibilidad', () => {
    it('should have proper ARIA labels', () => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toBeTruthy();
    });

    it('should be keyboard navigable', () => {
      const button = screen.getByRole('button');

      button.focus();
      expect(document.activeElement).toBe(button);

      fireEvent.keyDown(button, { key: 'Enter' });
      expect(mockTtsService.speak).toHaveBeenCalled();
    });

    it('should provide TTS feedback on actions', async () => {
      mockTtsService.speak.and.returnValue(Promise.resolve());

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await fixture.whenStable();

      expect(mockTtsService.speak).toHaveBeenCalledWith(jasmine.stringMatching(/.+/), jasmine.any(Object));
    });

    it('should announce state changes via aria-live', () => {
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');

      component.updateStatus('Configuración guardada');
      fixture.detectChanges();

      expect(liveRegion).toHaveTextContent('Configuración guardada');
    });
  });

  describe('Contraste y Visibilidad', () => {
    it('should use theme variables for colors', () => {
      const element = fixture.debugElement.query(By.css('.themed-element'));
      const computedStyle = getComputedStyle(element.nativeElement);

      expect(computedStyle.backgroundColor).toContain('var(--ion-color-primary)');
      expect(computedStyle.color).toContain('var(--ion-text-color)');
    });

    it('should maintain minimum contrast ratio', () => {
      // Test usando herramienta de contraste (implementar según necesidad)
      const element = fixture.debugElement.query(By.css('.text-element'));
      const contrast = calculateContrastRatio(element.nativeElement);

      expect(contrast).toBeGreaterThanOrEqual(7); // WCAG AAA
    });
  });
});
```

### Testing del Componente Press-Hold Button

```typescript
describe('PressHoldButtonComponent', () => {
  let component: PressHoldButtonComponent;
  let fixture: ComponentFixture<PressHoldButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressHoldButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PressHoldButtonComponent);
    component = fixture.componentInstance;

    component.buttonId = 'test-button';
    component.holdDuration = 1000; // Reducir para tests
    component.ariaLabel = 'Test action button';

    fixture.detectChanges();
  });

  describe('Press-Hold Functionality', () => {
    it('should emit actionExecuted after hold duration', fakeAsync(() => {
      let actionExecuted = false;
      component.actionExecuted.subscribe(() => (actionExecuted = true));

      const button = screen.getByRole('button');

      fireEvent.mouseDown(button);
      tick(999); // Justo antes del tiempo
      expect(actionExecuted).toBeFalse();

      tick(2); // Completar el tiempo
      expect(actionExecuted).toBeTrue();
    }));

    it('should cancel action if released early', fakeAsync(() => {
      let actionExecuted = false;
      let pressCancelled = false;

      component.actionExecuted.subscribe(() => (actionExecuted = true));
      component.pressCancelled.subscribe(() => (pressCancelled = true));

      const button = screen.getByRole('button');

      fireEvent.mouseDown(button);
      tick(500); // Mitad del tiempo
      fireEvent.mouseUp(button);
      tick(600); // Completar tiempo original

      expect(actionExecuted).toBeFalse();
      expect(pressCancelled).toBeTrue();
    }));

    it('should work with keyboard events', fakeAsync(() => {
      let actionExecuted = false;
      component.actionExecuted.subscribe(() => (actionExecuted = true));

      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: ' ' }); // Space key
      tick(1001);

      expect(actionExecuted).toBeTrue();
    }));
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA attributes', () => {
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-label', 'Test action button');
      expect(button).toHaveAttribute('aria-describedby');
    });

    it('should show visual progress during hold', fakeAsync(() => {
      const button = screen.getByRole('button');
      const progressIndicator = fixture.debugElement.query(By.css('.progress-indicator'));

      fireEvent.mouseDown(button);
      tick(500);
      fixture.detectChanges();

      expect(progressIndicator.nativeElement.style.width).toContain('50%');
    }));
  });
});
```

## 🔌 Testing de Servicios Híbridos

### Test para TextToSpeechService

```typescript
describe('HybridTextToSpeechService', () => {
  let service: HybridTextToSpeechService;
  let mockCapacitor: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HybridTextToSpeechService],
    });

    service = TestBed.inject(HybridTextToSpeechService);
    mockCapacitor = jasmine.createSpy().and.returnValue(false);

    // Mock Capacitor global
    (window as any).Capacitor = {
      isNativePlatform: mockCapacitor,
    };
  });

  describe('Web Platform', () => {
    beforeEach(() => {
      mockCapacitor.and.returnValue(false);
    });

    it('should use Web Speech API on web platform', async () => {
      const mockUtterance = jasmine.createSpy();
      const mockSpeak = jasmine.createSpy();

      (window as any).SpeechSynthesisUtterance = mockUtterance;
      (window as any).speechSynthesis = { speak: mockSpeak };

      await service.speak('Test message');

      expect(mockUtterance).toHaveBeenCalledWith('Test message');
      expect(mockSpeak).toHaveBeenCalled();
    });

    it('should handle Web Speech API unavailable', async () => {
      delete (window as any).speechSynthesis;

      await expectAsync(service.speak('Test')).toBeRejectedWithError('Speech synthesis no soportado');
    });
  });

  describe('Native Platform', () => {
    beforeEach(() => {
      mockCapacitor.and.returnValue(true);
    });

    it('should use Capacitor TTS on native platform', async () => {
      const mockTTS = {
        speak: jasmine.createSpy().and.returnValue(Promise.resolve()),
      };

      // Mock dynamic import
      spyOn(service as any, 'importCapacitorTTS').and.returnValue(Promise.resolve({ TextToSpeech: mockTTS }));

      await service.speak('Native test', { lang: 'en-US', rate: 1.2 });

      expect(mockTTS.speak).toHaveBeenCalledWith({
        text: 'Native test',
        lang: 'en-US',
        rate: 1.2,
        pitch: 1.0,
        volume: 1.0,
      });
    });
  });

  describe('Service State Management', () => {
    it('should initialize properly', async () => {
      expect(service.getState()).toBe(ServiceState.UNINITIALIZED);

      await service.initialize();

      expect(service.getState()).toBe(ServiceState.READY);
      expect(service.isReady()).toBeTrue();
    });

    it('should handle initialization errors', async () => {
      spyOn(service as any, 'performInitialization').and.returnValue(Promise.reject(new Error('Init failed')));

      await expectAsync(service.initialize()).toBeRejectedWithError('Init failed');

      expect(service.getState()).toBe(ServiceState.ERROR);
      expect(service.isReady()).toBeFalse();
    });
  });
});
```

### Testing del ThemeService

```typescript
describe('ThemeService', () => {
  let service: ThemeService;
  let mockDocument: jasmine.SpyObj<Document>;

  beforeEach(() => {
    const mockDocumentElement = jasmine.createSpyObj('HTMLElement', [], {
      style: jasmine.createSpyObj('CSSStyleDeclaration', ['setProperty']),
    });

    mockDocument = jasmine.createSpyObj('Document', [], {
      documentElement: mockDocumentElement,
    });

    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: Document, useValue: mockDocument }],
    });

    service = TestBed.inject(ThemeService);
  });

  describe('Theme Application', () => {
    it('should apply theme colors to CSS variables', () => {
      const testColors: ThemeColors = {
        primary: '#ff0000',
        secondary: '#00ff00',
        background: '#ffffff',
        text: '#000000',
      };

      service.applyTheme(testColors);

      const setPropertySpy = mockDocument.documentElement.style.setProperty as jasmine.Spy;

      expect(setPropertySpy).toHaveBeenCalledWith('--ion-color-primary', '#ff0000');
      expect(setPropertySpy).toHaveBeenCalledWith('--ion-color-secondary', '#00ff00');
      expect(setPropertySpy).toHaveBeenCalledWith('--ion-background-color', '#ffffff');
      expect(setPropertySpy).toHaveBeenCalledWith('--ion-text-color', '#000000');
    });

    it('should generate proper RGB values for Ionic variables', () => {
      const colors: ThemeColors = {
        primary: '#ff0000',
        secondary: '#00ff00',
        background: '#ffffff',
        text: '#000000',
      };

      service.applyTheme(colors);

      const setPropertySpy = mockDocument.documentElement.style.setProperty as jasmine.Spy;

      expect(setPropertySpy).toHaveBeenCalledWith('--ion-color-primary-rgb', '255,0,0');
      expect(setPropertySpy).toHaveBeenCalledWith('--ion-color-secondary-rgb', '0,255,0');
    });
  });

  describe('Color Validation', () => {
    it('should validate contrast ratios', () => {
      const lowContrastColors: ThemeColors = {
        primary: '#ffff00',
        secondary: '#ffffff',
        background: '#ffffcc',
        text: '#cccccc',
      };

      const isValid = service.validateAccessibility(lowContrastColors);

      expect(isValid.hasValidContrast).toBeFalse();
      expect(isValid.contrastRatio).toBeLessThan(7);
    });

    it('should pass high contrast colors', () => {
      const highContrastColors: ThemeColors = {
        primary: '#0066cc',
        secondary: '#004499',
        background: '#ffffff',
        text: '#000000',
      };

      const isValid = service.validateAccessibility(highContrastColors);

      expect(isValid.hasValidContrast).toBeTrue();
      expect(isValid.contrastRatio).toBeGreaterThanOrEqual(7);
    });
  });
});
```

## 🌐 Tests E2E con Cypress

### Setup para Tests E2E

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      activateTTS(): Chainable<void>;
      checkAccessibility(): Chainable<void>;
      testKeyboardNavigation(): Chainable<void>;
      changeTheme(colors: ThemeColors): Chainable<void>;
    }
  }
}

Cypress.Commands.add('activateTTS', () => {
  cy.window().then((win) => {
    win.speechSynthesis = {
      speak: cy.stub(),
      cancel: cy.stub(),
      pause: cy.stub(),
      resume: cy.stub(),
      getVoices: cy.stub().returns([]),
    };
  });
});

Cypress.Commands.add('checkAccessibility', () => {
  cy.injectAxe();
  cy.checkA11y(null, {
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'aria-labels': { enabled: true },
    },
  });
});

Cypress.Commands.add('testKeyboardNavigation', () => {
  cy.get('body').tab(); // Primera tabulación
  cy.focused().should('be.visible');

  cy.get('body').tab({ shift: true }); // Shift+Tab
  cy.focused().should('be.visible');
});
```

### Test E2E de Flujo Completo

```typescript
// cypress/e2e/accessibility-flow.cy.ts
describe('Accessibility Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.activateTTS();
  });

  it('should complete full TTS activation and usage flow', () => {
    // Verificar modal de activación TTS en web
    cy.get('[data-testid="tts-activation-modal"]').should('be.visible');
    cy.get('[data-testid="activate-tts-button"]').click();

    // Verificar que TTS se activó
    cy.get('[data-testid="tts-activation-modal"]').should('not.exist');

    // Navegar a configuración
    cy.get('[data-testid="settings-button"]').click();

    // Cambiar tema
    cy.get('[data-testid="theme-selector"]').select('high-contrast');

    // Verificar que tema se aplicó
    cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)');

    // Verificar accesibilidad en toda la página
    cy.checkAccessibility();
  });

  it('should navigate using only keyboard', () => {
    // Cerrar modal con teclado
    cy.get('[data-testid="activate-tts-button"]').focus().type('{enter}');

    // Navegar por todos los elementos interactivos
    cy.testKeyboardNavigation();

    // Activar función principal con teclado
    cy.get('[data-testid="main-action-button"]').focus().type('{enter}');

    // Verificar feedback
    cy.get('[data-testid="status-message"]').should('contain', 'Acción completada');
  });

  it('should work on mobile viewport', () => {
    cy.viewport('iphone-x');

    // Activar TTS
    cy.get('[data-testid="activate-tts-button"]').click();

    // Test touch gestures
    cy.get('[data-testid="press-hold-button"]').trigger('touchstart').wait(3000).trigger('touchend');

    // Verificar acción ejecutada
    cy.get('[data-testid="action-result"]').should('be.visible');
  });
});
```

## 📊 Métricas de Calidad

### Cobertura de Código

```typescript
// jest.config.js - Configuración de cobertura
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  './src/app/core/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90,
  },
  './src/app/shared/components/': {
    branches: 85,
    functions: 85,
    lines: 85,
    statements: 85,
  },
},
```

### Métricas de Accesibilidad

```typescript
// Herramientas de medición automática
const accessibilityMetrics = {
  contrastRatio: 'minimum 7:1 (WCAG AAA)',
  keyboardNavigation: '100% coverage',
  screenReaderCompatibility: 'NVDA, JAWS, VoiceOver',
  focusManagement: 'Logical tab order',
  ariaLabels: '100% coverage for interactive elements',
};
```

## 🚀 Scripts de Testing

### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:accessibility": "jest --testNamePattern=\"(accessibility|a11y)\"",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:all": "npm run test:coverage && npm run test:e2e",
    "test:ci": "jest --coverage --watchAll=false && cypress run --record"
  }
}
```

### Script para Validación Continua

```bash
#!/bin/bash
# scripts/test-accessibility.sh

echo "🧪 Ejecutando tests de accesibilidad..."

# Tests unitarios de accesibilidad
npm run test:accessibility

# Análisis de contraste automático
npm run analyze:contrast

# Tests E2E con validación a11y
npm run test:e2e -- --spec "cypress/e2e/**/accessibility-*.cy.ts"

# Generar reporte
npm run report:accessibility

echo "✅ Tests de accesibilidad completados"
```

## 📋 Checklist de Testing

### Para Cada Componente

- [ ] Tests de renderizado básico
- [ ] Tests de props/inputs
- [ ] Tests de eventos/outputs
- [ ] Tests de navegación por teclado
- [ ] Tests de ARIA labels y roles
- [ ] Tests de integración TTS
- [ ] Tests de responsive design
- [ ] Tests de estados de carga/error

### Para Cada Servicio

- [ ] Tests de inicialización
- [ ] Tests de métodos públicos
- [ ] Tests de manejo de errores
- [ ] Tests de detección de plataforma
- [ ] Tests de estados del servicio
- [ ] Tests de persistencia (si aplica)
- [ ] Mocks de dependencias externas

### Para Flujos E2E

- [ ] Flujo completo de usuario
- [ ] Navegación entre páginas
- [ ] Activación y uso de TTS
- [ ] Cambio de temas
- [ ] Funcionalidad en móvil
- [ ] Validación de accesibilidad
- [ ] Performance bajo carga
