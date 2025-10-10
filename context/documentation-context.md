# 📚 Contexto de Documentación - Estándares y Prácticas

## 🎯 Filosofía de Documentación

### Principios de Documentación Accesible

1. **Documentación como código** - Versionada, revisada, automatizada
2. **Lenguaje claro y directo** - Sin jerga técnica innecesaria
3. **Ejemplos funcionales** - Código que se puede copiar y usar
4. **Documentación multimodal** - Texto, diagramas, videos explicativos
5. **Actualización continua** - Documentación sincronizada con código

### Audiencias Objetivo

```
Desarrolladores (80%) - Guías técnicas, APIs, patrones
├── Nuevos desarrolladores en el proyecto
├── Desarrolladores experimentados buscando referencia
├── Mantenedores del código
└── Revisores de código

Usuarios Finales (15%) - Manuales de usuario, accesibilidad
├── Usuarios con discapacidades visuales
├── Usuarios con dificultades motoras
└── Cuidadores y asistentes

Stakeholders (5%) - Arquitectura, decisiones, roadmap
├── Product managers
├── Especialistas en accesibilidad
└── Gerencia técnica
```

## 📖 Estructura de Documentación

### Jerarquía de Archivos

```
docs/
├── README.md                    # Entrada principal del proyecto
├── CONTRIBUTING.md              # Guía para contribuidores
├── ACCESSIBILITY.md             # Estándares de accesibilidad
├── DEPLOYMENT.md                # Instrucciones de despliegue
├── TROUBLESHOOTING.md           # Resolución de problemas comunes
├── CHANGELOG.md                 # Historial de cambios
├── api/                         # Documentación de APIs
│   ├── services.md              # Documentación de servicios
│   ├── components.md            # Documentación de componentes
│   └── interfaces.md            # Documentación de interfaces
├── guides/                      # Guías paso a paso
│   ├── getting-started.md       # Guía de inicio rápido
│   ├── theme-customization.md   # Personalización de temas
│   ├── tts-integration.md       # Integración text-to-speech
│   └── testing-guide.md         # Guía de testing
├── architecture/                # Documentación de arquitectura
│   ├── overview.md              # Visión general de la arquitectura
│   ├── hexagonal-architecture.md
│   ├── dependency-injection.md
│   └── hybrid-services.md       # Servicios híbridos web/móvil
└── examples/                    # Ejemplos de código
    ├── basic-component.md
    ├── accessible-form.md
    └── theme-implementation.md
```

### README.md Principal

```markdown
# 🗣️ Texto por Voz - App de Accesibilidad

> Aplicación híbrida Angular 20 + Ionic 8 para text-to-speech, diseñada con enfoque en accesibilidad para usuarios con discapacidades visuales.

## ⚡ Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo web
npm start

# Desarrollo móvil Android
ionic capacitor run android

# Desarrollo móvil iOS  
ionic capacitor run ios
```

## ♿ Características de Accesibilidad

- **WCAG AAA compliance** - Contraste 7:1, navegación completa por teclado
- **Text-to-Speech híbrido** - Funciona en web (Web Speech API) y móvil (Capacitor)
- **Temas personalizables** - Alto contraste, colores ajustables
- **Press-hold buttons** - Para usuarios con dificultades motoras
- **Retroalimentación por voz** - Cada acción se anuncia audiblemente

## 🏗️ Arquitectura

Este proyecto utiliza **Arquitectura Hexagonal + DDD** con:

- **Standalone Components** (Angular 20)
- **InjectionTokens** para inversión de dependencias
- **Servicios híbridos** que detectan plataforma automáticamente
- **Theming dinámico** con CSS custom properties

## 📱 Plataformas Soportadas

| Plataforma | Estado | Características |
|------------|--------|-----------------|
| Web | ✅ | Web Speech API, PWA |
| Android | ✅ | Capacitor TTS, navegación nativa |
| iOS | ✅ | Capacitor TTS, VoiceOver |

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests con cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e

# Tests de accesibilidad
npm run test:accessibility
```

## 📚 Documentación

- [🚀 Guía de inicio](docs/guides/getting-started.md)
- [♿ Estándares de accesibilidad](docs/ACCESSIBILITY.md)
- [🏗️ Arquitectura del proyecto](docs/architecture/overview.md)
- [🎨 Personalización de temas](docs/guides/theme-customization.md)
- [🧪 Guía de testing](docs/guides/testing-guide.md)

## 🤝 Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para instrucciones detalladas.

## 📄 Licencia

MIT © [Proyecto Texto por Voz]
```

## 📝 Documentación de APIs

### Template para Servicios

```markdown
# 🔊 TextToSpeechService

> Servicio híbrido para text-to-speech que funciona tanto en web como en móvil.

## 📋 Interface

```typescript
interface ITextToSpeechService {
  speak(text: string, options?: SpeechOptions): Promise<void>;
  stop(): Promise<void>;
  isSupported(): boolean;
  getVoices(): Promise<SpeechVoice[]>;
  initialize(): Promise<void>;
}
```

## 🚀 Uso Básico

```typescript
// Inyección con token (OBLIGATORIO)
constructor(
  @Inject(TEXT_TO_SPEECH_SERVICE)
  private readonly tts: ITextToSpeechService
) {}

// Uso simple
async speakMessage(): Promise<void> {
  try {
    await this.tts.speak('Hola, bienvenido a la aplicación');
  } catch (error) {
    console.error('Error al reproducir TTS:', error);
  }
}

// Uso con opciones
async speakWithOptions(): Promise<void> {
  await this.tts.speak('Mensaje personalizado', {
    lang: 'es-ES',
    rate: 1.2,
    pitch: 1.1,
    volume: 0.8
  });
}
```

## ⚙️ Opciones de Configuración

| Opción | Tipo | Por Defecto | Descripción |
|--------|------|-------------|-------------|
| `lang` | `string` | `'es-ES'` | Idioma del texto |
| `rate` | `number` | `1.0` | Velocidad (0.1 - 10) |
| `pitch` | `number` | `1.0` | Tono (0 - 2) |
| `volume` | `number` | `1.0` | Volumen (0 - 1) |

## 🔄 Estados del Servicio

El servicio maneja diferentes estados internos:

- `UNINITIALIZED` - Servicio no inicializado
- `INITIALIZING` - Inicialización en progreso
- `READY` - Listo para usar
- `ERROR` - Error en inicialización

```typescript
// Verificar estado antes de usar
if (this.tts.isReady()) {
  await this.tts.speak('El servicio está listo');
}
```

## 🌐 Detección de Plataforma

El servicio detecta automáticamente la plataforma:

```typescript
// En Web - usa Web Speech API
if (!Capacitor.isNativePlatform()) {
  // speechSynthesis.speak()
}

// En Móvil - usa Capacitor TTS
if (Capacitor.isNativePlatform()) {
  // @capacitor-community/text-to-speech
}
```

## ⚠️ Manejo de Errores

```typescript
try {
  await this.tts.speak('Texto de prueba');
} catch (error) {
  if (error.message.includes('not supported')) {
    // TTS no soportado en esta plataforma
    this.showVisualFeedback('TTS no disponible');
  } else if (error.message.includes('activation required')) {
    // En web, mostrar modal de activación
    this.showTTSActivationModal();
  } else {
    // Error genérico
    console.error('Error TTS:', error);
  }
}
```

## 🧪 Testing

```typescript
describe('TextToSpeechService', () => {
  let mockTtsService: jasmine.SpyObj<ITextToSpeechService>;

  beforeEach(() => {
    mockTtsService = jasmine.createSpyObj('ITextToSpeechService', [
      'speak', 'stop', 'isSupported', 'getVoices'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: TEXT_TO_SPEECH_SERVICE, useValue: mockTtsService }
      ]
    });
  });

  it('should speak text successfully', async () => {
    mockTtsService.speak.and.returnValue(Promise.resolve());
    
    await service.speak('Test message');
    
    expect(mockTtsService.speak).toHaveBeenCalledWith(
      'Test message',
      jasmine.any(Object)
    );
  });
});
```

## 📚 Ver También

- [ThemeService](./theme-service.md) - Para personalización visual
- [Guía de Accesibilidad](../ACCESSIBILITY.md) - Mejores prácticas
- [Testing Guide](../guides/testing-guide.md) - Estrategias de testing
```

### Template para Componentes

```markdown
# 🔘 PressHoldButtonComponent

> Botón especializado para usuarios con dificultades motoras que requiere mantener presionado para activar.

## 📋 Selector

```html
<app-press-hold-button></app-press-hold-button>
```

## 🎯 Casos de Uso

- Usuarios con temblor o espasmos musculares
- Prevención de activaciones accidentales
- Acciones críticas que requieren confirmación
- Interfaces accesibles con feedback visual

## 🔧 API del Componente

### Inputs

| Input | Tipo | Por Defecto | Descripción |
|-------|------|-------------|-------------|
| `buttonId` | `string` | requerido | ID único para el botón |
| `holdDuration` | `number` | `3000` | Duración en ms para activar |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `ariaLabel` | `string` | `''` | Etiqueta de accesibilidad |
| `showProgress` | `boolean` | `true` | Mostrar barra de progreso |
| `hapticFeedback` | `boolean` | `true` | Vibración en móviles |

### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `actionExecuted` | `EventEmitter<void>` | Se emite al completar hold |
| `pressStarted` | `EventEmitter<void>` | Se emite al iniciar press |
| `pressCancelled` | `EventEmitter<void>` | Se emite al cancelar |
| `progressUpdate` | `EventEmitter<number>` | Progreso del hold (0-100) |

## 🚀 Uso Básico

```html
<app-press-hold-button
  buttonId="save-settings"
  [holdDuration]="2000"
  ariaLabel="Mantén presionado para guardar configuración"
  (actionExecuted)="onSaveSettings()"
  (pressStarted)="onPressStart()"
  (pressCancelled)="onPressCancel()">
  
  <ion-icon name="save-outline" slot="start"></ion-icon>
  Guardar Configuración
</app-press-hold-button>
```

```typescript
export class SettingsComponent {
  onSaveSettings(): void {
    // Lógica para guardar
    console.log('Configuración guardada');
  }

  onPressStart(): void {
    // Feedback visual o auditivo opcional
    this.showPressStartedFeedback();
  }

  onPressCancel(): void {
    // Manejar cancelación
    this.showPressCancelledFeedback();
  }
}
```

## 🎨 Personalización Visual

```scss
app-press-hold-button {
  --progress-color: var(--ion-color-primary);
  --progress-background: var(--ion-color-light);
  --button-background: var(--ion-color-secondary);
  --button-color: var(--ion-color-secondary-contrast);
  --hold-scale: 1.05; // Escala durante hold
}

// Estados del botón
.press-hold-button {
  &.pressing {
    transform: scale(var(--hold-scale));
    transition: transform 0.2s ease;
  }
  
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

// Barra de progreso
.progress-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: var(--progress-color);
  transition: width linear;
}
```

## ♿ Características de Accesibilidad

### Navegación por Teclado

- **Espacio/Enter**: Inicia el hold
- **Escape**: Cancela el hold en progreso
- **Tab**: Navegación normal entre elementos

### ARIA y Lectores de Pantalla

```html
<!-- Atributos ARIA automáticos -->
<button
  [attr.aria-label]="ariaLabel"
  [attr.aria-describedby]="buttonId + '-description'"
  [attr.aria-pressed]="isPressed"
  role="button">
  
  <ng-content></ng-content>
  
  <!-- Descripción para lectores de pantalla -->
  <span
    [id]="buttonId + '-description'"
    class="sr-only">
    Mantén presionado durante {{ holdDuration / 1000 }} segundos para activar
  </span>
</button>
```

### Estados Anunciables

El componente anuncia estados via TTS:

- "Botón presionado, mantén para activar"
- "Acción completada" 
- "Acción cancelada"

## 📱 Comportamiento Móvil

### Gestos Táctiles

- **touchstart**: Inicia el hold
- **touchend**: Termina el hold
- **touchcancel**: Cancela el hold (si el dedo sale del área)

### Vibración Háptica

```typescript
// Vibración al iniciar (si está habilitada)
if (this.hapticFeedback && Capacitor.isNativePlatform()) {
  Haptics.impact({ style: ImpactStyle.Light });
}

// Vibración al completar
if (this.hapticFeedback && Capacitor.isNativePlatform()) {
  Haptics.impact({ style: ImpactStyle.Heavy });
}
```

## 🧪 Testing

```typescript
describe('PressHoldButtonComponent', () => {
  let component: PressHoldButtonComponent;
  let fixture: ComponentFixture<PressHoldButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressHoldButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PressHoldButtonComponent);
    component = fixture.componentInstance;
    
    // Setup básico
    component.buttonId = 'test-button';
    component.holdDuration = 1000;
    fixture.detectChanges();
  });

  it('should emit actionExecuted after hold duration', fakeAsync(() => {
    let actionExecuted = false;
    component.actionExecuted.subscribe(() => actionExecuted = true);

    const button = fixture.debugElement.query(By.css('button'));
    
    // Simular press start
    button.triggerEventHandler('mousedown', {});
    
    // Avanzar tiempo hasta justo antes de completar
    tick(999);
    expect(actionExecuted).toBeFalse();
    
    // Completar el hold
    tick(2);
    expect(actionExecuted).toBeTrue();
  }));

  it('should cancel on early release', fakeAsync(() => {
    let actionExecuted = false;
    let pressCancelled = false;
    
    component.actionExecuted.subscribe(() => actionExecuted = true);
    component.pressCancelled.subscribe(() => pressCancelled = true);

    const button = fixture.debugElement.query(By.css('button'));
    
    button.triggerEventHandler('mousedown', {});
    tick(500); // Mitad del tiempo
    button.triggerEventHandler('mouseup', {});
    tick(600); // Resto del tiempo
    
    expect(actionExecuted).toBeFalse();
    expect(pressCancelled).toBeTrue();
  }));
});
```

## 📚 Ver También

- [Accessibility Guide](../ACCESSIBILITY.md) - Estándares de accesibilidad
- [Theme Customization](../guides/theme-customization.md) - Personalización visual
- [Testing Guide](../guides/testing-guide.md) - Estrategias de testing
```

## 📖 Guías de Usuario

### Template para Guía de Inicio

```markdown
# 🚀 Guía de Inicio Rápido

> Puesta en marcha del proyecto Texto por Voz en menos de 5 minutos.

## ✅ Pre-requisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **npm** >= 9.0.0 (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/))

### Para Desarrollo Móvil (Opcional)

- **Android Studio** para desarrollo Android
- **Xcode** para desarrollo iOS (solo macOS)

## 📥 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/texto-voz.git
cd texto-voz
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Entorno

```bash
# Copiar archivo de configuración
cp src/environments/environment.example.ts src/environments/environment.ts

# Editar configuración si es necesario
nano src/environments/environment.ts
```

## 🌐 Desarrollo Web

### Servidor de Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Primera Ejecución

1. **Activar Text-to-Speech**: En la primera visita, aparecerá un modal para activar TTS
2. **Navegar con teclado**: Usa Tab/Shift+Tab para moverte entre elementos
3. **Probar funcionalidad**: Los botones tienen feedback por voz

## 📱 Desarrollo Móvil

### Android

```bash
# Añadir plataforma Android
ionic capacitor add android

# Ejecutar en dispositivo/emulador
ionic capacitor run android
```

### iOS

```bash
# Añadir plataforma iOS
ionic capacitor add ios

# Ejecutar en dispositivo/simulador
ionic capacitor run ios
```

## 🧪 Verificar Instalación

### Tests Automáticos

```bash
# Tests unitarios
npm test

# Tests con cobertura
npm run test:coverage
```

### Verificación Manual

1. **Accesibilidad**: Navega solo con teclado
2. **TTS**: Activa y prueba la síntesis de voz
3. **Temas**: Cambia entre temas en Configuración
4. **Responsive**: Prueba en diferentes tamaños de pantalla

## 🎨 Personalización Básica

### Cambiar Colores del Tema

Edita `src/theme/variables.scss`:

```scss
:root {
  --ion-color-primary: #your-primary-color;
  --ion-color-secondary: #your-secondary-color;
}
```

### Configurar TTS por Defecto

Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  tts: {
    defaultLang: 'es-ES',
    defaultRate: 1.0,
    defaultPitch: 1.0,
  }
};
```

## 🚨 Resolución de Problemas

### Error: "Command not found: ionic"

```bash
npm install -g @ionic/cli
```

### Error: TTS no funciona en navegador

- Verifica que el navegador soporte Web Speech API
- Asegúrate de activar TTS con el modal al inicio
- Prueba en HTTPS (requerido por algunos navegadores)

### Error de permisos en Android

Verifica que estén configurados los permisos en `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## 📚 Siguientes Pasos

1. [📖 Leer la documentación completa](../README.md)
2. [♿ Revisar guía de accesibilidad](../ACCESSIBILITY.md)
3. [🏗️ Entender la arquitectura](../architecture/overview.md)
4. [🧪 Configurar testing](../guides/testing-guide.md)

## 🤝 Obtener Ayuda

- [📋 Issues en GitHub](https://github.com/tu-usuario/texto-voz/issues)
- [💬 Discusiones](https://github.com/tu-usuario/texto-voz/discussions)
- [📧 Contacto del equipo](mailto:equipo@texto-voz.com)
```

## 🔄 Mantenimiento de Documentación

### Automatización con Scripts

```json
{
  "scripts": {
    "docs:build": "compodoc -p tsconfig.json -s",
    "docs:serve": "compodoc -p tsconfig.json -s -w",
    "docs:test": "markdownlint docs/**/*.md",
    "docs:fix": "markdownlint docs/**/*.md --fix",
    "docs:validate": "npm run docs:test && npm run docs:build"
  }
}
```

### Workflow de GitHub Actions

```yaml
# .github/workflows/docs.yml
name: Documentation

on:
  push:
    branches: [ main, develop ]
    paths: [ 'docs/**', 'src/**/*.ts' ]
  pull_request:
    paths: [ 'docs/**', 'src/**/*.ts' ]

jobs:
  validate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint markdown
        run: npm run docs:test
      
      - name: Build API docs
        run: npm run docs:build
      
      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./documentation
```

### Plantilla de Pull Request

```markdown
<!-- .github/pull_request_template.md -->
## 📋 Descripción

Describe los cambios realizados en este PR.

## ✅ Checklist

### Código
- [ ] Tests añadidos/actualizados
- [ ] Cumple estándares de accesibilidad
- [ ] Funciona en web y móvil
- [ ] Logging implementado

### Documentación
- [ ] README actualizado si es necesario
- [ ] Documentación de API actualizada
- [ ] Ejemplos de código incluidos
- [ ] Guías de usuario actualizadas

### Accesibilidad 
- [ ] Navegación por teclado funciona
- [ ] ARIA labels implementados
- [ ] Contraste cumple WCAG AAA
- [ ] TTS feedback incluido

## 🧪 Testing

Describe cómo se han probado los cambios:

- [ ] Tests unitarios pasan
- [ ] Tests E2E pasan  
- [ ] Probado manualmente en:
  - [ ] Chrome/Firefox (web)
  - [ ] Android
  - [ ] iOS

## 📸 Screenshots

Si hay cambios visuales, incluye capturas de pantalla.

## 📚 Documentación Relacionada

Enlaces a documentación relevante que se ha actualizado o que explica estos cambios.
```

## 📊 Métricas de Calidad de Documentación

### Configuración de Markdownlint

```json
// .markdownlint.json
{
  "line-length": {
    "line_length": 100
  },
  "no-duplicate-header": true,
  "no-trailing-punctuation": {
    "punctuation": ".,;:!"
  },
  "code-block-style": {
    "style": "fenced"
  },
  "emphasis-style": {
    "style": "asterisk"
  },
  "strong-style": {
    "style": "asterisk"
  }
}
```

### Métricas de Cobertura

```typescript
// scripts/docs-coverage.js
const metrics = {
  apiDocumentation: '95%', // APIs documentadas
  codeExamples: '90%',     // Ejemplos funcionales
  accessibility: '100%',   // Guías a11y completas
  upToDate: '98%',         // Docs sincronizadas con código
  userGuides: '85%',       // Cobertura de funcionalidades
};
```

## 📋 Checklist de Documentación

### Para Nuevas Características

- [ ] Documentación de API añadida
- [ ] Ejemplos de código incluidos
- [ ] Guía de usuario actualizada
- [ ] Tests de documentación (ejemplos funcionales)
- [ ] Screenshots/diagramas si es necesario
- [ ] Consideraciones de accesibilidad documentadas

### Para Refactoring

- [ ] Documentación existente revisada
- [ ] Ejemplos actualizados
- [ ] Referencias cruzadas verificadas
- [ ] Changelog actualizado
- [ ] Breaking changes documentados

### Para Releases

- [ ] CHANGELOG.md actualizado
- [ ] README.md revisado
- [ ] Documentación de migración (si aplica)
- [ ] Release notes preparadas
- [ ] Documentación deployada