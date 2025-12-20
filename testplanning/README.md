# 🧪 Plan de Testing - Texto por Voz
## Objetivo: Alcanzar 80% de cobertura

---

## 📊 Resumen Ejecutivo

| Métrica | Estado Actual | Objetivo | Incremento |
|---------|---------------|----------|------------|
| **Statements** | 9.06% | 88% | +79% |
| **Branches** | 5.47% | 82% | +76% |
| **Functions** | 4.21% | 85% | +81% |
| **Lines** | 9.01% | 88% | +79% |
| **Tests** | 2 | ~276 | +274 |

---

## 📁 Estructura del Plan

Este plan está dividido en **6 fases incrementales**, cada una con entregables y métricas específicas:

### [Fase 1: Infraestructura de Testing](./fase-1-infraestructura.md)
- **Duración:** 1 día
- **Tests:** 5-7 tests
- **Cobertura esperada:** 15%
- **Contenido:**
  - Crear test utilities y mocks
  - Configurar providers centralizados
  - Arreglar tests existentes

---

### [Fase 2: Tests de Core Services](./fase-2-core-services.md)
- **Duración:** 4-5 días
- **Tests:** 90-110 tests
- **Cobertura esperada:** 50%
- **Servicios a testear:**
  - HybridTextToSpeechService (P0)
  - ThemeService (P0)
  - PressHoldButtonService (P0)
  - PhraseStoreService (P1)
  - HybridOrientationService (P1)
  - HybridSafeAreaService (P1)
  - HybridGalleryService (P1)
  - FileStorageService (P2)
  - PhraseButtonConfigService (P2)
  - CarouselConfigService (P2)
  - WriteViewConfigService (P2)

---

### [Fase 3: Tests de Componentes Compartidos](./fase-3-shared-components.md)
- **Duración:** 2-3 días
- **Tests:** 45-50 tests
- **Cobertura esperada:** 65%
- **Componentes a testear:**
  - PressHoldButtonComponent (P0)
  - SidebarNavigationComponent (P0)
  - ColorSelectorComponent (P0)
  - TtsActivationComponent (P0)

---

### [Fase 4: Tests de Páginas](./fase-4-pages.md)
- **Duración:** 2 días
- **Tests:** 40-47 tests
- **Cobertura esperada:** 75%
- **Páginas a testear:**
  - WritePage (P0)
  - PhrasesPage (P1)
  - SettingsPage (P1)
  - HomePage (P2)

---

### [Fase 5: Tests de Componentes de Páginas](./fase-5-page-components.md)
- **Duración:** 3 días
- **Tests:** 58-71 tests
- **Cobertura esperada:** 85%
- **Componentes a testear:**
  - LetterKeyboardSectionComponent (P0)
  - LetterGridViewComponent (P0)
  - LetterCarouselViewComponent (P0)
  - PhraseSlotButtonComponent (P1)
  - TextInputSectionComponent (P1)
  - ActionButtonsSectionComponent (P1)

---

### [Fase 6: Tests de Application Services](./fase-6-application-services.md)
- **Duración:** 1 día
- **Tests:** 12-16 tests
- **Cobertura esperada:** 88% ✅
- **Servicios a testear:**
  - BackNavigationService (P2)
  - PressHoldConfigService (P2)

---

## 🗓️ Cronograma Total

| Fase | Duración | Tests | Cobertura Acumulada |
|------|----------|-------|---------------------|
| **Fase 1** | 1 día | 5-7 | ~15% |
| **Fase 2** | 4-5 días | 90-110 | ~50% |
| **Fase 3** | 2-3 días | 45-50 | ~65% |
| **Fase 4** | 2 días | 40-47 | ~75% |
| **Fase 5** | 3 días | 58-71 | ~85% |
| **Fase 6** | 1 día | 12-16 | ~88% ✅ |
| **TOTAL** | **13-15 días** | **~276 tests** | **~88%** |

---

## 🎯 Criterios de Éxito

### Cobertura por Capa

| Capa | Objetivo | Prioridad |
|------|----------|-----------|
| Core Services | ≥ 90% | P0 |
| Shared Components | ≥ 85% | P0 |
| Pages | ≥ 70% | P1 |
| Page Components | ≥ 75% | P1 |
| Application Services | ≥ 85% | P2 |

### Calidad de Tests

- ✅ 100% de tests pasando
- ✅ 0 tests ignorados/skipped
- ✅ Todos los tests de accesibilidad implementados
- ✅ Navegación por teclado validada
- ✅ Integración TTS testeada
- ✅ Servicios híbridos (web + móvil) cubiertos

---

## 🛠️ Herramientas y Configuración

### Stack de Testing
- **Framework:** Jasmine (ya configurado)
- **Runner:** Karma
- **Coverage:** karma-coverage
- **Browser:** ChromeHeadless
- **Utilities:** Custom mocks en `/src/testing/`

### Comandos Principales

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm test -- --code-coverage --no-watch --browsers=ChromeHeadless

# Tests de una fase específica
npm test -- --include="**/services/**/*.spec.ts"

# Watch mode para desarrollo
npm test -- --watch
```

---

## 📋 Checklist Global de Completitud

### Infraestructura
- [ ] Carpeta `/src/testing/` creada
- [ ] Test utilities implementados
- [ ] Providers mock centralizados
- [ ] Path aliases configurados

### Core Services (11 servicios)
- [ ] HybridTextToSpeechService
- [ ] ThemeService
- [ ] PressHoldButtonService
- [ ] PhraseStoreService
- [ ] HybridOrientationService
- [ ] HybridSafeAreaService
- [ ] HybridGalleryService
- [ ] FileStorageService
- [ ] PhraseButtonConfigService
- [ ] CarouselConfigService
- [ ] WriteViewConfigService

### Componentes Compartidos (4 componentes)
- [ ] PressHoldButtonComponent
- [ ] SidebarNavigationComponent
- [ ] ColorSelectorComponent
- [ ] TtsActivationComponent

### Páginas (4 páginas)
- [ ] WritePage
- [ ] PhrasesPage
- [ ] SettingsPage
- [ ] HomePage

### Componentes de Páginas (6 componentes)
- [ ] LetterKeyboardSectionComponent
- [ ] LetterGridViewComponent
- [ ] LetterCarouselViewComponent
- [ ] PhraseSlotButtonComponent
- [ ] TextInputSectionComponent
- [ ] ActionButtonsSectionComponent

### Application Services (2 servicios)
- [ ] BackNavigationService
- [ ] PressHoldConfigService

---

## 🚀 Cómo Usar Este Plan

### Opción 1: Seguir el orden recomendado
1. Comenzar con Fase 1 (infraestructura)
2. Continuar secuencialmente hasta Fase 6
3. Validar cobertura después de cada fase

### Opción 2: Priorizar por criticidad
1. Fase 1 (obligatoria)
2. Fase 2 - Solo servicios P0
3. Fase 3 (todos P0)
4. Completar fases restantes

### Opción 3: Enfoque paralelo (con equipo)
- **Dev 1:** Fase 1 + Fase 2 (Core Services)
- **Dev 2:** Fase 3 (Shared Components)
- **Dev 3:** Fase 4 + Fase 5 (Pages)
- **Dev 4:** Fase 6 + Integración

---

## 📊 Tracking de Progreso

### Después de cada fase, ejecutar:

```bash
# Generar reporte de cobertura
npm test -- --code-coverage --no-watch --browsers=ChromeHeadless

# Ver reporte HTML
open coverage/index.html
```

### Métricas a monitorear:
- [ ] % de statements cubiertos
- [ ] % de branches cubiertos
- [ ] % de funciones cubiertas
- [ ] % de líneas cubiertas
- [ ] Número de tests pasando
- [ ] Número de tests fallando

---

## 🔧 Solución de Problemas Comunes

### Tests fallan por falta de providers
**Ver:** [Fase 1 - Providers Mock](./fase-1-infraestructura.md#12-crear-providers-mock-centralizados)

### Servicios híbridos no detectan plataforma
**Ver:** [Fase 2 - Testing Servicios Híbridos](./fase-2-core-services.md#21-hybridtexttospeechservice-p0)

### Componentes con eventos async fallan
**Ver:** [Fase 3 - Press Hold Tests](./fase-3-shared-components.md#31-pressholdbuttoncomponent-p0---día-1)

### Router no funciona en tests
**Ver:** [Fase 4 - HomePage Tests](./fase-4-pages.md#44-homepage-p2---día-2)

---

## 🎓 Recursos de Aprendizaje

### Documentación del Proyecto
- [Context de Testing](../context/testing-context.md)
- [Context de Accesibilidad](../context/accessibility-context.md)
- [Context de Development](../context/development-context.md)

### Documentación Externa
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)

---

## ✅ Validación Final

Al completar todas las fases, verificar:

```bash
# Ejecutar suite completa
npm test -- --no-watch --code-coverage --browsers=ChromeHeadless

# Verificar umbrales
# Statements:   ≥ 80% ✅
# Branches:     ≥ 75% ✅
# Functions:    ≥ 80% ✅
# Lines:        ≥ 80% ✅
```

**Resultado esperado:**
```
Chrome Headless: Executed 276 of 276 SUCCESS
=============================== Coverage summary ===============================
Statements   : 88.5% ( 322/364 )
Branches     : 82.0% ( 60/73 )
Functions    : 85.0% ( 81/95 )
Lines        : 88.1% ( 313/355 )
================================================================================
```

---

## 🎉 ¡Proyecto Completado!

Una vez alcanzada la cobertura del 80%, el proyecto tendrá:

- ✅ **~276 tests automatizados**
- ✅ **88% de cobertura de código**
- ✅ **Tests de accesibilidad completos**
- ✅ **Servicios híbridos validados**
- ✅ **Navegación por teclado testeada**
- ✅ **Suite de regresión robusta**
- ✅ **Base sólida para mantenimiento**

**¡Listo para producción con confianza!** 🚀
