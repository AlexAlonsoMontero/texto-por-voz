# 🔊 Servicio Text-to-Speech (TTS)

## 📋 Descripción

Servicio híbrido de síntesis de voz que funciona tanto en plataformas web como nativas (iOS/Android), siguiendo arquitectura hexagonal y principios DDD.

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/app/core/
├── domain/
│   └── interfaces/
│       └── text-to-speech.interface.ts    # Contratos del dominio
├── application/                            # Casos de uso (futuro)
└── infrastructure/
    ├── services/
    │   └── hybrid-text-to-speech.service.ts  # Implementación
    ├── injection-tokens.ts                    # Tokens DI
    └── providers.ts                           # Configuración providers
```

## 🚀 Uso Básico

### 1. Inyección en Componente

```typescript
import { Component, Inject } from '@angular/core';
import { TEXT_TO_SPEECH_SERVICE } from '../core/infrastructure/injection-tokens';
import { ITextToSpeechService } from '../core/domain/interfaces/text-to-speech.interface';

@Component({...})
export class MiComponente {
  constructor(
    @Inject(TEXT_TO_SPEECH_SERVICE)
    private readonly textToSpeechService: ITextToSpeechService
  ) {}
}
```

### 2. Síntesis Básica

```typescript
async hablar(): Promise<void> {
  try {
    await this.textToSpeechService.speak('Hola mundo');
  } catch (error) {
    console.error('Error al hablar:', error);
  }
}
```

### 3. Síntesis con Opciones

```typescript
async hablarConOpciones(): Promise<void> {
  await this.textToSpeechService.speak('Texto personalizado', {
    rate: 0.8,        // Velocidad (0.1 - 2.0)
    pitch: 1.2,       // Tono (0.0 - 2.0) 
    volume: 0.9,      // Volumen (0.0 - 1.0)
    lang: 'es-ES',    // Idioma
  });
}
```

## 📱 Plataformas Soportadas

### Web (Navegador)
- **API:** Web Speech API (`speechSynthesis`)
- **Soporte:** Chrome, Firefox, Safari, Edge
- **Funciones:** Todas las funciones disponibles
- **Voces:** Sistema operativo + navegador

### Nativo (iOS/Android) 
- **Plugin:** `@capacitor-community/text-to-speech`
- **Soporte:** iOS 9+, Android API 21+
- **Funciones:** speak(), stop(), isSupported()
- **Voces:** Voces nativas del sistema

## 🔧 Métodos Disponibles

### `speak(text: string, options?: SpeechOptions): Promise<void>`
Convierte texto a voz.

**Parámetros:**
- `text`: Texto a sintetizar
- `options`: Configuración opcional (rate, pitch, volume, lang)

**Ejemplo:**
```typescript
await this.tts.speak('Hola', { rate: 1.0, lang: 'es-ES' });
```

### `stop(): Promise<void>`
Detiene la síntesis actual.

```typescript
await this.tts.stop();
```

### `isSupported(): boolean`
Verifica si TTS está soportado.

```typescript
if (this.tts.isSupported()) {
  // Usar TTS
}
```

### `isSpeaking(): boolean`
Verifica si está hablando (solo web).

```typescript
const speaking = this.tts.isSpeaking();
```

### `getAvailableVoices(): Promise<SpeechSynthesisVoice[]>`
Obtiene voces disponibles (solo web).

```typescript
const voices = await this.tts.getAvailableVoices();
console.log('Voces:', voices.map(v => v.name));
```

## 🎯 Características de Accesibilidad

### Logging Diagnóstico
El servicio incluye logging completo para debugging:

```typescript
// Ejemplos de logs que verás en consola
TTS: Inicializando servicio en plataforma: web
TTS: Intentando leer: "Hola mundo"
TTS: Usando Web Speech API con configuración: {...}
TTS: Síntesis completada exitosamente
```

### Fallback Automático
Si falla la implementación nativa, automáticamente usa web:

```typescript
// El servicio maneja esto automáticamente
try {
  await speakNative(text);
} catch (error) {
  console.warn('TTS: Fallback a implementación web');
  await speakWeb(text);
}
```

### Validación de Entrada
```typescript
if (!text?.trim()) {
  console.warn('TTS: Texto vacío proporcionado');
  return;
}
```

## ⚙️ Configuración

### Opciones por Defecto

```typescript
const defaultOptions: SpeechOptions = {
  rate: 1.0,
  pitch: 1.0, 
  volume: 1.0,
  lang: 'es-ES',
  category: 'ambient' // Solo iOS
};
```

### Idiomas Soportados
- `'es-ES'` - Español (España)
- `'es-MX'` - Español (México)  
- `'en-US'` - Inglés (Estados Unidos)
- `'en-GB'` - Inglés (Reino Unido)
- Y más según el sistema...

## 🔍 Troubleshooting

### Problema: "No se escucha nada"
**Solución:** 
1. Verificar que `isSupported()` retorna `true`
2. Comprobar volumen del dispositivo
3. En web, verificar permisos de audio del navegador

### Problema: "Error en síntesis nativa"
**Solución:**
1. Verificar que `@capacitor-community/text-to-speech` está instalado
2. Ejecutar `npx cap sync` 
3. El servicio usará fallback web automáticamente

### Problema: "No hay voces disponibles"
**Solución:**
- En web: Esperar a que se carguen las voces
- En nativo: Verificar configuración del sistema

## 🧪 Testing

### Mockear el Servicio

```typescript
const mockTtsService: jasmine.SpyObj<ITextToSpeechService> = {
  speak: jasmine.createSpy().and.returnValue(Promise.resolve()),
  stop: jasmine.createSpy().and.returnValue(Promise.resolve()),
  isSupported: jasmine.createSpy().and.returnValue(true),
  isSpeaking: jasmine.createSpy().and.returnValue(false),
  getAvailableVoices: jasmine.createSpy().and.returnValue(Promise.resolve([])),
};

// En providers de testing
{
  provide: TEXT_TO_SPEECH_SERVICE,
  useValue: mockTtsService
}
```

## 📦 Dependencias

```json
{
  "@capacitor/core": "^7.4.3",
  "@capacitor-community/text-to-speech": "^latest"
}
```

## 🚀 Próximas Mejoras

- [ ] Soporte para SSML (Speech Synthesis Markup Language)  
- [ ] Cache de voces disponibles
- [ ] Estado global de TTS con signals
- [ ] Configuración persistente de usuario
- [ ] Soporte para interrupciones inteligentes
- [ ] Métricas de uso de accesibilidad
