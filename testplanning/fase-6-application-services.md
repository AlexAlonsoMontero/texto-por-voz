# 📋 FASE 6: Tests de Application Services

## 🎯 Objetivo
Completar la cobertura de testing con los servicios de la capa de aplicación (`/core/application/services/`), alcanzando el objetivo final de ≥80% de cobertura global.

## ⏱️ Duración Estimada
**1 día (8 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~85%
- **Final esperado:** ~88% ✅ (superando objetivo del 80%)
- **Tests a crear:** 12-16 tests
- **Servicios a testear:** 2 servicios

---

## 🎯 Prioridades

### P2 - Medio (Ambos servicios)
- `back-navigation.service.ts` - Navegación accesible
- `press-hold-config.service.ts` - Configuración centralizada

Ambos son P2 porque:
- No son críticos para funcionalidad core
- Ya tienen dependencias testeadas
- Lógica relativamente simple
- Completarán el objetivo de cobertura

---

## 🔧 Tareas Detalladas

### 6.1 BackNavigationService (P2 - 4 horas)
**Archivo:** `src/app/core/application/services/back-navigation.service.spec.ts`

**Complejidad:** BAJA-MEDIA
**Tests requeridos:** 6-8 tests

#### Template de Test Completo

```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BackNavigationService } from './back-navigation.service';
import { TEST_PROVIDERS, createMockTTSService } from '@testing';
import { TEXT_TO_SPEECH_SERVICE } from '@core/infrastructure/injection-tokens';

describe('BackNavigationService', () => {
  let service: BackNavigationService;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;
  let mockTtsService: jasmine.SpyObj<ITextToSpeechService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    const locationSpy = jasmine.createSpyObj('Location', ['back', 'path']);
    mockTtsService = createMockTTSService();

    TestBed.configureTestingModule({
      providers: [
        BackNavigationService,
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: TEXT_TO_SPEECH_SERVICE, useValue: mockTtsService },
        ...TEST_PROVIDERS
      ]
    });

    service = TestBed.inject(BackNavigationService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize navigation history stack', () => {
      expect(service.canGoBack()).toBe(false);
    });
  });

  describe('Navigation History Management', () => {
    it('should track navigation history', () => {
      service.pushNavigation('/home');
      service.pushNavigation('/write');
      service.pushNavigation('/settings');
      
      expect(service.canGoBack()).toBe(true);
      expect(service.getHistoryLength()).toBe(3);
    });

    it('should not duplicate same route in history', () => {
      service.pushNavigation('/home');
      service.pushNavigation('/home');
      
      expect(service.getHistoryLength()).toBe(1);
    });

    it('should pop navigation on back', () => {
      service.pushNavigation('/home');
      service.pushNavigation('/write');
      
      service.back();
      
      expect(service.getHistoryLength()).toBe(1);
    });
  });

  describe('Back Navigation', () => {
    it('should use location.back() when history exists', () => {
      service.pushNavigation('/home');
      service.pushNavigation('/write');
      
      service.back();
      
      expect(location.back).toHaveBeenCalled();
    });

    it('should navigate to default route when no history', () => {
      service.back();
      
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should return true if navigation was successful', () => {
      service.pushNavigation('/home');
      service.pushNavigation('/write');
      
      const result = service.back();
      
      expect(result).toBe(true);
    });

    it('should return false if at root (no history)', () => {
      const result = service.back();
      
      expect(result).toBe(false);
    });
  });

  describe('Custom Back Navigation', () => {
    it('should navigate to specific route', () => {
      service.backTo('/home');
      
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should provide TTS feedback on navigation', async () => {
      mockTtsService.speak.and.returnValue(Promise.resolve());
      
      await service.backWithFeedback('Volviendo al inicio');
      
      expect(mockTtsService.speak).toHaveBeenCalledWith(
        'Volviendo al inicio',
        jasmine.any(Object)
      );
    });
  });

  describe('Accessibility Features', () => {
    it('should announce navigation to screen readers', async () => {
      service.pushNavigation('/home');
      service.pushNavigation('/write');
      
      await service.back();
      
      // Verificar que se anunció la navegación
      expect(mockTtsService.speak).toHaveBeenCalled();
    });

    it('should provide custom back messages', async () => {
      await service.backWithCustomMessage('Volver a configuración');
      
      expect(mockTtsService.speak).toHaveBeenCalledWith(
        jasmine.stringContaining('configuración'),
        jasmine.any(Object)
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty history gracefully', () => {
      expect(() => service.back()).not.toThrow();
    });

    it('should handle navigation errors gracefully', () => {
      router.navigate.and.returnValue(Promise.reject(new Error('Navigation failed')));
      
      expect(() => service.backTo('/invalid')).not.toThrow();
    });

    it('should clear history when needed', () => {
      service.pushNavigation('/home');
      service.pushNavigation('/write');
      service.clearHistory();
      
      expect(service.canGoBack()).toBe(false);
      expect(service.getHistoryLength()).toBe(0);
    });
  });
});
```

**Métodos principales a testear:**
- ✅ `pushNavigation(route: string): void`
- ✅ `back(): boolean`
- ✅ `backTo(route: string): void`
- ✅ `backWithFeedback(message: string): Promise<void>`
- ✅ `canGoBack(): boolean`
- ✅ `getHistoryLength(): number`
- ✅ `clearHistory(): void`

**Cobertura objetivo:** ≥ 85%

---

### 6.2 PressHoldConfigService (P2 - 4 horas)
**Archivo:** `src/app/core/application/services/press-hold-config.service.spec.ts`

**Complejidad:** BAJA
**Tests requeridos:** 6-8 tests

#### Template de Test Completo

```typescript
import { TestBed } from '@angular/core/testing';
import { PressHoldConfigService } from './press-hold-config.service';
import { PRESS_HOLD_BUTTON_SERVICE } from '@core/infrastructure/injection-tokens';
import { createMockPressHoldButtonService, TEST_PROVIDERS } from '@testing';

describe('PressHoldConfigService', () => {
  let service: PressHoldConfigService;
  let mockPressHoldService: jasmine.SpyObj<IPressHoldButtonService>;

  beforeEach(() => {
    mockPressHoldService = createMockPressHoldButtonService();
    
    // Mock default config
    mockPressHoldService.getConfig.and.returnValue({
      holdDuration: 3000,
      hapticFeedback: true,
      visualFeedback: true,
      audioFeedback: true
    });

    TestBed.configureTestingModule({
      providers: [
        PressHoldConfigService,
        { provide: PRESS_HOLD_BUTTON_SERVICE, useValue: mockPressHoldService },
        ...TEST_PROVIDERS
      ]
    });

    service = TestBed.inject(PressHoldConfigService);
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should load default configuration on init', () => {
      service.initialize();
      
      expect(mockPressHoldService.getConfig).toHaveBeenCalled();
      expect(service.getCurrentConfig()).toBeDefined();
    });
  });

  describe('Configuration Management', () => {
    it('should get current configuration', () => {
      const config = service.getCurrentConfig();
      
      expect(config).toEqual({
        holdDuration: 3000,
        hapticFeedback: true,
        visualFeedback: true,
        audioFeedback: true
      });
    });

    it('should update hold duration', () => {
      service.updateHoldDuration(2000);
      
      expect(mockPressHoldService.updateConfig).toHaveBeenCalledWith(
        jasmine.objectContaining({ holdDuration: 2000 })
      );
    });

    it('should toggle haptic feedback', () => {
      service.toggleHapticFeedback();
      
      expect(mockPressHoldService.updateConfig).toHaveBeenCalled();
    });

    it('should toggle visual feedback', () => {
      service.toggleVisualFeedback();
      
      expect(mockPressHoldService.updateConfig).toHaveBeenCalled();
    });

    it('should toggle audio feedback', () => {
      service.toggleAudioFeedback();
      
      expect(mockPressHoldService.updateConfig).toHaveBeenCalled();
    });
  });

  describe('Configuration Validation', () => {
    it('should validate minimum hold duration (500ms)', () => {
      expect(() => service.updateHoldDuration(100))
        .toThrowError(/mínimo/i);
    });

    it('should validate maximum hold duration (10000ms)', () => {
      expect(() => service.updateHoldDuration(15000))
        .toThrowError(/máximo/i);
    });

    it('should accept valid hold duration range', () => {
      expect(() => service.updateHoldDuration(3000)).not.toThrow();
      expect(() => service.updateHoldDuration(500)).not.toThrow();
      expect(() => service.updateHoldDuration(10000)).not.toThrow();
    });
  });

  describe('Preset Configurations', () => {
    it('should apply "Fast" preset (1500ms)', () => {
      service.applyPreset('fast');
      
      expect(mockPressHoldService.updateConfig).toHaveBeenCalledWith(
        jasmine.objectContaining({ holdDuration: 1500 })
      );
    });

    it('should apply "Normal" preset (3000ms)', () => {
      service.applyPreset('normal');
      
      expect(mockPressHoldService.updateConfig).toHaveBeenCalledWith(
        jasmine.objectContaining({ holdDuration: 3000 })
      );
    });

    it('should apply "Slow" preset (5000ms)', () => {
      service.applyPreset('slow');
      
      expect(mockPressHoldService.updateConfig).toHaveBeenCalledWith(
        jasmine.objectContaining({ holdDuration: 5000 })
      );
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to default configuration', () => {
      service.updateHoldDuration(5000);
      service.resetToDefaults();
      
      expect(mockPressHoldService.resetToDefaults).toHaveBeenCalled();
    });
  });

  describe('Configuration Observable', () => {
    it('should emit configuration changes', (done) => {
      const config$ = service.configChanges$;
      
      config$.subscribe(config => {
        expect(config).toBeDefined();
        expect(config.holdDuration).toBe(3000);
        done();
      });
      
      service.initialize();
    });

    it('should notify subscribers on config update', (done) => {
      service.configChanges$.subscribe(config => {
        if (config.holdDuration === 2000) {
          expect(config.holdDuration).toBe(2000);
          done();
        }
      });
      
      service.updateHoldDuration(2000);
    });
  });

  describe('Accessibility Helpers', () => {
    it('should provide duration description for screen readers', () => {
      const description = service.getDurationDescription(3000);
      expect(description).toContain('3 segundos');
    });

    it('should provide config summary for announcements', () => {
      const summary = service.getConfigSummary();
      expect(summary).toContain('3 segundos');
      expect(summary).toMatch(/haptic|vibraci[oó]n/i);
    });
  });
});
```

**Métodos principales a testear:**
- ✅ `initialize(): void`
- ✅ `getCurrentConfig(): PressHoldConfig`
- ✅ `updateHoldDuration(duration: number): void`
- ✅ `toggleHapticFeedback(): void`
- ✅ `toggleVisualFeedback(): void`
- ✅ `toggleAudioFeedback(): void`
- ✅ `applyPreset(preset: 'fast' | 'normal' | 'slow'): void`
- ✅ `resetToDefaults(): void`
- ✅ `configChanges$: Observable<PressHoldConfig>`

**Cobertura objetivo:** ≥ 80%

---

## ✅ Checklist de Completitud

### Servicio por Servicio
- [ ] `back-navigation.service.spec.ts` - 6-8 tests, cobertura ≥ 85%
- [ ] `press-hold-config.service.spec.ts` - 6-8 tests, cobertura ≥ 80%

### Validaciones Finales
- [ ] Integración con servicios infrastructure validada
- [ ] Manejo de errores testeado
- [ ] Observables testeados correctamente
- [ ] Accesibilidad features validadas

---

## 📊 Validación de Progreso

**Después de cada servicio:**
```bash
npm test -- --include="**/application/services/**/*.spec.ts" --code-coverage
```

**Validación FINAL de todo el proyecto:**
```bash
npm test -- --no-watch --code-coverage --browsers=ChromeHeadless
```

**Resultado esperado FINAL:**
```
=============================== Coverage summary ===============================
Statements   : 88.5% ( ~322/364 )
Branches     : 82.0% ( ~60/73 )
Functions    : 85.0% ( ~81/95 )
Lines        : 88.1% ( ~313/355 )
================================================================================
✔ Browser application bundle generation complete.
TOTAL: 276 SUCCESS, 0 FAILED
```

---

## 🎯 Entregables Finales

1. ✅ 2 archivos .spec.ts creados
2. ✅ 12-16 tests implementados
3. ✅ **Cobertura global ≥ 88%** 🎉 (superando objetivo del 80%)
4. ✅ **~276 tests totales en el proyecto**
5. ✅ **0 tests fallando**

---

## 🏆 Logros del Plan Completo

### Métricas Finales Proyectadas

| Métrica | Inicio | Final | Incremento |
|---------|--------|-------|------------|
| **Statements** | 9.06% | ~88.5% | +79.44% |
| **Branches** | 5.47% | ~82.0% | +76.53% |
| **Functions** | 4.21% | ~85.0% | +80.79% |
| **Lines** | 9.01% | ~88.1% | +79.09% |
| **Tests** | 2 | ~276 | +274 tests |

### Cobertura por Capa

| Capa | Cobertura | Calidad |
|------|-----------|---------|
| Core Services | ≥90% | ⭐⭐⭐⭐⭐ |
| Shared Components | ≥85% | ⭐⭐⭐⭐⭐ |
| Pages | ≥70% | ⭐⭐⭐⭐ |
| Page Components | ≥75% | ⭐⭐⭐⭐ |
| Application Services | ≥85% | ⭐⭐⭐⭐⭐ |

---

## 🚨 Problemas Potenciales

### Problema 1: Observables no completan en tests
**Solución:** Usar `take(1)` o completar manualmente con Subject

### Problema 2: Router navigation promises no resuelven
**Solución:** Mockear `router.navigate` para retornar `Promise.resolve(true)`

### Problema 3: Tests async timeout
**Solución:** Incrementar timeout en `jasmine.DEFAULT_TIMEOUT_INTERVAL`

---

## 📚 Referencias

- [RxJS Testing](https://rxjs.dev/guide/testing/marble-testing)
- [Router Testing](https://angular.io/guide/testing-components-scenarios#routing-component)
- [Location Testing](https://angular.io/api/common/Location)

---

## 🎉 Celebración y Siguientes Pasos

### ✅ Fase 6 Completada

Una vez completada esta fase:

1. **Ejecutar validación final completa**
   ```bash
   npm test -- --no-watch --code-coverage --browsers=ChromeHeadless
   ```

2. **Generar reporte de cobertura**
   ```bash
   open coverage/index.html
   ```

3. **Verificar métricas objetivo:**
   - ✅ Cobertura global ≥ 80% → **ALCANZADO (88%)**
   - ✅ Core Services ≥ 90% → **ALCANZADO**
   - ✅ Shared Components ≥ 85% → **ALCANZADO**
   - ✅ Todos los tests pasando → **ALCANZADO**

4. **Documentar logros:**
   - Actualizar README.md con badges de cobertura
   - Documentar estrategia de testing en `/docs/`
   - Crear guía de contribución con estándares de testing

---

## 🚀 Mantenimiento Post-Implementación

### Reglas de Oro para Mantener Cobertura

1. **Nuevo código = Nuevos tests**
   - Nunca hacer PR sin tests
   - Mantener cobertura ≥ 80% en cambios

2. **Testing en CI/CD**
   ```yaml
   # .github/workflows/test.yml
   - name: Run tests with coverage
     run: npm run test:coverage
   - name: Enforce coverage threshold
     run: |
       COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
       if (( $(echo "$COVERAGE < 80" | bc -l) )); then
         echo "Coverage $COVERAGE% is below 80%"
         exit 1
       fi
   ```

3. **Pre-commit hooks**
   ```bash
   # .husky/pre-commit
   npm run test:affected
   ```

---

## 🎯 Proyecto Completado

**OBJETIVO ALCANZADO:** De 9% a 88% de cobertura con ~276 tests implementados en 6 fases estructuradas. 🎉

El proyecto ahora tiene una suite de tests robusta que garantiza:
- ✅ Funcionalidad correcta
- ✅ Accesibilidad mantenida
- ✅ Regresiones prevenidas
- ✅ Calidad de código elevada
- ✅ Confianza para refactoring
