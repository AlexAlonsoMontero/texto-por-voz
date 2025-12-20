# 📋 FASE 1: Arreglar Infraestructura de Testing

## 🎯 Objetivo
Establecer la base para todos los tests del proyecto, creando utilities reutilizables y arreglando los tests existentes que actualmente fallan.

## ⏱️ Duración Estimada
**1 día (6-8 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~9%
- **Final esperado:** ~15%
- **Tests a crear:** 5-7 tests
- **Tests a arreglar:** 2 tests

---

## 🔧 Tareas Detalladas

### 1.1 Crear Test Utilities Base
**Archivo:** `src/testing/test-utils.ts`

**Contenido necesario:**
```typescript
import { ITextToSpeechService } from '@core/domain/interfaces/text-to-speech.interface';
import { IThemeService } from '@core/domain/interfaces/theme.interface';
import { IOrientationService } from '@core/domain/interfaces/orientation.interface';
import { ISafeAreaService } from '@core/domain/interfaces/safe-area.interface';
import { IPressHoldButtonService } from '@core/domain/interfaces/press-hold-button.interface';
import { IPhraseStoreService } from '@core/domain/interfaces/phrase-store.interface';
import { IGalleryService } from '@core/domain/interfaces/gallery.interface';
import { IPhraseButtonConfigService } from '@core/domain/interfaces/phrase-button-config.interface';

/**
 * Mock para ITextToSpeechService
 */
export function createMockTTSService(): jasmine.SpyObj<ITextToSpeechService> {
  return jasmine.createSpyObj('ITextToSpeechService', [
    'speak',
    'stop',
    'isSupported',
    'getVoices',
    'setVoice',
    'setRate',
    'setPitch',
  ]);
}

/**
 * Mock para IThemeService
 */
export function createMockThemeService(): jasmine.SpyObj<IThemeService> {
  return jasmine.createSpyObj('IThemeService', [
    'applyTheme',
    'getCurrentTheme',
    'getDefaultTheme',
    'validateContrast',
  ]);
}

/**
 * Mock para IOrientationService
 */
export function createMockOrientationService(): jasmine.SpyObj<IOrientationService> {
  return jasmine.createSpyObj('IOrientationService', [
    'lock',
    'unlock',
    'getCurrentOrientation',
  ]);
}

/**
 * Mock para ISafeAreaService
 */
export function createMockSafeAreaService(): jasmine.SpyObj<ISafeAreaService> {
  return jasmine.createSpyObj('ISafeAreaService', [
    'getSafeAreaInsets',
    'getStatusBarHeight',
  ]);
}

/**
 * Mock para IPressHoldButtonService
 */
export function createMockPressHoldButtonService(): jasmine.SpyObj<IPressHoldButtonService> {
  return jasmine.createSpyObj('IPressHoldButtonService', [
    'getConfig',
    'updateConfig',
    'resetToDefaults',
  ]);
}

/**
 * Mock para IPhraseStoreService
 */
export function createMockPhraseStoreService(): jasmine.SpyObj<IPhraseStoreService> {
  return jasmine.createSpyObj('IPhraseStoreService', [
    'savePhrase',
    'getPhrase',
    'getAllPhrases',
    'deletePhrase',
    'clearAll',
  ]);
}

/**
 * Mock para IGalleryService
 */
export function createMockGalleryService(): jasmine.SpyObj<IGalleryService> {
  return jasmine.createSpyObj('IGalleryService', [
    'pickImage',
    'pickMultipleImages',
    'requestPermissions',
  ]);
}

/**
 * Mock para IPhraseButtonConfigService
 */
export function createMockPhraseButtonConfigService(): jasmine.SpyObj<IPhraseButtonConfigService> {
  return jasmine.createSpyObj('IPhraseButtonConfigService', [
    'getConfig',
    'updateConfig',
    'resetConfig',
  ]);
}
```

**Criterios de aceptación:**
- ✅ Todos los servicios del core tienen mock factory
- ✅ Mocks incluyen todos los métodos de las interfaces
- ✅ Tipado fuerte con jasmine.SpyObj

---

### 1.2 Crear Providers Mock Centralizados
**Archivo:** `src/testing/providers.mock.ts`

**Contenido necesario:**
```typescript
import { Provider } from '@angular/core';
import {
  TEXT_TO_SPEECH_SERVICE,
  THEME_SERVICE,
  ORIENTATION_SERVICE,
  SAFE_AREA_SERVICE,
  PRESS_HOLD_BUTTON_SERVICE,
  PHRASE_STORE_SERVICE,
  GALLERY_SERVICE,
  PHRASE_BUTTON_CONFIG_SERVICE,
} from '@core/infrastructure/injection-tokens';
import {
  createMockTTSService,
  createMockThemeService,
  createMockOrientationService,
  createMockSafeAreaService,
  createMockPressHoldButtonService,
  createMockPhraseStoreService,
  createMockGalleryService,
  createMockPhraseButtonConfigService,
} from './test-utils';

/**
 * Providers para tests con todos los servicios mockeados
 * Usar en TestBed.configureTestingModule({ providers: [...TEST_PROVIDERS] })
 */
export const TEST_PROVIDERS: Provider[] = [
  { provide: TEXT_TO_SPEECH_SERVICE, useValue: createMockTTSService() },
  { provide: THEME_SERVICE, useValue: createMockThemeService() },
  { provide: ORIENTATION_SERVICE, useValue: createMockOrientationService() },
  { provide: SAFE_AREA_SERVICE, useValue: createMockSafeAreaService() },
  { provide: PRESS_HOLD_BUTTON_SERVICE, useValue: createMockPressHoldButtonService() },
  { provide: PHRASE_STORE_SERVICE, useValue: createMockPhraseStoreService() },
  { provide: GALLERY_SERVICE, useValue: createMockGalleryService() },
  { provide: PHRASE_BUTTON_CONFIG_SERVICE, useValue: createMockPhraseButtonConfigService() },
];

/**
 * Helper para crear providers customizados
 */
export function createTestProvidersWithOverrides(overrides: Partial<{
  tts: any;
  theme: any;
  orientation: any;
  safeArea: any;
  pressHold: any;
  phraseStore: any;
  gallery: any;
  phraseButtonConfig: any;
}>): Provider[] {
  return [
    { provide: TEXT_TO_SPEECH_SERVICE, useValue: overrides.tts || createMockTTSService() },
    { provide: THEME_SERVICE, useValue: overrides.theme || createMockThemeService() },
    { provide: ORIENTATION_SERVICE, useValue: overrides.orientation || createMockOrientationService() },
    { provide: SAFE_AREA_SERVICE, useValue: overrides.safeArea || createMockSafeAreaService() },
    { provide: PRESS_HOLD_BUTTON_SERVICE, useValue: overrides.pressHold || createMockPressHoldButtonService() },
    { provide: PHRASE_STORE_SERVICE, useValue: overrides.phraseStore || createMockPhraseStoreService() },
    { provide: GALLERY_SERVICE, useValue: overrides.gallery || createMockGalleryService() },
    { provide: PHRASE_BUTTON_CONFIG_SERVICE, useValue: overrides.phraseButtonConfig || createMockPhraseButtonConfigService() },
  ];
}
```

**Criterios de aceptación:**
- ✅ Array TEST_PROVIDERS exportado
- ✅ Función helper para overrides customizados
- ✅ Todos los InjectionTokens cubiertos

---

### 1.3 Crear Barrel Export para Testing
**Archivo:** `src/testing/index.ts`

**Contenido:**
```typescript
export * from './test-utils';
export * from './providers.mock';
```

---

### 1.4 Arreglar app.component.spec.ts
**Archivo:** `src/app/app.component.spec.ts`

**Cambios necesarios:**
```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { TEST_PROVIDERS } from '../testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        ...TEST_PROVIDERS
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have ion-app element', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('ion-app')).toBeTruthy();
  });

  it('should have ion-router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('ion-router-outlet')).toBeTruthy();
  });
});
```

**Tests a agregar:**
- ✅ should create the app
- ✅ should have ion-app element
- ✅ should have ion-router-outlet

---

### 1.5 Arreglar home.page.spec.ts
**Archivo:** `src/app/home/home.page.spec.ts`

**Cambios necesarios:**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { TEST_PROVIDERS } from '../../testing';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have ion-header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('ion-header')).toBeTruthy();
  });

  it('should have ion-content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('ion-content')).toBeTruthy();
  });
});
```

**Tests a agregar:**
- ✅ should create
- ✅ should have ion-header
- ✅ should have ion-content

---

### 1.6 Actualizar tsconfig para paths de testing
**Archivo:** `tsconfig.json`

**Agregar en compilerOptions.paths:**
```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@testing/*": ["src/testing/*"]
    }
  }
}
```

---

### 1.7 Validar que tests pasen
**Comando:**
```bash
npm test -- --no-watch --code-coverage --browsers=ChromeHeadless
```

**Resultado esperado:**
```
Chrome Headless: Executed 5 of 5 SUCCESS
Coverage: ~15%
```

---

## ✅ Checklist de Completitud

- [ ] Archivo `src/testing/test-utils.ts` creado con 8 mock factories
- [ ] Archivo `src/testing/providers.mock.ts` creado con TEST_PROVIDERS
- [ ] Archivo `src/testing/index.ts` creado como barrel export
- [ ] `app.component.spec.ts` arreglado y con 3 tests pasando
- [ ] `home.page.spec.ts` arreglado y con 3 tests pasando
- [ ] `tsconfig.json` actualizado con path aliases
- [ ] Comando `npm test` ejecuta exitosamente
- [ ] Cobertura ≥ 15%
- [ ] 0 tests fallando

---

## 🎯 Entregables

1. ✅ Carpeta `/src/testing/` con utilities
2. ✅ 2 archivos spec arreglados
3. ✅ tsconfig.json actualizado
4. ✅ Reporte de cobertura mostrando ~15%

---

## 🚨 Problemas Potenciales

### Problema 1: Imports circulares
**Solución:** Usar path aliases completos, evitar imports relativos

### Problema 2: Tipos no coinciden con interfaces
**Solución:** Revisar que los mocks incluyan TODOS los métodos de las interfaces

### Problema 3: Tests aún fallan después de agregar providers
**Solución:** Verificar que el componente no tenga dependencias adicionales no mockeadas

---

## 📚 Referencias

- [Jasmine SpyObj](https://jasmine.github.io/api/edge/jasmine.html#.SpyObj)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Testing Context del Proyecto](../context/testing-context.md)

---

## ➡️ Siguiente Fase

Una vez completada esta fase, continuar con:
**[FASE 2: Tests de Core Services](./fase-2-core-services.md)**
