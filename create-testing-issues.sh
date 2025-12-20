#!/bin/bash

# Script para crear issues de GitHub del plan de testing
# Requiere: GitHub CLI (gh) instalado y autenticado

REPO="AlexAlonsoMontero/texto-por-voz"

echo "🚀 Creando issues del plan de testing en $REPO..."

# Issue 1: Fase 1
gh issue create \
  --repo "$REPO" \
  --title "🧪 [TESTING] Fase 1: Infraestructura de Testing" \
  --label "testing,infrastructure,priority:high" \
  --body "## 🎯 Objetivo
Establecer la base para todos los tests del proyecto, creando utilities reutilizables y arreglando los tests existentes que actualmente fallan.

## ⏱️ Duración Estimada
**1 día (6-8 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~9%
- **Final esperado:** ~15%
- **Tests a crear:** 5-7 tests
- **Tests a arreglar:** 2 tests

## 🔧 Tareas

### 1.1 Crear Test Utilities Base
- [ ] Crear archivo \`src/testing/test-utils.ts\`
- [ ] Implementar mock factories para todos los servicios:
  - \`createMockTTSService()\`
  - \`createMockThemeService()\`
  - \`createMockOrientationService()\`
  - \`createMockSafeAreaService()\`
  - \`createMockPressHoldButtonService()\`
  - \`createMockPhraseStoreService()\`
  - \`createMockGalleryService()\`
  - \`createMockPhraseButtonConfigService()\`

### 1.2 Crear Providers Mock Centralizados
- [ ] Crear archivo \`src/testing/providers.mock.ts\`
- [ ] Implementar \`TEST_PROVIDERS\` array
- [ ] Implementar \`createTestProvidersWithOverrides()\`

### 1.3 Crear Barrel Export
- [ ] Crear archivo \`src/testing/index.ts\`

### 1.4 Arreglar Tests Existentes
- [ ] Arreglar \`app.component.spec.ts\` (agregar providers)
- [ ] Agregar 3 tests a \`app.component.spec.ts\`
- [ ] Arreglar \`home.page.spec.ts\` (agregar providers)
- [ ] Agregar 3 tests a \`home.page.spec.ts\`

### 1.5 Configuración
- [ ] Actualizar \`tsconfig.json\` con path aliases
- [ ] Validar que todos los tests pasen

## ✅ Criterios de Aceptación
- [ ] Carpeta \`/src/testing/\` creada con utilities
- [ ] 2 archivos spec arreglados
- [ ] \`tsconfig.json\` actualizado
- [ ] Comando \`npm test\` ejecuta exitosamente
- [ ] Cobertura ≥ 15%
- [ ] 0 tests fallando

## 📚 Referencias
- [Plan detallado](./testplanning/fase-1-infraestructura.md)
- [Testing Context](./context/testing-context.md)

## 🔗 Issues Relacionadas
- Bloquea: #2, #3, #4, #5, #6"

echo "✅ Issue 1 creada"

# Issue 2: Fase 2
gh issue create \
  --repo "$REPO" \
  --title "🧪 [TESTING] Fase 2: Tests de Core Services" \
  --label "testing,services,priority:high" \
  --body "## 🎯 Objetivo
Alcanzar 90% de cobertura en la capa de servicios del core, que contiene la lógica de negocio crítica y los servicios híbridos (web + móvil).

## ⏱️ Duración Estimada
**4-5 días (32-40 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~15%
- **Final esperado:** ~50%
- **Tests a crear:** 90-110 tests
- **Archivos a testear:** 11 servicios

## 🔧 Servicios a Testear

### P0 - Crítico (Día 1-2)
- [ ] \`hybrid-text-to-speech.service.spec.ts\` (12-15 tests) - Cobertura ≥ 95%
- [ ] \`theme.service.spec.ts\` (10-12 tests) - Cobertura ≥ 95%
- [ ] \`press-hold-button.service.spec.ts\` (10-12 tests) - Cobertura ≥ 90%

### P1 - Alto (Día 3-4)
- [ ] \`phrase-store.service.spec.ts\` (8-10 tests) - Cobertura ≥ 90%
- [ ] \`hybrid-orientation.service.spec.ts\` (6-8 tests) - Cobertura ≥ 85%
- [ ] \`hybrid-safe-area.service.spec.ts\` (6-8 tests) - Cobertura ≥ 85%
- [ ] \`hybrid-gallery.service.spec.ts\` (8-10 tests) - Cobertura ≥ 85%

### P2 - Medio (Día 5)
- [ ] \`file-storage.service.spec.ts\` (6-8 tests) - Cobertura ≥ 80%
- [ ] \`phrase-button-config.service.spec.ts\` (4-6 tests) - Cobertura ≥ 80%
- [ ] \`carousel-config.service.spec.ts\` (4-6 tests) - Cobertura ≥ 75%
- [ ] \`write-view-config.service.spec.ts\` (4-6 tests) - Cobertura ≥ 75%

## ✅ Criterios de Aceptación
- [ ] 11 archivos .spec.ts creados
- [ ] 90-110 tests implementados
- [ ] Cobertura global ≥ 50%
- [ ] Cobertura core services ≥ 90%
- [ ] 0 tests fallando
- [ ] Servicios híbridos (web + móvil) validados
- [ ] Tests de plataforma (Capacitor) implementados

## 📚 Referencias
- [Plan detallado](./testplanning/fase-2-core-services.md)
- [Testing Context](./context/testing-context.md)

## 🔗 Issues Relacionadas
- Depende de: #1
- Bloquea: #3"

echo "✅ Issue 2 creada"

# Issue 3: Fase 3
gh issue create \
  --repo "$REPO" \
  --title "🧪 [TESTING] Fase 3: Tests de Componentes Compartidos" \
  --label "testing,components,accessibility,priority:high" \
  --body "## 🎯 Objetivo
Alcanzar 85% de cobertura en componentes compartidos (\`/shared/components/\`), que son fundamentales para la accesibilidad y reutilizables en toda la aplicación.

## ⏱️ Duración Estimada
**2-3 días (16-24 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~50%
- **Final esperado:** ~65%
- **Tests a crear:** 45-50 tests
- **Componentes a testear:** 4 componentes

## 🔧 Componentes a Testear (Todos P0 - Críticos)

### Día 1
- [ ] \`press-hold-button.component.spec.ts\` (15-18 tests) - Cobertura ≥ 90%
  - Mouse/Touch events
  - Keyboard accessibility
  - Visual progress feedback
  - ARIA attributes
  - Edge cases

### Día 1-2
- [ ] \`sidebar-navigation.component.spec.ts\` (10-12 tests) - Cobertura ≥ 85%
  - Navigation routing
  - TTS integration
  - Keyboard navigation
  - ARIA roles

### Día 2
- [ ] \`color-selector.component.spec.ts\` (8-10 tests) - Cobertura ≥ 85%
  - Color selection
  - Contrast validation (WCAG AAA)
  - Predefined colors
  - Accessibility

### Día 2-3
- [ ] \`tts-activation.component.spec.ts\` (8-10 tests) - Cobertura ≥ 85%
  - Modal display (web/native)
  - TTS activation
  - Platform detection
  - Focus trap

## ✅ Criterios de Aceptación
- [ ] 4 archivos .spec.ts creados
- [ ] 45-50 tests implementados
- [ ] Cobertura global ≥ 65%
- [ ] Cobertura shared components ≥ 85%
- [ ] Todos los tests de accesibilidad pasando
- [ ] Navegación por teclado validada en todos
- [ ] ARIA labels correctos en todos
- [ ] TTS feedback testeado donde aplica

## 📚 Referencias
- [Plan detallado](./testplanning/fase-3-shared-components.md)
- [Accessibility Context](./context/accessibility-context.md)
- [Testing Context](./context/testing-context.md)

## 🔗 Issues Relacionadas
- Depende de: #1, #2
- Bloquea: #4"

echo "✅ Issue 3 creada"

# Issue 4: Fase 4
gh issue create \
  --repo "$REPO" \
  --title "🧪 [TESTING] Fase 4: Tests de Páginas" \
  --label "testing,pages,priority:medium" \
  --body "## 🎯 Objetivo
Alcanzar 70% de cobertura en las páginas principales de la aplicación (\`/pages/*.page.ts\`), validando flujos de usuario y lógica de presentación.

## ⏱️ Duración Estimada
**2 días (16 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~65%
- **Final esperado:** ~75%
- **Tests a crear:** 40-47 tests
- **Páginas a testear:** 4 páginas

## 🔧 Páginas a Testear

### P0 - Crítico (Día 1)
- [ ] \`write.page.spec.ts\` (12-15 tests) - Cobertura ≥ 75%
  - Initialization y lifecycle
  - Text input management
  - TTS integration
  - View mode toggle
  - Action buttons
  - Orientation locking

### P1 - Alto (Día 2)
- [ ] \`phrases.page.spec.ts\` (10-12 tests) - Cobertura ≥ 70%
  - Phrase management (CRUD)
  - TTS integration
  - Slot navigation
  - Editing modal

- [ ] \`settings.page.spec.ts\` (10-12 tests) - Cobertura ≥ 70%
  - Theme management
  - Contrast validation
  - Press-hold configuration
  - Settings persistence

### P2 - Medio (Día 2)
- [ ] \`home.page.spec.ts\` (6-8 tests) - Cobertura ≥ 65%
  - Navigation
  - Welcome message
  - Quick actions

## ✅ Criterios de Aceptación
- [ ] 4 archivos .spec.ts creados/mejorados
- [ ] 40-47 tests implementados
- [ ] Cobertura global ≥ 75%
- [ ] Cobertura pages ≥ 70%
- [ ] Flujos de usuario validados
- [ ] Lifecycle hooks testeados
- [ ] Navegación validada
- [ ] Integración con servicios mockeados

## 📚 Referencias
- [Plan detallado](./testplanning/fase-4-pages.md)
- [Testing Context](./context/testing-context.md)

## 🔗 Issues Relacionadas
- Depende de: #1, #2, #3
- Bloquea: #5"

echo "✅ Issue 4 creada"

# Issue 5: Fase 5
gh issue create \
  --repo "$REPO" \
  --title "🧪 [TESTING] Fase 5: Tests de Componentes de Páginas" \
  --label "testing,components,priority:medium" \
  --body "## 🎯 Objetivo
Alcanzar 75% de cobertura en componentes específicos de páginas (\`/pages/*/components/\`), que implementan funcionalidad especializada y lógica de UI compleja.

## ⏱️ Duración Estimada
**3 días (24 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~75%
- **Final esperado:** ~85%
- **Tests a crear:** 58-71 tests
- **Componentes a testear:** 6 componentes

## 🔧 Componentes a Testear

### P0 - Crítico (Día 1-2)
- [ ] \`letter-keyboard-section.component.spec.ts\` (12-15 tests) - Cobertura ≥ 80%
  - View mode switching
  - Letter selection
  - Keyboard navigation
  - TTS integration

- [ ] \`letter-grid-view.component.spec.ts\` (10-12 tests) - Cobertura ≥ 80%
  - Grid navigation (arrows)
  - Focus management
  - Responsive grid

- [ ] \`letter-carousel-view.component.spec.ts\` (10-12 tests) - Cobertura ≥ 75%
  - Carousel navigation
  - Swiper configuration
  - Swipe gestures

### P1 - Alto (Día 2-3)
- [ ] \`phrase-slot-button.component.spec.ts\` (10-12 tests) - Cobertura ≥ 75%
  - Press & hold interaction
  - Empty slot handling
  - Image display
  - Visual customization

- [ ] \`text-input-section.component.spec.ts\` (8-10 tests) - Cobertura ≥ 75%
  - Text display
  - Text area interaction
  - Visual feedback

- [ ] \`action-buttons-section.component.spec.ts\` (8-10 tests) - Cobertura ≥ 70%
  - Action button events
  - Press-hold buttons
  - Button states
  - Touch target sizes

## ✅ Criterios de Aceptación
- [ ] 6 archivos .spec.ts creados
- [ ] 58-71 tests implementados
- [ ] Cobertura global ≥ 85%
- [ ] Cobertura page components ≥ 75%
- [ ] Navegación por teclado validada
- [ ] Eventos padre-hijo testeados
- [ ] Estados visuales verificados

## 📚 Referencias
- [Plan detallado](./testplanning/fase-5-page-components.md)
- [Testing Context](./context/testing-context.md)

## 🔗 Issues Relacionadas
- Depende de: #1, #2, #3, #4
- Bloquea: #6"

echo "✅ Issue 5 creada"

# Issue 6: Fase 6
gh issue create \
  --repo "$REPO" \
  --title "🧪 [TESTING] Fase 6: Tests de Application Services + Validación Final" \
  --label "testing,services,priority:low" \
  --body "## 🎯 Objetivo
Completar la cobertura de testing con los servicios de la capa de aplicación, alcanzando el objetivo final de ≥80% de cobertura global.

## ⏱️ Duración Estimada
**1 día (8 horas)**

## 📊 Impacto en Cobertura
- **Inicio:** ~85%
- **Final esperado:** ~88% ✅ (superando objetivo del 80%)
- **Tests a crear:** 12-16 tests
- **Servicios a testear:** 2 servicios

## 🔧 Servicios a Testear (P2 - Medio)

### Application Services
- [ ] \`back-navigation.service.spec.ts\` (6-8 tests) - Cobertura ≥ 85%
  - Navigation history management
  - Back navigation
  - Custom navigation
  - Accessibility features
  - Edge cases

- [ ] \`press-hold-config.service.spec.ts\` (6-8 tests) - Cobertura ≥ 80%
  - Configuration management
  - Configuration validation
  - Preset configurations
  - Reset functionality
  - Configuration observable
  - Accessibility helpers

## ✅ Criterios de Aceptación

### Tests
- [ ] 2 archivos .spec.ts creados
- [ ] 12-16 tests implementados
- [ ] 0 tests fallando

### Cobertura Final ✅
- [ ] **Cobertura global ≥ 88%** (superando 80%)
- [ ] **~276 tests totales**
- [ ] Statements ≥ 88%
- [ ] Branches ≥ 82%
- [ ] Functions ≥ 85%
- [ ] Lines ≥ 88%

### Validación Final
- [ ] Ejecutar suite completa: \`npm test -- --no-watch --code-coverage\`
- [ ] Generar reporte HTML
- [ ] Validar umbrales de cobertura
- [ ] Documentar métricas finales

## 🏆 Logros del Plan Completo

| Métrica | Inicio | Final | Incremento |
|---------|--------|-------|------------|
| Statements | 9.06% | ~88.5% | +79.44% |
| Branches | 5.47% | ~82.0% | +76.53% |
| Functions | 4.21% | ~85.0% | +80.79% |
| Lines | 9.01% | ~88.1% | +79.09% |
| Tests | 2 | ~276 | +274 tests |

## 📚 Referencias
- [Plan detallado](./testplanning/fase-6-application-services.md)
- [Testing Context](./context/testing-context.md)

## 🔗 Issues Relacionadas
- Depende de: #1, #2, #3, #4, #5
- Cierra el plan completo de testing 🎉"

echo "✅ Issue 6 creada"

echo ""
echo "🎉 ¡Todas las issues creadas exitosamente!"
echo "📊 Total: 6 issues del plan de testing"
echo "🔗 Ver en: https://github.com/$REPO/issues"
