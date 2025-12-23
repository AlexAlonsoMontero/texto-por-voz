# Aplicación de Comunicación Asistida (Texto a Voz) v1.1.0

Una aplicación híbrida **Angular 20 + Ionic 8** diseñada específicamente para personas con limitaciones severas en comunicación verbal, motora y visual. Proporciona un sistema completo de escritura por voz, frases rápidas y configuración accesible.

## ✨ Versión 1.1.0 - Actualización Diciembre 2024

**Estado:** ✅ Versión mejorada con nuevas funcionalidades

### 🆕 Novedades v1.1.0

- **🎯 Botones Predefinidos**: 6 botones con iconos listos para usar (SI, NO, hambre, baño, salud, batería)
- **🔄 Sistema de Restauración Completo**: Restaura configuración completa, colores, tiempos o botones desde Settings
- **⚡ Tiempo de Pulsado Optimizado**: Reducido a 0.5s por defecto (configurable 0.5s-5s)
- **🎨 Responsividad Mejorada**: Mejor adaptación de botones a diferentes tamaños de pantalla
- **🚀 Acceso Directo**: Eliminada página Home, acceso directo a escritura
- **📄 Scroll en Frases**: Permite ver todos los botones con scroll vertical

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
- **RxJS 7.8.0**: Programación reactiva

### 🎯 Funcionalidades Implementadas

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

## 🧪 Testing y Calidad

### Tests Implementados

- Tests unitarios para servicios principales
- Configuración Karma + Jasmine
- ESLint con TypeScript para calidad de código
- Tests de accesibilidad (navegación por teclado, aria-labels)

### Accesibilidad Validada (v1.0.0)

- ✅ Navegación por teclado completa (Tab, Enter, Escape)
- ✅ Síntesis de voz funcional (web + móvil)
- ✅ Sistema anti-espasmos (presión sostenida)
- ✅ Estados visuales claros con feedback de progreso
- ✅ Feedback háptico en móvil (vibración)
- ✅ Contraste de colores WCAG AA (configurable a AAA)
- ✅ Botones grandes (min 48px altura, configurables hasta XL)
- ✅ Diseño alternado de colores para distinción visual
- ✅ Modo carrusel para usuarios con campo visual reducido

## 📦 Distribución

### APK Android

La aplicación está disponible como APK independiente:

```bash
# Compilar APK para distribución
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

**Archivo generado:** `android/app/build/outputs/apk/debug/app-debug.apk`

### Requisitos del Dispositivo

- Android 5.0+ (API 21)
- 20MB de espacio libre
- Permiso de "Instalar de fuentes desconocidas" (para APK)

## 🎨 Guía de Desarrollo

### Crear Nuevo Servicio

## 📖 Documentación Adicional

- **Manual de Usuario**: Ver [`manual-usuario.md`](manual-usuario.md) para guía completa de uso
- **Manual Técnico**: Ver [`manual.md`](manual.md) para detalles de implementación
- **Contextos de Agentes**: Ver carpeta [`context/`](context/) para arquitectura y patrones

---

3. Implementar servicio híbrido en `core/infrastructure/services/` 4. Registrar en `providers.ts`

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
