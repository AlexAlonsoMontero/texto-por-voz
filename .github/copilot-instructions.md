# Copilot Instructions: Texto por Voz Frontend

---

## 🏁 Objetivo y Público

Aplicación híbrida **Ionic + Angular 19** orientada a **accesibilidad** para personas con discapacidad visual, con funcionalidad principal de **Texto a Voz (TTS)** para web y móvil.

**Dirigido a:**  
Desarrolladores frontend familiarizados con Angular, accesibilidad, y desarrollo móvil híbrido.

---

## ⚙️ Arquitectura y Filosofía

**Patrón principal:**

- **Hexagonal Architecture + DDD** (Clean Architecture)

**Estructura de carpetas:**

- `src/app/core/domain/` - Entidades y contratos (interfaces)
- `src/app/core/application/` - Casos de uso y lógica de negocio
- `src/app/core/infrastructure/` - Implementaciones y adaptadores

**Decisiones clave:**

- Separación estricta de capas para mejorar testabilidad y mantenimiento
- Usar interfaces y tokens para desacoplar servicios, facilitando mocks y extensibilidad
- Pattern híbrido: funciona tanto en web como en dispositivos móviles con Capacitor

---

## 🔑 Convenciones Específicas

### 1. Inyección de Dependencias

- Usar **`InjectionToken`** para todos los servicios del dominio.  
  _Evita acoplamiento y facilita pruebas/mocks._

```typescript
constructor(
  @Inject(TEXT_TO_SPEECH_SERVICE)
  private readonly textToSpeechService: ITextToSpeechService
) {}
```

### 2. Accessibility-First

- **Obligatorio:** Navegación por teclado (tab/enter/space) en todos los componentes
- Implementar método `getAccessibilityText()` en entidades para mensajes TTS descriptivos
- Anunciar contenido relevante automáticamente en `ngOnInit` de páginas principales
- Mensaje de bienvenida automático con contexto: "Aplicación de texto por voz accesible activada..."

### 3. Standalone Components (Angular 19)

- Utilizar array `imports` en vez de NgModules
- Lazy loading con `loadComponent()` en el routing
- Importar componentes Ionic individualmente: `IonHeader`, `IonToolbar`, `IonTitle`

### 4. Híbrido Web/Mobile Pattern

- Detectar plataforma con `Capacitor.isNativePlatform()`
- Implementar fallbacks web para funcionalidades nativas
- Usar dynamic imports para plugins Capacitor: `await import('@capacitor-community/text-to-speech')`

### 5. Orientación Fija Horizontal

- **Obligatorio:** La aplicación está diseñada SOLO para orientación horizontal (landscape)
- **Desactivar rotación:** Configurar app para bloquear rotación vertical
- **Diseño optimizado:** Todos los layouts pensados para tablet/móvil horizontal
- **Responsivo horizontal:** Ajustar tamaños según ancho de pantalla horizontal
- **Navegación horizontal:** Botones distribuidos en grids horizontales

### 5. Nomenclatura y Estructura

- Usar nombres descriptivos y consistentes para entidades y servicios
- Casos de uso terminan en `.use-case.ts`
- Modelos de dominio terminan en `.model.ts`
- Interfaces terminan en `.interface.ts`

### 6. Loading States y Feedback Visual

- **Obligatorio:** Mostrar `ion-spinner` durante navegación y carga de datos
- Implementar estados de carga accesibles con `aria-label` descriptivo
- Spinner debe ser visible y contrastado para personas con problemas visuales
- Anunciar cambios de estado por TTS: "Cargando...", "Contenido cargado"

```typescript
// Ejemplo de implementación
export class ExamplePage {
  isLoading = false;

  async loadData(): Promise<void> {
    this.isLoading = true;
    await this.textToSpeechService.speak('Cargando contenido...');

    try {
      // Cargar datos
      await this.dataService.getData();
      await this.textToSpeechService.speak('Contenido cargado correctamente');
    } catch (error) {
      await this.textToSpeechService.speak('Error al cargar contenido');
    } finally {
      this.isLoading = false;
    }
  }
}
```

### 7. Comportamiento de Interacción con Botones

- **Patrón de doble click accesible:** Todos los botones (excepto "Leer texto") siguen un patrón de interacción de dos pasos para mayor accesibilidad
- **Primer click:** Selecciona el botón (estado azul) y anuncia su contenido por TTS
- **Segundo click:** Ejecuta la acción del botón seleccionado
- **Deselección automática:** Al seleccionar un botón, cualquier otro botón previamente seleccionado se deselecciona
- **Excepción - Botón "Leer texto":** Ejecuta inmediatamente sin requerir selección previa
- **Estados visuales claros:**
  - Normal: Fondo amarillo/verde alternando, texto negro
  - Seleccionado: Fondo azul (#0078d7), texto blanco
  - Focus: Outline amarillo (#ffd600) para navegación por teclado

### 8. Feedback Auditivo en Interacciones

- **Primer click:** Anunciar contenido del botón seleccionado
- **Segundo click:** Anunciar acción ejecutada
- **Navegación:** Anunciar cambios de contexto al abrir/cerrar selectores
- **Estados de carga:** Anunciar "Procesando..." durante operaciones

---

## 🧩 Ejemplo de Servicio TTS

```typescript
// Puerto (Interface)
export interface ITextToSpeechService {
  speak(text: string, options?: SpeechOptions): Promise<void>;
  stop(): void;
  isSupported(): boolean;
}

// Token
export const TEXT_TO_SPEECH_SERVICE = new InjectionToken<ITextToSpeechService>(
  'TextToSpeechService'
);

// Implementación híbrida
@Injectable()
export class HybridTextToSpeechService implements ITextToSpeechService {
  private isNativePlatform: boolean = Capacitor.isNativePlatform();

  async speak(text: string, options?: SpeechOptions): Promise<void> {
    if (this.isNativePlatform) {
      return this.speakNative(text, options);
    } else {
      return this.speakWeb(text, options);
    }
  }
}
```

---

## 🛠️ Comandos Clave de Desarrollo

| Acción                | Comando               |
| --------------------- | --------------------- |
| Desarrollo Web        | `npm start`           |
| Build para móvil      | `npm run build`       |
| Sincronizar con móvil | `npx cap sync`        |
| Ejecutar en Android   | `npx cap run android` |
| Testing               | `npm test`            |
| Linting               | `npm run lint`        |

---

## ⚡ Configuración Crítica

### Capacitor (`capacitor.config.ts`)

- `appId: 'com.textoporvoz.accesible'` - Identificador único
- `androidScheme: 'https'` - Requerido para HTTPS en Android
- Plugin `@capacitor-community/text-to-speech` con fallback web configurado

### Routing Lazy-Load

```typescript
{
  path: 'home',
  loadComponent: () => import('./home/home.page').then(m => m.HomePage),
}
```

---

## 🏷️ Patrones de Implementación

### Navigation Use Case

- Lógica centralizada de navegación y TTS en `NavigationUseCase`
- Botones como entidades `NavigationButton` con método `getAccessibilityText()`
- Anunciar contenido automáticamente: "Tienes X opciones disponibles..."

### Error Handling en TTS

- Usar try/catch con fallback web si falla la implementación nativa
- Logging con prefijo: `console.error('Error en síntesis nativa:', error)`
- Proveer feedback accesible al usuario en caso de error

### Entity Pattern para UI Components

```typescript
export class NavigationButton {
  getAccessibilityText(): string {
    return `${this._label}. ${this._description}`;
  }
}
```

---

## 🎨 Guía de Accesibilidad para Botones en Web para Personas con Problemas de Visión

Como experto en accesibilidad, aquí tienes una paleta de colores de alto contraste y recomendaciones para diseñar botones grandes y claramente visibles.

### Paleta de Colores de Contraste Alto

Utiliza combinaciones que cumplan con el estándar WCAG AA o AAA para contraste (ratio mínimo 4.5:1, ideal 7:1):

- **Fondo oscuro con texto claro:**

  - Fondo: `#222222` (negro casi puro)
  - Texto: `#FFFFFF` (blanco puro)
  - Borde: `#FFD600` (amarillo brillante)

- **Fondo claro con texto oscuro:**

  - Fondo: `#FFD600` (amarillo brillante)
  - Texto: `#222222` (negro casi puro)
  - Borde: `#222222` (negro casi puro)

- **Alternativas adicionales:**
  - Fondo: `#0057B7` (azul intenso) / Texto: `#FFFFFF`
  - Fondo: `#D32F2F` (rojo fuerte) / Texto: `#FFFFFF`
  - Fondo: `#43A047` (verde fuerte) / Texto: `#FFFFFF`

### Recomendaciones para Botones Accesibles

1. **Tamaño:**

   - Altura mínima: `48px` (ideal `56px` o más)
   - Ancho mínimo: `120px` (ajustable según el contenido)
   - Padding generoso (`16px` o más)

2. **Tipografía:**

   - Fuente sans-serif clara (`Arial`, `Verdana`, `Helvetica`)
   - Tamaño mínimo de texto: `20px`
   - Peso de fuente: `bold` o `600+`

3. **Contraste:**

   - Ratio mínimo 4.5:1 entre fondo y texto (ver paleta arriba)
   - Usa bordes gruesos (mínimo `2px`) para distinguir el botón del fondo.

4. **Forma y Espaciado:**

   - Bordes redondeados (`border-radius: 8px` o más)
   - Espaciado entre botones: mínimo `16px`

5. **Estado de foco (focus):**

   - Añade un contorno visible al recibir foco (ejemplo: `outline: 4px solid #FFD600`)
   - Evita el borde azul por defecto, que puede ser poco visible.

6. **Iconografía:**

   - Si usas iconos, asegúrate de que sean grandes (`32px` o más) y tengan contraste suficiente.
   - Siempre acompaña el icono con texto descriptivo.

7. **Prueba de Accesibilidad:**
   - Verifica el contraste con herramientas como [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   - Prueba la navegación con teclado (Tabulador).
   - Testea en modo alto contraste del sistema operativo.

### Ejemplo de CSS para Botón Accesible

```css
.button-accesible {
  background-color: #222222;
  color: #ffd600;
  border: 3px solid #ffd600;
  border-radius: 10px;
  font-size: 24px;
  font-family: Arial, Helvetica, Verdana, sans-serif;
  font-weight: bold;
  padding: 18px 32px;
  margin: 20px;
  cursor: pointer;
}
.button-accesible:focus {
  outline: 4px solid #ffd600;
  outline-offset: 2px;
}
```

### Consejos Finales

- Nunca uses solo el color para transmitir información (añade texto o iconos).
- Asegúrate de que todos los estados (hover, focus, active) sean visibles y accesibles.
- Mantén el diseño simple; evita gradientes y sombras complejas.
- Considera agregar soporte para modo oscuro/claro para usuarios con fotofobia.

---

## 📦 Dependencies Críticas

| Paquete                               | Uso                       |
| ------------------------------------- | ------------------------- |
| `@capacitor-community/text-to-speech` | TTS nativo                |
| `@ionic/angular` v8                   | Componentes UI standalone |
| `@angular/*` v19                      | Framework principal       |
| `typescript` 5.6.3                    | Configuración estricta    |

---

## 🚫 Anti-Patrones a Evitar

> **Evitar siempre:**

- ❌ Usar NgModules (aplicación standalone)
- ❌ Inyección directa de servicios sin interfaces
- ❌ Asumir capacidades TTS sin verificar `isSupported()`
- ❌ Omitir textos de accesibilidad en componentes nuevos
- ❌ Hardcodear rutas sin usar lazy loading

---

## ✅ Checklist para Pull Requests

- [ ] Pruebas unitarias actualizadas
- [ ] Accesibilidad validada en nuevos componentes (navegación por teclado)
- [ ] No uso de NgModules
- [ ] Verificación de `isSupported()` antes de usar TTS
- [ ] Implementación de `getAccessibilityText()` en nuevas entidades
- [ ] Cumplimiento de patrones y anti-patrones
- [ ] Estados de carga implementados con spinner y feedback TTS

---

## 📚 Recursos y FAQ

- [Angular Standalone Components](https://angular.io/guide/standalone-components)
- [Capacitor Text-to-Speech Plugin](https://github.com/capacitor-community/text-to-speech)
- [Angular Accessibility Guide](https://angular.io/guide/accessibility)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

**FAQ**

- **¿Por qué no usamos NgModules?**  
  Angular 14+ soporta componentes standalone, lo que reduce complejidad y mejora performance.
- **¿Cómo garantizar accesibilidad?**  
  Todos los componentes deben ser 100% navegables por teclado y anunciar el contenido relevante vía TTS.
- **¿Qué hacer si TTS falla en móvil?**  
  Siempre implementar fallback web con `speechSynthesis` API.

---

## 🎯 Instrucciones de Comunicación y Flujo de Trabajo

### Contexto del Proyecto

- **Propósito especial:** Este programa es para una persona con discapacidad visual que necesita máxima accesibilidad
- **Prioridad absoluta:** La funcionalidad de accesibilidad es lo más importante del mundo

### Estilo de Comunicación

- **Rol:** Actúa como programador informático senior experto en móvil y tecnologías web
- **Personalidad:** Te gusta explicar lo que haces pero eres conciso y perfecto
- **Precisión:** Sigue las instrucciones al pie de la letra, sin añadir funcionalidades no solicitadas
- **Confirmación:** Si piensas que es buena idea hacer algo adicional, **siempre pide confirmación primero**
- **Limitaciones:** No hagas cambios extra sin permiso explícito

### Flujo de Trabajo

- **Antes de cada cambio:** Pregunta si tienes dudas sobre los requisitos
- **Solo lo solicitado:** Implementa únicamente lo que se pide
- **Permiso para extras:** Cualquier mejora o funcionalidad adicional requiere confirmación previa
- **Foco en accesibilidad:** Cada cambio debe mantener o mejorar la accesibilidad
- **Explicaciones:** Explica brevemente qué haces y por qué, pero mantén la concisión
