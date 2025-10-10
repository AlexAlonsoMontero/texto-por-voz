# ♿ Contexto de Accesibilidad - Prioridad Crítica

## 🚨 ATENCIÓN MÁXIMA

Esta aplicación es para una persona con discapacidad visual. La accesibilidad no es una característica opcional - ES LA FUNCIONALIDAD PRINCIPAL.

## 🎯 Principios Fundamentales

### 1. Navegación por Teclado (OBLIGATORIO)

Toda la aplicación debe ser 100% navegable sin ratón:

```typescript
// Ejemplo obligatorio en todos los componentes interactivos
@HostListener('keydown.enter', ['$event'])
@HostListener('keydown.space', ['$event'])
onKeyboardActivate(event: KeyboardEvent): void {
  event.preventDefault();
  this.onClick();
}
```

**Teclas estándar:**

- `Tab/Shift+Tab` - Navegación entre elementos
- `Enter/Space` - Activación de botones
- `Escape` - Cancelar/cerrar modales
- `Arrow keys` - Navegación en listas/menús

### 2. Síntesis de Voz (TTS) Obligatoria

Cada acción debe proporcionar feedback auditivo:

```typescript
// Patrón estándar para anuncios TTS
async announceAction(message: string): Promise<void> {
  await this.tts.speak(message, {
    priority: SpeechPriority.HIGH,
    interrupt: true
  });
}
```

**Cuándo anunciar:**

- Entrada a nuevas páginas/secciones
- Resultado de acciones de usuario
- Estados de carga y progreso
- Errores y confirmaciones
- Cambios de contexto

### 3. Atributos ARIA Obligatorios

Todos los elementos interactivos requieren etiquetas descriptivas:

```typescript
// Ejemplo de implementación correcta
<button
  [attr.aria-label]="getAccessibilityText()"
  [attr.aria-describedby]="buttonId + '-description'"
  (click)="onAction()"
  (keydown.enter)="onAction()"
  (keydown.space)="onAction()">
```

## 🎨 Estándares Visuales WCAG

### Contraste de Color (Nivel AAA)

Ratio mínimo 7:1 para texto normal, 4.5:1 para texto grande:

```scss
// Combinaciones aprobadas WCAG AAA
.high-contrast-primary {
  background: #ffd600; // Amarillo brillante
  color: #222222; // Negro casi puro
  // Ratio: 8.2:1 ✅
}

.high-contrast-secondary {
  background: #0057b7; // Azul intenso
  color: #ffffff; // Blanco puro
  // Ratio: 8.2:1 ✅
}

.high-contrast-success {
  background: #43a047; // Verde fuerte
  color: #ffffff; // Blanco puro
  // Ratio: 5.8:1 ✅
}
```

### Tamaños Mínimos (Touch Targets)

```scss
// Todos los elementos interactivos
.accessible-button {
  min-height: 48px;
  min-width: 48px;
  padding: 16px;
  margin: 8px;
}

// Texto legible
.accessible-text {
  font-size: 20px;
  line-height: 1.5;
  font-family: Arial, Helvetica, Verdana, sans-serif;
  font-weight: 600;
}
```

### Focus Indicators Visibles

```scss
.accessible-focus {
  &:focus {
    outline: 4px solid #ffd600;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px #222222;
  }
}
```

## 🔘 Patrón Press-Hold Button

Para usuarios con problemas motores, usar botones de presión sostenida:

```typescript
<app-press-hold-button
  buttonId="unique-id"
  [holdDuration]="3000"
  [disabled]="false"
  ariaLabel="Descripción detallada de la acción"
  (actionExecuted)="onAction()"
  (pressStarted)="onPressStart()"
  (pressCancelled)="onPressCancel()">
  Contenido del Botón
</app-press-hold-button>
```

**Características:**

- Duración configurable (2-5 segundos)
- Animación visual de progreso
- Feedback háptico en móvil
- Cancelable al soltar
- Anuncios TTS durante el proceso

## 🔊 Patrones TTS Específicos

### Mensajes de Bienvenida

```typescript
async ngOnInit(): Promise<void> {
  await this.tts.speak(
    `Página de ${this.pageTitle} activada. ${this.getContextualHelp()}`,
    { priority: SpeechPriority.HIGH, interrupt: true }
  );
}
```

### Estados de Carga

```typescript
async performAsyncAction(): Promise<void> {
  this.isLoading = true;
  await this.tts.speak('Procesando, por favor espera...');

  try {
    await this.service.performAction();
    await this.tts.speak('Acción completada exitosamente');
  } catch (error) {
    await this.tts.speak('Error: ' + this.getErrorMessage(error));
  } finally {
    this.isLoading = false;
  }
}
```

### Navegación entre Elementos

```typescript
onElementFocus(element: HTMLElement, description: string): void {
  this.tts.speak(`${description}. ${this.getElementInstructions()}`, {
    priority: SpeechPriority.MEDIUM,
    interrupt: false
  });
}
```

## 🧪 Testing de Accesibilidad

### Tests Automáticos Requeridos

```typescript
describe('Accessibility Tests', () => {
  it('should be navigable by keyboard', async () => {
    // Simular navegación Tab
    const elements = getInteractiveElements();
    elements.forEach((el) => {
      expect(el.tabIndex).toBeGreaterThanOrEqual(0);
      expect(el.getAttribute('aria-label')).toBeTruthy();
    });
  });

  it('should announce actions via TTS', async () => {
    spyOn(mockTTS, 'speak');
    await component.performAction();
    expect(mockTTS.speak).toHaveBeenCalledWith(jasmine.any(String));
  });

  it('should have sufficient color contrast', () => {
    const elements = getStyledElements();
    elements.forEach((el) => {
      const contrast = calculateContrast(el);
      expect(contrast).toBeGreaterThan(4.5);
    });
  });
});
```

### Checklist Manual de Accesibilidad

- [ ] Navegación completa solo con teclado
- [ ] Todos los elementos tienen aria-label
- [ ] Focus indicators visibles en todos los estados
- [ ] TTS anuncia todos los cambios de estado
- [ ] Contraste de color WCAG AAA (7:1)
- [ ] Touch targets mínimo 48x48px
- [ ] Funciona con lectores de pantalla (NVDA, JAWS)

## 🚫 Anti-Patrones Críticos

### ❌ NUNCA hacer esto:

```typescript
// Sin navegación por teclado
<div (click)="action()">Clickea aquí</div>

// Sin descripción accesible
<button>⚙️</button>

// Contraste insuficiente
.bad-contrast {
  background: #cccccc;
  color: #999999;
}

// Sin feedback TTS
async submitForm(): Promise<void> {
  await this.service.submit();
  // ❌ Usuario no sabe si funcionó
}
```

### ✅ SIEMPRE hacer esto:

```typescript
// Con navegación completa
<button
  [attr.aria-label]="descriptiveText"
  (click)="action()"
  (keydown.enter)="action()"
  (keydown.space)="action()">
  Contenido Descriptivo
</button>

// Con feedback completo
async submitForm(): Promise<void> {
  await this.tts.speak('Enviando formulario...');
  try {
    await this.service.submit();
    await this.tts.speak('Formulario enviado exitosamente');
  } catch (error) {
    await this.tts.speak('Error al enviar: ' + error.message);
  }
}
```

## 🎯 Métricas de Éxito

### Objetivos Cuantificables

- **100%** de elementos navegables por teclado
- **100%** de acciones con feedback TTS
- **7:1** ratio de contraste mínimo
- **0** errores de accesibilidad en auditorías
- **< 3 segundos** tiempo respuesta TTS

### Herramientas de Validación

- axe-core para auditorías automáticas
- WAVE Web Accessibility Evaluator
- Lighthouse Accessibility Score (100/100)
- Testing manual con NVDA/JAWS
- Testing con navegación solo teclado

## 📚 Recursos de Referencia

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular Accessibility Guide](https://angular.io/guide/accessibility)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
