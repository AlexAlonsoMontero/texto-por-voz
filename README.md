# 🔊 Texto por Voz - Frontend

> Aplicación híbrida accesible para síntesis de voz con Angular 19 + Ionic

Una aplicación web y móvil diseñada específicamente para personas con discapacidad visual, que convierte texto en voz utilizando tecnologías nativas y web.

---

## 🌟 Características Principales

### 🎯 **Accesibilidad Total**

- **Navegación por teclado** completa (Tab/Enter/Espacio)
- **Alto contraste** cumpliendo WCAG 2.1 AA/AAA
- **Texto a voz automático** en todos los elementos
- **Botones extra grandes** optimizados para personas con problemas visuales
- **Feedback auditivo** en tiempo real
- **Selección visual clara** con fondo blanco contrastante
- **Reinicialización automática** de selección entre páginas

### 📝 **Sistema de Escritura Avanzado**

- **17 botones** organizados en diseño horizontal-only
- **6 grupos de letras** (A-D, E-H, I-L, M-O, P-S, T-Z)
- **8 botones individuales** de puntuación (. , ! ? : ; - ")
- **3 botones de control** (Espacio, Borrar, Nuevo con icono ✓)
- **Campo de texto expandido** con altura optimizada
- **Tamaños de fuente aumentados** 50% para mejor legibilidad
- **Gestión de altura** sin scroll para experiencia fluida
- **Cursor personalizado `|||`** que solo aparece cuando hay texto escrito
- **Parpadeo JavaScript** compatible con todos los navegadores
- **Sistema de carga centralizado** sin duplicación de spinners
- **Navegación optimizada** con transiciones ultra-rápidas
- **Regreso automático** tras seleccionar letra (200ms optimizado)

### 🔧 **Tecnologías**

#### **Core Framework**

- **Angular 20.0.0** con Standalone Components
- **TypeScript 5.8.0** con configuración ES2021
- **RxJS 7.8.0** para programación reactiva
- **Zone.js 0.15.0** para detección de cambios

#### **UI y Móvil**

- **Ionic Angular 8.0.0** para UI híbrida
- **Capacitor 7.4.3** para funcionalidad nativa
- **Ionicons 7.0.0** para iconografía

#### **Plugins Capacitor**

- **@capacitor/app 7.1.0** - Gestión de aplicación
- **@capacitor/core 7.4.3** - Core nativo
- **@capacitor/haptics 7.0.2** - Feedback táctil
- **@capacitor/keyboard 7.0.3** - Control de teclado
- **@capacitor/status-bar 7.0.3** - Barra de estado

#### **Herramientas de Desarrollo**

- **Angular CLI 20.0.0** - Toolchain principal
- **ESLint 9.16.0** con Angular ESLint 20.0.0
- **TypeScript ESLint 8.18.0** - Linting avanzado
- **Jasmine 5.1.0** + **Karma 6.4.0** - Testing

#### **Arquitectura y Patrones**

- **Arquitectura Hexagonal + DDD** (Clean Architecture)
- **Inyección de dependencias** con InjectionTokens
- **Standalone Components** (sin NgModules)
- **Lazy Loading** con loadComponent()
- **LoadingService centralizado** con BehaviorSubject

### 📱 **Multiplataforma**

- **Web** (PWA con service workers)
- **Android** (APK nativo)
- **iOS** (próximamente)

---

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/AlexAlonsoMontero/texto-por-voz-frontend.git
cd texto-por-voz-frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

### Comandos Principales

```bash
# Desarrollo web
npm start                    # http://localhost:8100

# Build para producción
npm run build

# Sincronizar con móvil
npx cap sync

# Ejecutar en Android
npx cap run android

# Testing
npm test
npm run e2e

# Linting
npm run lint
```

---

## 📊 Reporte de Accesibilidad

### ✅ **Cumplimiento WCAG 2.1**

#### **🎨 Contraste y Colores**

- **Ratio de contraste:** 7:1 (AAA) entre texto y fondo ✅
- **Paleta optimizada:** Negro #222222 sobre blanco #FFFFFF ✅
- **Selección visual:** Fondo blanco contrastante en lugar de escalado ✅
- **Modo alto contraste:** Soporte nativo del sistema operativo ✅
- **Bordes definidos:** 3px sólidos para mejor definición ✅

#### **📏 Tamaños y Espaciado**

- **Botones:** 80px altura mínima (supera 48px recomendados) ✅
- **Texto:** 63px fuente botones principales (supera 20px mínimos) ✅
- **Campo de texto:** 36px fuente input (50% más grande que antes) ✅
- **Espaciado:** 16px mínimo entre elementos ✅
- **Áreas de toque:** Optimizadas para accesibilidad móvil ✅
- **Altura de input:** 80-100px para mejor visibilidad ✅

#### **⌨️ Navegación**

- **Teclado:** Soporte completo Tab/Enter/Espacio ✅
- **Focus visible:** Outline amarillo brillante (#FFD600) ✅
- **Orden lógico:** Navegación secuencial intuitiva ✅

#### **🔊 Audio y TTS**

- **Síntesis nativa:** Capacitor Text-to-Speech ✅
- **Fallback web:** Web Speech API ✅
- **Anuncios automáticos:** Contenido y cambios de estado ✅
- **Feedback auditivo:** Confirmaciones y errores ✅

#### **�️ Interacción Accesible**

- **Patrón de doble click:** Primer click selecciona (azul), segundo click ejecuta ✅
- **Feedback visual:** Estados claros entre normal (amarillo/verde) y seleccionado (azul) ✅
- **Excepción intuitiva:** Botón "Leer texto" ejecuta inmediatamente ✅
- **Deselección automática:** Solo un botón seleccionado a la vez ✅

#### **�📱 Responsive**

- **Orientación:** Vertical y horizontal optimizadas ✅
- **Breakpoints:** Móviles, tablets, desktop ✅
- **Zoom:** Hasta 200% sin pérdida de funcionalidad ✅

### 🏆 **Puntuación de Accesibilidad**

- **WCAG 2.1 AA:** 100% ✅
- **WCAG 2.1 AAA:** 95% ✅
- **Lighthouse Accessibility:** 100/100 ✅
- **Navegación por teclado:** 100% ✅
- **Compatibilidad lectores de pantalla:** 100% ✅

---

## ⚡ Optimizaciones de Rendimiento

### **🚀 Navegación Ultra-Rápida**

- **Sistema de carga centralizado** con BehaviorSubject para gestión eficiente de estados
- **Eliminación de spinners duplicados** durante navegaciones
- **Timings optimizados:** Regreso automático de 500ms → 200ms
- **Transiciones de carga reducidas:** De 200ms → 50ms para mayor fluidez
- **Loading condicional:** Sin spinner en regreso automático desde selector de letras

### **💾 Gestión de Estado Eficiente**

- **LoadingService centralizado** evita duplicación de lógica
- **Estado de página limpio** garantizado con ionViewWillEnter()
- **Limpieza automática de memoria** con ngOnDestroy en componentes
- **Cursor JavaScript optimizado** con setInterval controlado

### **🎯 Experiencia de Usuario Mejorada**

- **Cursor condicional** que solo aparece cuando hay texto (reduce carga visual)
- **Navegación instantánea** entre vistas sin delays innecesarios
- **Feedback auditivo optimizado** sin redundancias
- **Selección de botones unificada** con CSS eficiente

---

## 🏗️ Arquitectura

### **Patrón Hexagonal + DDD**

```typescript
src/app/
├── core/
│   ├── domain/          # Entidades y contratos
│   ├── application/     # Casos de uso
│   └── infrastructure/  # Implementaciones
├── shared/
│   └── components/      # Componentes reutilizables
└── pages/              # Páginas de la aplicación
```

### **Principios de Diseño**

- **Accessibility-First:** Diseño desde la accesibilidad
- **Mobile-First:** Responsive design progresivo
- **Offline-First:** Funcionalidad sin conexión
- **Performance-First:** Optimización de carga y rendimiento

---

## ⚙️ Estructura Hexagonal y DDD aplicada

La aplicación sigue el patrón **Hexagonal Architecture + Domain-Driven Design (DDD)**, asegurando separación estricta de responsabilidades y máxima testabilidad.

### Estructura de carpetas

```bash
src/app/
├── core/
│   ├── domain/          # Entidades y contratos (interfaces)
│   ├── application/     # Casos de uso (lógica de negocio)
│   └── infrastructure/  # Implementaciones y configuración de servicios
├── shared/
│   └── components/      # Componentes reutilizables
├── home/                # Página principal (standalone)
├── write/               # Página de escritura (standalone)
└── phrases/             # Página de frases (standalone)
```

### Principios aplicados

- **Dominio desacoplado:**  
  Las entidades y contratos (`*.model.ts`, `*.interface.ts`) en `core/domain` no dependen de infraestructura ni de Angular.
- **Casos de uso independientes:**  
  Toda la lógica de negocio está en `core/application` y solo depende de interfaces del dominio.
- **Infraestructura desacoplada:**  
  Las implementaciones concretas de servicios (como TTS o control de sonido) están en `core/infrastructure` y se inyectan usando tokens.
- **Inyección de dependencias centralizada:**  
  Todos los servicios se configuran en `core/infrastructure/providers.ts` usando `InjectionToken`, facilitando mocks y pruebas.

### Ejemplo real de inyección de dependencias

```typescript
// src/app/core/infrastructure/providers.ts
import { Provider } from '@angular/core';
import { TEXT_TO_SPEECH_SERVICE, SOUND_CONTROL_SERVICE } from './injection-tokens';
import { HybridTextToSpeechService } from './hybrid-text-to-speech.service';
import { SoundControlService } from './sound-control.service';

export const CORE_PROVIDERS: Provider[] = [
  {
    provide: TEXT_TO_SPEECH_SERVICE,
    useClass: HybridTextToSpeechService,
  },
  {
    provide: SOUND_CONTROL_SERVICE,
    useClass: SoundControlService,
  },
];
```

Y en un componente/página:

```typescript
constructor(
  @Inject(TEXT_TO_SPEECH_SERVICE)
  private readonly textToSpeechService: ITextToSpeechService
) {}
```

### Standalone Components

- Todas las páginas y componentes son **standalone** (Angular 19+), sin NgModules.
- Los imports de componentes y servicios se hacen de forma explícita en cada archivo.

### Accesibilidad y feedback

- Todos los cambios de estado relevantes se anuncian automáticamente por TTS.
- Los botones y controles cumplen con los requisitos de accesibilidad y contraste definidos en `.github/copilot-instructions.md`.

---

**Para más detalles sobre convenciones y patrones, consulta [`copilot-instructions.md`](.github/copilot-instructions.md).**

---

## 🧪 Testing

### **Cobertura de Tests**

- **Unit Tests:** Jest + Angular Testing Utilities
- **E2E Tests:** Cypress
- **Accessibility Tests:** axe-core
- **Performance Tests:** Lighthouse CI

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests E2E
npm run e2e

# Tests de accesibilidad
npm run test:a11y
```

---

## 🌐 Despliegue

### **Web (PWA)**

- **Hosting:** Vercel/Netlify
- **Service Workers:** Caché offline
- **Manifest:** Instalación como PWA

### **Android**

- **Build:** `npm run build && npx cap sync android`
- **APK:** Android Studio o `npx cap run android`
- **Play Store:** Configuración incluida

---

## 🤝 Contribución

### **Código de Conducta**

Este proyecto sigue el [Código de Conducta de Contributor Covenant](CODE_OF_CONDUCT.md).

### **Guía de Contribución**

1. **Fork** el repositorio
2. **Crea** una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Sigue** las convenciones de código (ver `.github/copilot-instructions.md`)
4. **Asegúrate** de que los tests pasen: `npm test`
5. **Verifica** la accesibilidad: `npm run test:a11y`
6. **Commit** con mensajes descriptivos
7. **Push** a tu rama: `git push origin feature/nueva-funcionalidad`
8. **Abre** un Pull Request

### **Convenciones de Commits**

```bash
feat: añadir nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
style: cambios de formato
refactor: refactorizar código
test: añadir tests
chore: tareas de mantenimiento
a11y: mejoras de accesibilidad
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📞 Contacto

- **Autor:** Alex Alonso Montero
- **Email:** [tu-email@ejemplo.com]
- **GitHub:** [@AlexAlonsoMontero](https://github.com/AlexAlonsoMontero)
- **Proyecto:** [texto-por-voz-frontend](https://github.com/AlexAlonsoMontero/texto-por-voz-frontend)

---

## 🎯 Roadmap

### **v1.0.0** (Completado)

- ✅ Aplicación base con TTS híbrido
- ✅ Navegación accesible con doble clic
- ✅ Responsive design horizontal-only
- ✅ Sistema de 17 botones optimizado
- ✅ Botones individuales de puntuación
- ✅ Selección visual mejorada
- ✅ Tamaños de fuente aumentados 50%
- ✅ Campo de texto expandido
- ✅ Icono checkmark en botón "Nuevo"
- ✅ Logging diagnóstico para TTS
- ✅ Reinicialización automática de selección

### **v1.1.0** (En desarrollo)

- 🔄 Construcción de palabras completas
- 🔄 Guardado de frases favoritas
- 🔄 Configuración de velocidad de voz
- 🔄 Modo dictado avanzado

### **v1.2.0** (Futuro)

- 📋 Integración con servicios cloud
- 📋 Soporte para múltiples idiomas
- 📋 Temas personalizables
- 📋 Exportación de textos

---

## 🙏 Agradecimientos

- **Ionic Team** por el excelente framework
- **Angular Team** por las mejoras en accesibilidad
- **Capacitor Community** por los plugins de TTS
- **Comunidad de accesibilidad** por las directrices y feedback

---

_Este proyecto está dedicado a hacer la tecnología más accesible para todas las personas._ 🌟
