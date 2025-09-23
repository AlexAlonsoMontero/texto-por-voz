# Aplicación de Texto por Voz Accesible

Una aplicación híbrida **Angular 20 + Ionic 8** orientada a accesibilidad para personas con discapacidad visual, con funcionalidad principal de **Texto a Voz (TTS)** para web y móvil.

## ✨ Estado Actual del Proyecto

### 🏗️ Arquitectura Implementada

- **Arquitectura Hexagonal + DDD**: Separación clara entre `domain`, `application` e `infrastructure`
- **Standalone Components**: Sin NgModules, componentes auto-contenidos
- **Inyección por InjectionTokens**: Desacoplamiento completo entre capas
- **Servicios híbridos**: Implementaciones que funcionan en web y móvil nativo

### 🛠️ Stack Tecnológico

- **Angular 20.0.0**: Framework principal con componentes standalone
- **Ionic 8.0.0**: UI Components y navegación híbrida
- **Capacitor 7.4.3**: Bridge para funcionalidades nativas
- **TypeScript 5.8.0**: Tipado estricto con configuración ES2021
- **RxJS 7.8.0**: Programación reactivaxto por Voz Accesible

Una aplicación híbrida **Angular 20 + Ionic 8** orientada a accesibilidad para personas con discapacidad visual, con funcionalidad principal de **Texto a Voz (TTS)** para web y móvil.

## ✨ Estado Actual del Proyecto

### �️ Arquitectura Implementada

- **Arquitectura Hexagonal + DDD**: Separación clara entre `domain`, `application` e `infrastructure`
- **Standalone Components**: Sin NgModules, componentes auto-contenidos
- **Inyección por InjectionTokens**: Desacoplamiento completo entre capas
- **Servicios híbridos**: Implementaciones que funcionan en web y móvil nativo

### 🛠️ Stack Tecnológico

- **Angular 20.0.0**: Framework principal con componentes standalone
- **Ionic 8.0.0**: UI Components y navegación híbrida
- **Capacitor 7.4.3**: Bridge para funcionalidades nativas
- **TypeScript 5.8.0**: Tipado estricto con configuración ES2021
- **RxJS 7.8.0**: Programación reactiva

### � Funcionalidades Implementadas

#### 🎤 Sistema TTS (Texto a Voz)

- **Servicio híbrido**: `HybridTextToSpeechService`
  - Web: API `speechSynthesis` con activación manual
  - Móvil: Plugin `@capacitor-community/text-to-speech`
- **Estados de inicialización**: UNINITIALIZED → INITIALIZING → READY/ERROR
- **Componente de activación**: `TtsActivationComponent` para navegadores web

#### 🔘 Sistema de Botones con Presión Sostenida

- **Nuevo patrón de interacción**: Mantener presionado para activar (accesible para problemas motores)
- **Componente**: `PressHoldButtonComponent` con animación de progreso SVG
- **Servicio**: `PressHoldButtonService` con feedback háptico en móvil
- **Configuración global**: Duración personalizable por botón
- **Estados visuales**: Progreso circular durante la presión

#### 🧭 Servicios de Plataforma

- **Orientación**: `HybridOrientationService` - Control de orientación de pantalla
- **SafeArea**: `HybridSafeAreaService` - Gestión de barras del sistema Android/iOS
- **Inyección limpia**: Solo tokens utilizados en `injection-tokens.ts`

### � Estructura de la Aplicación

#### Página Principal (`HomePage`)

- **3 botones de ejemplo** con presión sostenida:
  - Botón de ejemplo (3 segundos)
  - Leer texto (2 segundos)
  - Configuración (3 segundos)
- **Activación TTS**: Componente modal para navegadores web
- **Feedback auditivo**: Anuncios automáticos de acciones

#### Arquitectura de Carpetas

```
src/app/
├── core/
│   ├── domain/interfaces/          # Contratos y tipos
│   ├── application/               # Casos de uso (futuro)
│   └── infrastructure/           # Implementaciones
│       ├── services/             # Servicios híbridos
│       ├── injection-tokens.ts   # Tokens DI
│       └── providers.ts          # Configuración DI
├── shared/components/            # Componentes reutilizables
└── home/                        # Página principal
```

### 🎯 Características de Accesibilidad

#### Navegación por Teclado

- **Tab/Shift+Tab**: Navegación entre elementos
- **Enter/Space**: Activación de botones
- **Feedback inmediato**: Síntesis de voz en todas las interacciones

#### Diseño Visual Accesible

- **Orientación fija horizontal**: Optimizado para tablets/móviles landscape
- **Contraste alto**: Cumple estándares WCAG AA
- **Botones grandes**: Mínimo 48px de altura para fácil acceso
- **Colores Ionic**: Integración con sistema de colores del framework

#### Feedback Multisensorial

- **Visual**: Animaciones de progreso y estados de botones
- **Auditivo**: Síntesis de voz para todas las acciones
- **Táctil**: Vibración háptica en dispositivos móviles

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+
- npm 9+
- Android Studio (para desarrollo móvil)

### Comandos Principales

```bash
# Desarrollo web
npm start

# Build para móvil
npm run build
npx cap sync

# Ejecutar en Android
npx cap run android

# Tests y linting
npm test
npm run lint
```

### Configuración de Capacitor

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'texto-voz',
  webDir: 'www',
};
```

## 🏛️ Patrones de Arquitectura

### Hexagonal Architecture

```typescript
// Puerto (Interface)
export interface ITextToSpeechService {
  speak(text: string, options?: SpeechOptions): Promise<void>;
  stop(): void;
  isSupported(): boolean;
}

// Token de Inyección
export const TEXT_TO_SPEECH_SERVICE = new InjectionToken<ITextToSpeechService>('TextToSpeechService');

// Implementación híbrida
@Injectable()
export class HybridTextToSpeechService implements ITextToSpeechService {
  private isNativePlatform = Capacitor.isNativePlatform();
  // ...implementación
}
```

### Componente con Presión Sostenida

```typescript
// Uso simplificado - API de 2 parámetros
onPressStart(): void {
  this.pressHoldService.startPressTimer(this.buttonId, this.holdDuration);
}
```

## 📋 Funcionalidades Pendientes

### ⏳ En Diseño (No Implementadas)

- [ ] Página de configuración (`/settings`)
- [ ] Gestión avanzada de configuración TTS
- [ ] Múltiples páginas de navegación
- [ ] Sistema de escritura/lectura de texto
- [ ] Guardado de preferencias de usuario

### � Mejoras Planificadas

- [ ] Más opciones de configuración para presión sostenida
- [ ] Soporte multiidioma
- [ ] Temas de alto contraste adicionales
- [ ] Integración con lectores de pantalla nativos

## 🧪 Testing y Calidad

### Tests Implementados

- Tests unitarios para servicios principales
- Configuración Karma + Jasmine
- ESLint con TypeScript para calidad de código

### Accesibilidad Validada

- ✅ Navegación por teclado completa
- ✅ Síntesis de voz funcional (web + móvil)
- ✅ Estados visuales claros
- ✅ Feedback háptico en móvil
- ✅ Contraste de colores WCAG AA

## 🎨 Guía de Desarrollo

### Crear Nuevo Servicio

1. Definir interface en `core/domain/interfaces/`
2. Crear token en `injection-tokens.ts`
3. Implementar servicio híbrido en `core/infrastructure/services/`
4. Registrar en `providers.ts`

### Crear Componente Accesible

1. Usar Standalone Components
2. Implementar navegación por teclado
3. Añadir `aria-label` descriptivos
4. Integrar con TTS para feedback auditivo

## 📞 Soporte y Contribución

### Requisitos de Accesibilidad

- **Obligatorio**: Navegación completa por teclado
- **Obligatorio**: Feedback auditivo en todas las acciones
- **Obligatorio**: Contraste mínimo WCAG AA
- **Recomendado**: Soporte para lectores de pantalla

---

**Para más detalles sobre convenciones y patrones, consulta [`.github/copilot-instructions.md`](.github/copilot-instructions.md).**

---

**🎯 Enfoque Actual**: El proyecto está en fase de desarrollo activo con funcionalidades base implementadas y arquitectura sólida establecida. La prioridad es completar los componentes de interfaz antes de añadir funcionalidades avanzadas.
