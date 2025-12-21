# Manual de Usuario: Aplicación de Comunicación Asistida (Texto a Voz)

## 1. Introducción y Propósito
Esta aplicación ha sido diseñada específicamente para asistir a personas con limitaciones severas en la comunicación verbal, motora y visual. Su objetivo principal es otorgar autonomía al usuario, permitiéndole expresarse mediante una interfaz tecnológica adaptada a sus necesidades específicas.

### Perfil del Usuario Objetivo
La aplicación aborda tres barreras principales:
1.  **Limitación Verbal:** Usuarios con dificultad o imposibilidad para hablar.
2.  **Limitación Motora:** Usuarios con control reducido de movimientos o presencia de espasmos involuntarios (dificultando el uso de pantallas táctiles convencionales).
3.  **Limitación Visual:** Usuarios con dificultad para enfocar o controlar el movimiento ocular, lo que impide el uso de tecnologías de seguimiento ocular (*eye-tracking*).

## 2. Características de Accesibilidad
Para superar estas barreras, la aplicación incorpora soluciones de diseño únicas:

### 🔊 Retroalimentación Auditiva Constante
El sistema actúa como los ojos y la voz del usuario durante la navegación:
*   **Guía por Voz:** Cada vez que se carga una página o se toca un botón, la aplicación describe verbalmente dónde está el usuario o qué función tiene el botón que está tocando.
*   **Confirmación de Acciones:** Se notifica verbalmente cuando una acción (como escribir una letra o borrar) se ha completado con éxito.

### ⏱️ Sistema "Pulsar y Mantener" (Anti-Espasmos)
Para evitar pulsaciones accidentales debidas a movimientos involuntarios:
*   **Activación Retardada:** Los botones **no** se activan con un toque simple. Es necesario mantener presionado el botón durante un tiempo configurable para confirmar la acción.
*   **Feedback Visual:** Un indicador visual muestra el progreso de la pulsación.

### 🎨 Alto Contraste y Diseño Visual
*   **Personalización de Color:** Los colores son totalmente personalizables para adaptarse a usuarios con fotofobia (prefieren oscuros) o baja visión (prefieren claros).
*   **Distinción de Elementos:** Se utiliza un diseño de contraste alternado (tipo tablero) para evitar que dos botones del mismo color estén juntos, facilitando la distinción de los límites de cada botón.

---

## 3. Navegación Principal (Inicio)

![Pantalla de Inicio](image.png)

La pantalla de inicio es el centro de control simplificado, con botones grandes y claros para acceder a las funciones principales:
*   **Escritura:** Accede al teclado adaptado para redactar mensajes nuevos.
*   **Frases:** Acceso rápido a mensajes pregrabados de uso frecuente.
*   **Configuración:** Ajustes técnicos y de accesibilidad de la aplicación.

---

## 4. Módulo de Escritura
Esta sección permite al usuario construir oraciones completas letra por letra o palabra por palabra.

### Zona Superior (Barra de Acción)
![Barra de Escritura](image-1.png)
En la parte superior de la pantalla encontrará siempre:
*   **Cuadro de Texto:** Muestra el mensaje que se está construyendo.
*   **Botón Altavoz:** Reproduce en voz alta todo el texto escrito.
*   **Botón Guardar:** Almacena la frase actual en la sección de "Frases" para uso futuro.

### Modos de Visualización
La aplicación ofrece dos formas de escribir, adaptables a la capacidad visual y motora del usuario. Se puede cambiar entre ellas en la Configuración.

#### A. Vista de Panel (Estándar)
![Vista de Panel](image-2.png)
*   **Descripción:** Muestra 8 botones grandes que agrupan letras y números.
*   **Funcionamiento:** Al seleccionar un grupo, se abre una sub-pantalla para elegir el carácter específico.
*   **Controles:** Incluye botones inferiores grandes para "Espacio", "Borrar Letra" y "Borrar Todo".

#### B. Vista de Carrusel (Slider)
![Vista Carrusel 1](image-5.png)
![Vista Carrusel 2](image-6.png)
*   **Descripción:** Diseñada para usuarios con visión muy reducida. Muestra **un solo botón gigante** a la vez en pantalla.
*   **Funcionamiento:** El contenido del botón cambia automáticamente cada ciertos segundos (o manualmente mediante flechas), rotando entre los diferentes grupos de letras.
*   **Ventaja:** Permite al usuario concentrar la vista en un solo punto fijo de la pantalla.

---

## 5. Frases Rápidas (Guardadas)

![Frases Guardadas](image-9.png)

Esta sección agiliza la comunicación diaria para necesidades inmediatas. Permite tener botones listos con expresiones vitales como *"Necesito ir al baño"*, *"Tengo sed"* o *"Me duele"*.

*   **Adaptabilidad:** El tamaño y la cantidad de botones visibles por pantalla se pueden ajustar.
    *   *Pocos botones grandes* para mayor facilidad motora.
    *   *Muchos botones pequeños* para tener más opciones a la vista.

![Ejemplo Frases Grandes](image-10.png)
![Ejemplo Frases Pequeñas](image-11.png)

---

## 6. Configuración (Para Familiares y Asistentes)

![Pantalla de Configuración](image-12.png)
![Opciones de Configuración](image-13.png)

Esta sección es fundamental para adaptar la experiencia al usuario. Recomendamos que sea configurada por un acompañante, familiar o terapeuta.

### Opciones Disponibles:

1.  **Apariencia:**
    *   Personalice los colores primarios y secundarios.
    *   Ajuste el tema (Claro/Oscuro) para maximizar el contraste según la visión del usuario.

2.  **Accesibilidad (Tiempo de Presión):**
    *   Define cuántos segundos debe mantenerse pulsado un botón para activarse.
    *   *Recomendación:* Aumente este tiempo si el usuario tiene espasmos frecuentes o movimientos lentos.

3.  **Interfaz:**
    *   **Modo de Vista:** Elija entre "Panel" (cuadrícula) o "Carrusel" (un botón).
    *   **Velocidad del Carrusel:** Si usa el modo carrusel, ajuste qué tan rápido cambian las opciones automáticamente.
    *   **Tamaño de Botones:** Defina qué tan grandes deben ser los botones en la sección de Frases.
