# 🚨 Ejemplos de Resolución de Conflictos

## 📋 Casos Reales de Conflictos Potenciales

### 🔴 CONFLICTO CRÍTICO - Ejemplo 1

**Petición del Usuario:**

> "Quiero crear un botón que solo funcione con click de mouse, sin navegación por teclado porque se ve más moderno"

**🚨 CONFLICTO DETECTADO:**

- **Nivel:** CRÍTICO 🔴
- **Conflicto con:** accessibility-context.md - Navegación por teclado obligatoria
- **Afecta:** WCAG 2.1.1 (Keyboard) - Nivel A requerido
- **Implicación:** Usuarios con discapacidades motoras no podrían usar la función

**💬 RESPUESTA DEL AGENTE:**

```
🚨 CONFLICTO CRÍTICO DETECTADO

Tu petición contradice nuestros estándares de accesibilidad WCAG AAA.

PROBLEMA: Botón sin navegación por teclado
AFECTA: Usuarios con discapacidades motoras, usuarios que solo usan teclado
VIOLACIÓN: WCAG 2.1.1 (Keyboard) - Nivel A

🤝 PROPUESTAS ALTERNATIVAS:

1. ✅ MANTENER ESTÁNDAR: Implementar botón con navegación completa
   - Click mouse + Enter/Space en teclado
   - Aria-labels apropiados
   - Focus visible y manejado

2. 🎨 SOLUCIÓN HÍBRIDA: Botón moderno Y accesible
   - Diseño visual moderno como quieres
   - Funcionalidad completa para todos los usuarios
   - Focus ring personalizado que mantenga el estilo

3. ❌ NO RECOMENDADO: Cambiar context de accesibilidad
   - Rompería el propósito fundamental del proyecto
   - Excluiría usuarios con discapacidades

¿Qué opción prefieres para continuar?
```

### 🟡 CONFLICTO ALTO - Ejemplo 2

**Petición del Usuario:**

> "Quiero inyectar directamente el HybridTextToSpeechService sin usar InjectionToken porque es más rápido de escribir"

**🚨 CONFLICTO DETECTADO:**

- **Nivel:** ALTO 🟡
- **Conflicto con:** development-context.md - InjectionTokens obligatorios
- **Afecta:** Arquitectura hexagonal, testabilidad, mantenibilidad

**💬 RESPUESTA DEL AGENTE:**

````
🟡 CONFLICTO ARQUITECTURAL DETECTADO

Tu petición contradice nuestro patrón de arquitectura hexagonal.

PROBLEMA: Inyección directa sin InjectionToken
AFECTA:
- Testabilidad (difícil mockear)
- Acoplamiento alto
- Violación principio inversión dependencias

🤝 OPCIONES:

1. ✅ MANTENER PATRÓN: Usar InjectionToken como está definido
   ```typescript
   constructor(
     @Inject(TEXT_TO_SPEECH_SERVICE)
     private readonly tts: ITextToSpeechService
   ) {}
````

2. 🛠️ MEJORAR EXPERIENCIA: Crear snippet/template para agilizar
   - Snippet de VS Code para inyección rápida
   - Generator automático de tokens

3. 🔄 DEBATE ARQUITECTURAL: ¿Modificar el estándar?
   - ¿Hay casos específicos donde sea justificable?
   - ¿Afectaría otros componentes/servicios?

¿Prefieres mantener el patrón, mejorar la DX, o debatir el cambio?

```

### 🟢 CONFLICTO BAJO - Ejemplo 3

**Petición del Usuario:**
> "Quiero cambiar la estructura de carpetas y poner los servicios en src/services/ en lugar de src/app/core/infrastructure/services/"

**🚨 CONFLICTO DETECTADO:**
- **Nivel:** BAJO 🟢
- **Conflicto con:** development-context.md - Estructura de carpetas DDD
- **Afecta:** Consistencia arquitectural, pero no funcionalidad crítica

**💬 RESPUESTA DEL AGENTE:**
```

🟢 CONFLICTO DE ORGANIZACIÓN DETECTADO

Tu petición sugiere cambio en estructura de carpetas.

DIFERENCIA:

- Actual: src/app/core/infrastructure/services/
- Propuesto: src/services/

CONSIDERACIONES:
✅ PRO cambio: Más simple, menos anidamiento
❌ CONTRA cambio: Rompe patrón DDD, mezcla capas

🤝 OPCIONES:

1. 📁 MANTENER ESTRUCTURA DDD:
   - Separación clara de capas (domain/application/infrastructure)
   - Consistente con arquitectura hexagonal
   - Escalable para proyectos grandes

2. 📁 HÍBRIDO: Alias/shortcuts
   - Mantener estructura pero crear path mapping
   - tsconfig paths para imports más cortos

3. 🔄 CAMBIAR CONTEXT: Si tienes razones sólidas
   - Documentar por qué el cambio
   - Actualizar todos los contexts
   - Migrar código existente

¿Cuál es tu razón principal para el cambio? ¿Simplificación o hay otro motivo?

````

## 🤖 Flujo de Trabajo del Agente

### 1. Detección Automática
```typescript
// Pseudocódigo de validación
function validateRequest(userRequest: string, contexts: Context[]): ConflictResult {
  const conflicts = contexts
    .filter(context => hasConflict(userRequest, context))
    .map(context => analyzeConflict(userRequest, context));

  if (conflicts.length > 0) {
    return {
      hasConflict: true,
      level: getMaxSeverity(conflicts),
      conflicts: conflicts,
      shouldStop: conflicts.some(c => c.level === 'CRITICAL')
    };
  }

  return { hasConflict: false };
}
````

### 2. Plantilla de Respuesta

```markdown
🚨 CONFLICTO [NIVEL] DETECTADO

Tu petición: "[resumen de petición]"
Contradice: [context/agent específico]
Problema: [explicación técnica]
Impacto: [consecuencias para usuarios/sistema]

🤝 OPCIONES:

1. ✅ [Opción que mantiene estándares]
2. 🔧 [Opción híbrida/compromiso]
3. 🔄 [Opción de cambiar context - solo si justificado]

💬 ¿Cómo prefieres proceder?
```

### 3. Documentación de Decisiones

```markdown
## 📝 Registro de Conflictos Resueltos

### [Fecha] - [Tipo de Conflicto]

- **Petición:** [descripción]
- **Conflicto:** [context afectado]
- **Resolución:** [qué se decidió]
- **Justificación:** [por qué se tomó esa decisión]
- **Cambios en Context:** [si se modificó algo]
```

## 📋 Checklist para Agentes

### Antes de Implementar CUALQUIER petición:

- [ ] ¿Contradice accessibility-context.md?
- [ ] ¿Viola arquitectura hexagonal?
- [ ] ¿Rompe patrones de testing?
- [ ] ¿Afecta funcionalidad híbrida web/móvil?
- [ ] ¿Compromete InjectionTokens pattern?

### Si hay conflicto:

- [ ] Parar ejecución (si es CRÍTICO)
- [ ] Identificar nivel de severidad
- [ ] Explicar implicaciones técnicas
- [ ] Proponer alternativas viables
- [ ] Solicitar decisión del usuario
- [ ] Documentar resolución

## 🎯 Objetivo Final

**Mantener la integridad del proyecto mientras permitimos flexibilidad razonable.**

El sistema debe ser lo suficientemente estricto para preservar accesibilidad y calidad, pero lo suficientemente flexible para evolucionar cuando hay justificaciones sólidas.
