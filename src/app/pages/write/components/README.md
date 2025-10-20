# Componentes de la Página Write

La página Write está dividida en 3 componentes independientes para mejor mantenimiento y reutilización.

## 📁 Estructura

```
write/
├── write.page.ts                    # Página principal (orquestador)
├── write.page.html
├── write.page.scss
└── components/
    ├── text-input-section/          # Sección superior (10%)
    │   ├── text-input-section.component.ts
    │   ├── text-input-section.component.html
    │   └── text-input-section.component.scss
    ├── letter-keyboard-section/     # Sección central (80%)
    │   ├── letter-keyboard-section.component.ts
    │   ├── letter-keyboard-section.component.html
    │   └── letter-keyboard-section.component.scss
    └── action-buttons-section/      # Sección inferior (10%)
        ├── action-buttons-section.component.ts
        ├── action-buttons-section.component.html
        └── action-buttons-section.component.scss
```

## 🧩 Componentes

### 1. **TextInputSectionComponent** (Superior - 10%)

**Responsabilidad:** Mostrar el texto escrito y reproducirlo con TTS.

**Inputs:**

- `textContent: string` - Texto a mostrar (two-way binding)

**Outputs:**

- `textContentChange: EventEmitter<string>` - Cambios en el texto
- `speakAction: EventEmitter<string>` - Acción de reproducir texto

**Elementos:**

- Input de texto editable (ion-input)
- Botón de reproducción con icono de altavoz (press-hold)

---

### 2. **LetterKeyboardSectionComponent** (Central - 80%)

**Responsabilidad:** Teclado alfabético dividido en grupos de letras.

**Inputs:**

- `letterGroups: string[]` - Array con los grupos de letras (ej: ['A-D', 'E-H', ...])

**Outputs:**

- `letterGroupAction: EventEmitter<{actionId: string, group: string}>` - Selección de grupo

**Elementos:**

- 8 botones press-hold con grupos de letras
- Grid responsive (4x2 desktop, 2x4 móvil)
- Colores alternados (primary/secondary)

---

### 3. **ActionButtonsSectionComponent** (Inferior - 10%)

**Responsabilidad:** Botones de acción para editar texto.

**Outputs:**

- `spaceAction: EventEmitter<string>` - Añadir espacio
- `backspaceAction: EventEmitter<string>` - Borrar último carácter
- `clearAction: EventEmitter<string>` - Limpiar todo
- `punctuationAction: EventEmitter<string>` - Abrir puntuación

**Elementos:**

- 4 botones press-hold con acciones de edición
- Iconos: ⎵ (espacio), backspace, trash, .,?!

---

## 🔄 Flujo de Datos

```
WritePage (Padre)
    ↓ [textContent]
TextInputSectionComponent
    ↑ (textContentChange, speakAction)

WritePage (Padre)
    ↓ [letterGroups]
LetterKeyboardSectionComponent
    ↑ (letterGroupAction)

WritePage (Padre)
ActionButtonsSectionComponent
    ↑ (spaceAction, backspaceAction, clearAction, punctuationAction)
```

## 🎨 Estilos

Cada componente tiene su propio archivo `.scss` con:

- Estilos específicos de su sección
- Variables CSS de Ionic para temas
- Media queries para responsive
- Accesibilidad (alto contraste)

El archivo `write.page.scss` solo contiene:

- Estilos del navbar
- Layout del contenedor principal (flexbox)
- Distribución de espacio entre componentes

## ✅ Ventajas de esta Arquitectura

1. **Separación de responsabilidades** - Cada componente tiene un propósito claro
2. **Reutilización** - Los componentes pueden usarse en otras páginas
3. **Mantenibilidad** - Fácil localizar y modificar código específico
4. **Testing** - Cada componente puede testearse de forma independiente
5. **Performance** - Posibilidad de OnPush change detection por componente
6. **Escalabilidad** - Fácil añadir nuevas funcionalidades sin afectar otros componentes

## 🚀 Uso

```html
<!-- En write.page.html -->
<div class="write-container">
  <app-text-input-section [(textContent)]="textContent" (speakAction)="onSpeakAction($event)"></app-text-input-section>

  <app-letter-keyboard-section
    [letterGroups]="letterGroups"
    (letterGroupAction)="onLetterGroupAction($event.actionId, $event.group)"
  ></app-letter-keyboard-section>

  <app-action-buttons-section
    (spaceAction)="onSpaceAction($event)"
    (backspaceAction)="onBackspaceAction($event)"
    (clearAction)="onClearAction($event)"
    (punctuationAction)="onPunctuationAction($event)"
  ></app-action-buttons-section>
</div>
```

## 📝 Notas

- Todos los componentes son **standalone** (Angular 20)
- Usan **PressHoldButtonComponent** para interacciones
- Siguen patrones de **accesibilidad WCAG AAA**
- Estilos **responsivos** (desktop y móvil)
- **No tienen lógica de negocio**, solo presentación y eventos
