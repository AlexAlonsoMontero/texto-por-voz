# 📋 FASE 2: Tests de Core Services

## 🎯 Objetivo
Alcanzar 90% de cobertura en la capa de servicios del core, que contiene la lógica de negocio crítica y los servicios híbridos (web + móvil).

## ⏱️ Duración Estimada
**4-5 días (32-40 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~15%
- **Final esperado:** ~50%
- **Tests a crear:** 90-110 tests
- **Archivos a testear:** 11 servicios

---

## 🎯 Prioridades

### P0 - Crítico (Día 1-2)
- `hybrid-text-to-speech.service.ts` - Funcionalidad principal
- `theme.service.ts` - Accesibilidad crítica
- `press-hold-button.service.ts` - Accesibilidad motora

### P1 - Alto (Día 3-4)
- `phrase-store.service.ts` - Persistencia de datos
- `hybrid-orientation.service.ts` - UX móvil
- `hybrid-safe-area.service.ts` - Layout móvil
- `hybrid-gallery.service.ts` - Funcionalidad importante

### P2 - Medio (Día 5)
- `file-storage.service.ts`
- `phrase-button-config.service.ts`
- `carousel-config.service.ts`
- `write-view-config.service.ts`

---

## 🔧 Tareas Detalladas

### 2.1 HybridTextToSpeechService (P0)
**Archivo:** `src/app/core/infrastructure/services/hybrid-text-to-speech.service.spec.ts`

**Tests requeridos (12-15 tests):**

```typescript
describe('HybridTextToSpeechService', () => {
  let service: HybridTextToSpeechService;
  let capacitorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HybridTextToSpeechService]
    });
    
    service = TestBed.inject(HybridTextToSpeechService);
    capacitorSpy = spyOnProperty(Capacitor, 'isNativePlatform');
  });

  describe('Platform Detection', () => {
    it('should detect web platform');
    it('should detect native platform');
  });

  describe('Web Platform TTS', () => {
    it('should use Web Speech API on web');
    it('should handle speechSynthesis not available');
    it('should speak text with default options');
    it('should speak text with custom rate');
    it('should speak text with custom pitch');
    it('should stop current speech');
    it('should get available voices');
  });

  describe('Native Platform TTS', () => {
    it('should use Capacitor TTS on native');
    it('should handle Capacitor TTS unavailable');
    it('should speak text with native options');
    it('should cancel native speech');
  });

  describe('Error Handling', () => {
    it('should reject when TTS not supported');
    it('should handle speech errors gracefully');
  });
});
```

**Cobertura objetivo:** ≥ 95%

---

### 2.2 ThemeService (P0)
**Archivo:** `src/app/core/infrastructure/services/theme.service.spec.ts`

**Tests requeridos (10-12 tests):**

```typescript
describe('ThemeService', () => {
  let service: ThemeService;
  let documentElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    
    service = TestBed.inject(ThemeService);
    documentElement = document.documentElement;
  });

  describe('Theme Application', () => {
    it('should apply theme colors to CSS variables');
    it('should apply primary color');
    it('should apply secondary color');
    it('should apply background color');
    it('should apply text color');
    it('should convert hex to RGB for Ionic variables');
  });

  describe('Contrast Validation (WCAG AAA)', () => {
    it('should validate contrast ratio ≥ 7:1');
    it('should reject contrast ratio < 7:1');
    it('should calculate correct contrast ratio');
    it('should validate high contrast themes');
  });

  describe('Theme Persistence', () => {
    it('should save theme to preferences');
    it('should load saved theme on init');
  });
});
```

**Cobertura objetivo:** ≥ 95%

---

### 2.3 PressHoldButtonService (P0)
**Archivo:** `src/app/core/infrastructure/press-hold-button.service.spec.ts`

**Tests requeridos (10-12 tests):**

```typescript
describe('PressHoldButtonService', () => {
  let service: PressHoldButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PressHoldButtonService]
    });
    
    service = TestBed.inject(PressHoldButtonService);
  });

  describe('Configuration Management', () => {
    it('should return default config');
    it('should update hold duration');
    it('should update haptic feedback setting');
    it('should update visual feedback setting');
    it('should reset to defaults');
  });

  describe('Config Validation', () => {
    it('should validate min hold duration (500ms)');
    it('should validate max hold duration (10000ms)');
    it('should reject invalid config');
  });

  describe('Config Persistence', () => {
    it('should save config to preferences');
    it('should load saved config on init');
    it('should handle missing saved config');
  });
});
```

**Cobertura objetivo:** ≥ 90%

---

### 2.4 PhraseStoreService (P1)
**Archivo:** `src/app/core/infrastructure/services/phrase-store.service.spec.ts`

**Tests requeridos (8-10 tests):**

```typescript
describe('PhraseStoreService', () => {
  let service: PhraseStoreService;

  describe('CRUD Operations', () => {
    it('should save phrase to slot (0-11)');
    it('should get phrase from slot');
    it('should get all phrases');
    it('should delete phrase from slot');
    it('should clear all phrases');
  });

  describe('Slot Validation', () => {
    it('should reject slot < 0');
    it('should reject slot > 11');
  });

  describe('Persistence', () => {
    it('should persist phrases to Capacitor Preferences');
    it('should load phrases on init');
    it('should handle corrupted data');
  });
});
```

**Cobertura objetivo:** ≥ 90%

---

### 2.5 HybridOrientationService (P1)
**Archivo:** `src/app/core/infrastructure/services/hybrid-orientation.service.spec.ts`

**Tests requeridos (6-8 tests):**

```typescript
describe('HybridOrientationService', () => {
  describe('Platform Detection', () => {
    it('should use Capacitor on native');
    it('should use Screen Orientation API on web');
  });

  describe('Orientation Lock', () => {
    it('should lock to landscape');
    it('should lock to portrait');
    it('should unlock orientation');
  });

  describe('Error Handling', () => {
    it('should handle orientation API not available');
    it('should handle lock failure gracefully');
  });
});
```

**Cobertura objetivo:** ≥ 85%

---

### 2.6 HybridSafeAreaService (P1)
**Archivo:** `src/app/core/infrastructure/services/hybrid-safe-area.service.spec.ts`

**Tests requeridos (6-8 tests):**

```typescript
describe('HybridSafeAreaService', () => {
  describe('Platform Detection', () => {
    it('should detect native platform');
    it('should detect web platform');
  });

  describe('Safe Area Insets', () => {
    it('should return insets on native');
    it('should return zero insets on web');
    it('should get status bar height');
  });

  describe('Observable Updates', () => {
    it('should emit insets changes');
    it('should subscribe to status bar changes');
  });
});
```

**Cobertura objetivo:** ≥ 85%

---

### 2.7 HybridGalleryService (P1)
**Archivo:** `src/app/core/infrastructure/services/hybrid-gallery.service.spec.ts`

**Tests requeridos (8-10 tests):**

```typescript
describe('HybridGalleryService', () => {
  describe('Platform Detection', () => {
    it('should use Capacitor Camera on native');
    it('should use File Input on web');
  });

  describe('Image Picking', () => {
    it('should pick single image on native');
    it('should pick single image on web');
    it('should pick multiple images');
    it('should handle user cancellation');
  });

  describe('Permissions', () => {
    it('should request camera permissions on native');
    it('should handle permission denied');
  });

  describe('Error Handling', () => {
    it('should handle camera unavailable');
    it('should validate image file types');
  });
});
```

**Cobertura objetivo:** ≥ 85%

---

### 2.8 FileStorageService (P2)
**Archivo:** `src/app/core/infrastructure/services/file-storage.service.spec.ts`

**Tests requeridos (6-8 tests):**

```typescript
describe('FileStorageService', () => {
  describe('File Operations', () => {
    it('should save file');
    it('should read file');
    it('should delete file');
    it('should check if file exists');
  });

  describe('Error Handling', () => {
    it('should handle file not found');
    it('should handle write errors');
    it('should handle read errors');
  });
});
```

**Cobertura objetivo:** ≥ 80%

---

### 2.9 PhraseButtonConfigService (P2)
**Archivo:** `src/app/core/infrastructure/services/phrase-button-config.service.spec.ts`

**Tests requeridos (4-6 tests):**

```typescript
describe('PhraseButtonConfigService', () => {
  describe('Configuration', () => {
    it('should get default config');
    it('should update button size');
    it('should update button colors');
    it('should reset config');
  });

  describe('Persistence', () => {
    it('should save config');
    it('should load saved config');
  });
});
```

**Cobertura objetivo:** ≥ 80%

---

### 2.10 CarouselConfigService (P2)
**Archivo:** `src/app/core/infrastructure/services/carousel-config.service.spec.ts`

**Tests requeridos (4-6 tests):**

```typescript
describe('CarouselConfigService', () => {
  describe('Configuration', () => {
    it('should get carousel config');
    it('should update slides per view');
    it('should update spacing');
    it('should toggle loop mode');
  });

  describe('Responsive Config', () => {
    it('should adapt config to mobile');
    it('should adapt config to desktop');
  });
});
```

**Cobertura objetivo:** ≥ 75%

---

### 2.11 WriteViewConfigService (P2)
**Archivo:** `src/app/core/infrastructure/services/write-view-config.service.spec.ts`

**Tests requeridos (4-6 tests):**

```typescript
describe('WriteViewConfigService', () => {
  describe('View Mode', () => {
    it('should switch to grid view');
    it('should switch to carousel view');
    it('should get current view mode');
  });

  describe('Persistence', () => {
    it('should save view preference');
    it('should load saved preference');
  });
});
```

**Cobertura objetivo:** ≥ 75%

---

## ✅ Checklist de Completitud por Servicio

### P0 Services
- [ ] `hybrid-text-to-speech.service.spec.ts` - 12+ tests, cobertura ≥ 95%
- [ ] `theme.service.spec.ts` - 10+ tests, cobertura ≥ 95%
- [ ] `press-hold-button.service.spec.ts` - 10+ tests, cobertura ≥ 90%

### P1 Services
- [ ] `phrase-store.service.spec.ts` - 8+ tests, cobertura ≥ 90%
- [ ] `hybrid-orientation.service.spec.ts` - 6+ tests, cobertura ≥ 85%
- [ ] `hybrid-safe-area.service.spec.ts` - 6+ tests, cobertura ≥ 85%
- [ ] `hybrid-gallery.service.spec.ts` - 8+ tests, cobertura ≥ 85%

### P2 Services
- [ ] `file-storage.service.spec.ts` - 6+ tests, cobertura ≥ 80%
- [ ] `phrase-button-config.service.spec.ts` - 4+ tests, cobertura ≥ 80%
- [ ] `carousel-config.service.spec.ts` - 4+ tests, cobertura ≥ 75%
- [ ] `write-view-config.service.spec.ts` - 4+ tests, cobertura ≥ 75%

---

## 📊 Validación de Progreso

**Después de cada servicio:**
```bash
npm test -- --include="**/services/**/*.spec.ts" --code-coverage
```

**Al final de la fase:**
```bash
npm test -- --no-watch --code-coverage --browsers=ChromeHeadless
```

**Resultado esperado:**
- Cobertura global: ~50%
- Cobertura en `/core/infrastructure/services/`: ≥ 90%
- Tests pasando: 100%

---

## 🎯 Entregables

1. ✅ 11 archivos .spec.ts creados
2. ✅ 90-110 tests implementados
3. ✅ Cobertura global ≥ 50%
4. ✅ Cobertura core services ≥ 90%
5. ✅ 0 tests fallando

---

## 🚨 Problemas Potenciales

### Problema 1: Capacitor no está disponible en tests
**Solución:** Mockear `Capacitor.isNativePlatform()` con spy en cada test

### Problema 2: Web APIs no disponibles (speechSynthesis, etc)
**Solución:** Mockear globales en beforeEach:
```typescript
(window as any).speechSynthesis = { speak: jasmine.createSpy() };
```

### Problema 3: Tests de persistencia fallan
**Solución:** Mockear Capacitor Preferences:
```typescript
import { Preferences } from '@capacitor/preferences';
spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: '{}' }));
```

---

## 📚 Referencias

- [Testing Hybrid Services](../context/testing-context.md#testing-de-servicios-híbridos)
- [Capacitor Testing](https://capacitorjs.com/docs/guides/mocking-plugins)
- [Jasmine Async](https://jasmine.github.io/tutorials/async)

---

## ➡️ Siguiente Fase

Una vez completada esta fase, continuar con:
**[FASE 3: Tests de Componentes Compartidos](./fase-3-shared-components.md)**
