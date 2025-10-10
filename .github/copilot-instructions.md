# Copilot Instructions: Texto por Voz - Accessible Hybrid App

## 🎯 Project Overview

Angular 20 + Ionic 8 **accessibility-first** hybrid app for text-to-speech functionality targeting users with visual impairments. Uses **Hexagonal Architecture + DDD** with full web/mobile support via Capacitor.

## 🏗️ Architecture Patterns

### Dependency Injection Strategy

**Always use InjectionTokens** - never direct service imports:

```typescript
// ✅ Correct - enables testing and decoupling
@Inject(TEXT_TO_SPEECH_SERVICE) private tts: ITextToSpeechService

// ❌ Wrong - creates tight coupling
constructor(private tts: HybridTextToSpeechService)
```

### Service Layer Structure

- `core/domain/interfaces/` - Contracts only (ITextToSpeechService, IThemeService, etc.)
- `core/infrastructure/services/` - Hybrid implementations (HybridTextToSpeechService)
- `core/infrastructure/injection-tokens.ts` - DI tokens with error factories
- `core/infrastructure/providers.ts` - Service configuration

### Standalone Components Pattern

All components are standalone with explicit imports:

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, IonButton, IonContent],
  // ...
})
```

## 🔧 Critical Development Workflows

### Build Commands

- `npm start` - Development server (web only)
- `npm run build` - Production build
- `ionic capacitor run android` - Native Android testing
- `ionic capacitor run ios` - Native iOS testing

### Platform Detection Pattern

Services auto-detect platform and choose appropriate implementation:

```typescript
// HybridTextToSpeechService pattern
if (Capacitor.isNativePlatform()) {
  // Use @capacitor-community/text-to-speech
} else {
  // Use Web Speech API with manual activation
}
```

## 🎨 Theme System Architecture

### Dynamic Theme Variables

Custom CSS properties managed via ThemeService:

- `--ion-color-primary` / `--ion-color-secondary` - Button backgrounds
- `--ion-background-color` - Container backgrounds
- `--ion-text-color` - All text and icons

### Theme Initialization

Theme MUST be initialized in AppComponent to sync service state with CSS:

```typescript
// AppComponent.initializeTheme() pattern
const currentTheme = this.themeService.getThemeColors();
this.themeService.applyTheme(currentTheme);
```

## ♿ Accessibility Requirements

### Mandatory Navigation Patterns

- **Tab/Shift+Tab** - Element navigation
- **Enter/Space** - Button activation
- **TTS Feedback** - Every user action must announce result

### Press-Hold Button Pattern

Specialized component for motor accessibility:

```typescript
<app-press-hold-button
  buttonId="unique-id"
  [holdDuration]="3000"
  (actionExecuted)="onAction()"
  ariaLabel="Descriptive action">
```

### TTS Activation Flow

Web browsers require user gesture for speech:

1. Show `TtsActivationComponent` modal on web
2. User clicks "Activar Voz"
3. Initialize speechSynthesis
4. Remove modal, enable TTS throughout app

## 🚀 Service Integration Patterns

### State Management

Services use initialization states: `UNINITIALIZED → INITIALIZING → READY/ERROR`

### Error Handling

Always provide fallbacks for hybrid functionality:

```typescript
try {
  await this.hybridService.nativeFeature();
} catch (error) {
  console.error('Native feature failed, using web fallback');
  return this.webFallback();
}
```

## 📁 Key Files & Directories

- `src/app/core/infrastructure/injection-tokens.ts` - Central DI configuration
- `src/app/shared/components/press-hold-button/` - Accessibility button pattern
- `src/app/shared/components/tts-activation/` - Web TTS initialization
- `src/app/pages/settings/` - Theme customization with color selectors
- `capacitor.config.ts` - Native platform configuration

## 🎯 Development Guidelines

### Component Creation

Always include accessibility attributes:

```typescript
[attr.aria - label] = 'descriptiveLabel'(keydown.enter) = 'onActivate()'(keydown.space) = 'onActivate()';
```

### Service Implementation

Follow hybrid pattern for cross-platform features - implement interface, detect platform in constructor, provide web/native code paths.

### Testing Strategy

Mock services via InjectionTokens in tests:

```typescript
providers: [{ provide: TEXT_TO_SPEECH_SERVICE, useValue: mockTTSService }];
```
