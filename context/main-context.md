# 🎯 Contexto Principal - Texto por Voz

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Angular 20.0.0** - Framework principal con componentes standalone
- **Ionic 8.0.0** - UI Components y navegación híbrida  
- **Capacitor 7.4.3** - Bridge para funcionalidades nativas
- **TypeScript 5.8.0** - Tipado estricto con configuración ES2021

### Patrón Arquitectural: Hexagonal + DDD
```
src/app/
├── core/
│   ├── domain/interfaces/      # Contratos (puertos)
│   ├── application/           # Casos de uso (futuro)
│   └── infrastructure/        # Adaptadores
│       ├── services/         # Implementaciones híbridas
│       ├── injection-tokens.ts
│       └── providers.ts
├── shared/components/         # Componentes reutilizables
├── pages/                    # Páginas de la aplicación
└── home/                     # Página principal
```

## 🎯 Propósito Crítico del Proyecto

**ATENCIÓN MÁXIMA:** Esta aplicación es para una persona con discapacidad visual.
La accesibilidad NO es opcional - es LA PRIORIDAD ABSOLUTA.

### Usuarios Objetivo
- Personas con discapacidad visual
- Usuarios que dependen de síntesis de voz
- Navegación exclusiva por teclado
- Interfaces de alto contraste

## 🔑 Patrones Fundamentales

### 1. Inyección de Dependencias OBLIGATORIA
```typescript
// ✅ SIEMPRE usar InjectionTokens
@Inject(TEXT_TO_SPEECH_SERVICE) private tts: ITextToSpeechService

// ❌ NUNCA inyección directa
constructor(private tts: HybridTextToSpeechService)
```

### 2. Servicios Híbridos Web/Móvil
Todos los servicios detectan plataforma automáticamente:
```typescript
if (Capacitor.isNativePlatform()) {
  // Usar plugin nativo
} else {
  // Usar API web con fallback
}
```

### 3. Componentes Standalone (Angular 20)
```typescript
@Component({
  standalone: true,
  imports: [CommonModule, IonButton, IonContent],
})
```

## ♿ Requisitos de Accesibilidad NO NEGOCIABLES

### Navegación por Teclado
- **Tab/Shift+Tab:** Navegación entre elementos
- **Enter/Space:** Activación de botones  
- **Escape:** Cancelar/salir de modales

### Feedback TTS Obligatorio
- Toda acción debe anunciar su resultado
- Mensajes de bienvenida al entrar a páginas
- Estados de carga y progreso
- Confirmaciones de acciones

### Patrones Visuales Accesibles
- Contraste mínimo 4.5:1 (ideal 7:1)
- Botones mínimo 48px altura
- Focus indicators visibles (#FFD600)
- Tipografía sans-serif, mínimo 20px

## 🚀 Funcionalidades Implementadas

### Sistema TTS Híbrido
- **Web:** speechSynthesis API con activación manual
- **Móvil:** @capacitor-community/text-to-speech
- **Estados:** UNINITIALIZED → INITIALIZING → READY/ERROR
- **Componente:** TtsActivationComponent para web

### Press-Hold Buttons (Accesibilidad Motora)
- Mantener presionado 2-3 segundos para activar
- Animación SVG de progreso circular
- Feedback háptico en móvil
- Componente: PressHoldButtonComponent

### Sistema de Temas Dinámico
- Variables CSS personalizables
- 4 variables principales: primary, secondary, background, text
- Inicialización automática en AppComponent
- Servicio: ThemeService con IonicVariables

## 🛠️ Comandos de Desarrollo

```bash
# Desarrollo web
npm start

# Build producción  
npm run build

# Desarrollo móvil
ionic capacitor run android
ionic capacitor run ios

# Testing
npm test

# Linting
npm run lint
```

## 📂 Archivos Críticos

### Configuración DI
- `core/infrastructure/injection-tokens.ts` - Todos los tokens
- `core/infrastructure/providers.ts` - Configuración servicios

### Componentes Clave
- `shared/components/press-hold-button/` - Botones accesibles
- `shared/components/tts-activation/` - Activación TTS web
- `shared/components/color-selector/` - Selector de colores

### Servicios Principales
- `core/infrastructure/services/hybrid-text-to-speech.service.ts`
- `core/infrastructure/services/theme.service.ts`

## 🚫 Exclusiones de Análisis

**NUNCA analizar estas carpetas:**
- `node_modules/`
- `dist/`
- `build/` 
- `.angular/`
- `android/build/`
- `ios/build/`
- `www/`

## 📋 Checklist de Validación

### Para Cualquier Cambio
- [ ] Mantiene navegación por teclado
- [ ] Incluye feedback TTS apropiado
- [ ] Usa InjectionTokens para servicios
- [ ] Contraste visual adecuado
- [ ] Compila sin errores TypeScript
- [ ] Funciona en web Y móvil

### Para Nuevos Componentes
- [ ] Standalone component
- [ ] Attributes aria-label
- [ ] Handlers keydown.enter/space
- [ ] Focus indicators visibles
- [ ] Integrado con ThemeService

## 🎨 Paleta de Colores Estándar

```scss
// Colores por defecto (WCAG AAA)
$primary: #FFD600;      // Amarillo brillante
$secondary: #0057B7;    // Azul intenso  
$background: #FFFFFF;   // Blanco puro
$text: #222222;         // Negro casi puro

// Focus y estados
$focus-color: #FFD600;  // Amarillo outline
$success: #43A047;      // Verde fuerte
$error: #D32F2F;        // Rojo fuerte
```

## 💡 Principios de Desarrollo

1. **Accesibilidad Primero** - Cada decisión se evalúa por su impacto en usuarios con discapacidades
2. **Arquitectura Estricta** - Mantener separación de capas sin excepciones
3. **Híbrido por Diseño** - Todo debe funcionar en web y móvil
4. **Testing Continuo** - Mockeado via InjectionTokens
5. **Documentación Viva** - README actualizado con cada cambio