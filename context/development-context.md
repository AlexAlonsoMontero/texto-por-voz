# 🔧 Contexto de Desarrollo - Patrones y Arquitectura

## 🏗️ Arquitectura Hexagonal + DDD

### Principios Fundamentales
1. **Separación estricta de capas** - Domain, Application, Infrastructure
2. **Inversión de dependencias** - Siempre usar interfaces (puertos)
3. **InjectionTokens obligatorios** - Nunca inyección directa de servicios
4. **Servicios híbridos** - Una implementación para web y móvil

### Estructura de Capas

```
src/app/core/
├── domain/
│   └── interfaces/           # PUERTOS - Contratos del dominio
│       ├── text-to-speech.interface.ts
│       ├── theme.interface.ts
│       ├── orientation.interface.ts
│       └── safe-area.interface.ts
├── application/              # CASOS DE USO (futuro)
└── infrastructure/           # ADAPTADORES
    ├── services/            # Implementaciones híbridas
    ├── injection-tokens.ts  # Configuración DI
    └── providers.ts         # Array de providers
```

## 🔑 Patrón de Inyección de Dependencias

### OBLIGATORIO: Usar InjectionTokens
```typescript
// ✅ Patrón correcto - injection-tokens.ts
export const TEXT_TO_SPEECH_SERVICE = new InjectionToken<ITextToSpeechService>(
  'TextToSpeechService',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error('TEXT_TO_SPEECH_SERVICE debe ser provisto explícitamente');
    },
  }
);

// ✅ Uso correcto en componentes
constructor(
  @Inject(TEXT_TO_SPEECH_SERVICE)
  private readonly tts: ITextToSpeechService
) {}

// ❌ NUNCA hacer esto
constructor(private tts: HybridTextToSpeechService) {}
```

### Configuración de Providers
```typescript
// providers.ts
export const CORE_PROVIDERS: Provider[] = [
  {
    provide: TEXT_TO_SPEECH_SERVICE,
    useClass: HybridTextToSpeechService,
  },
  {
    provide: THEME_SERVICE,
    useClass: ThemeService,
  },
  // ... más servicios
];
```

## 🌐 Patrón de Servicios Híbridos

### Detección de Plataforma
```typescript
@Injectable()
export class HybridTextToSpeechService implements ITextToSpeechService {
  private readonly isNativePlatform = Capacitor.isNativePlatform();
  
  async speak(text: string, options?: SpeechOptions): Promise<void> {
    if (this.isNativePlatform) {
      return this.speakNative(text, options);
    } else {
      return this.speakWeb(text, options);
    }
  }

  private async speakNative(text: string, options?: SpeechOptions): Promise<void> {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
    await TextToSpeech.speak({
      text,
      lang: options?.lang || 'es-ES',
      rate: options?.rate || 1.0,
      pitch: options?.pitch || 1.0,
      volume: options?.volume || 1.0,
    });
  }

  private async speakWeb(text: string, options?: SpeechOptions): Promise<void> {
    if (!window.speechSynthesis) {
      throw new Error('Speech synthesis no soportado');
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'es-ES';
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 1.0;
    
    window.speechSynthesis.speak(utterance);
  }
}
```

## 📱 Componentes Standalone (Angular 20)

### Estructura Obligatoria
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  standalone: true,  // ✅ OBLIGATORIO
  imports: [         // ✅ Imports explícitos
    CommonModule,
    IonButton,
    IonContent,
    IonHeader,
    CustomComponent,
  ],
})
export class ExampleComponent implements OnInit {
  // Implementación
}
```

### Lazy Loading en Rutas
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'settings',
    loadComponent: () => 
      import('./pages/settings/settings.page').then(m => m.SettingsPage),
  },
  {
    path: 'home',
    loadComponent: () => 
      import('./home/home.page').then(m => m.HomePage),
  },
];
```

## 🎨 Sistema de Temas Dinámico

### Interface de Tema
```typescript
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface IonicVariables {
  '--ion-color-primary': string;
  '--ion-color-primary-rgb': string;
  '--ion-color-primary-contrast': string;
  '--ion-color-primary-shade': string;
  '--ion-color-primary-tint': string;
  '--ion-color-secondary': string;
  '--ion-color-secondary-rgb': string;
  '--ion-color-secondary-contrast': string;
  '--ion-color-secondary-shade': string;
  '--ion-color-secondary-tint': string;
  '--ion-background-color': string;
  '--ion-text-color': string;
}
```

### Implementación del ThemeService
```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService implements IThemeService {
  private currentTheme: ThemeColors = { ...DEFAULT_THEME_COLORS };

  setThemeColors(colors: ThemeColors): void {
    this.currentTheme = { ...colors };
    this.applyTheme(colors);
  }

  applyTheme(colors: ThemeColors): void {
    const ionicVariables = this.generateIonicVariables(colors);
    this.setCSSVariables(ionicVariables);
  }

  private setCSSVariables(variables: IonicVariables): void {
    const root = document.documentElement;
    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }
}
```

### Inicialización Obligatoria en AppComponent
```typescript
// app.component.ts
export class AppComponent implements OnInit {
  constructor(
    @Inject(THEME_SERVICE) private readonly themeService: IThemeService
  ) {}

  ngOnInit(): void {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const currentTheme = this.themeService.getThemeColors();
    this.themeService.applyTheme(currentTheme);
  }
}
```

## 🔘 Patrón Press-Hold Button

### Componente Especializado
```typescript
@Component({
  selector: 'app-press-hold-button',
  templateUrl: './press-hold-button.component.html',
  styleUrls: ['./press-hold-button.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton],
})
export class PressHoldButtonComponent implements OnDestroy {
  @Input() buttonId!: string;
  @Input() holdDuration: number = 3000;
  @Input() disabled: boolean = false;
  @Input() ariaLabel: string = '';

  @Output() actionExecuted = new EventEmitter<void>();
  @Output() pressStarted = new EventEmitter<void>();
  @Output() pressCancelled = new EventEmitter<void>();

  private progressAnimationId?: number;

  onPressStart(event: Event): void {
    if (this.disabled) return;
    
    event.preventDefault();
    this.pressStarted.emit();
    this.startProgressAnimation();
    
    setTimeout(() => {
      if (this.progressAnimationId) {
        this.actionExecuted.emit();
        this.cancelPress();
      }
    }, this.holdDuration);
  }

  onPressEnd(): void {
    if (this.progressAnimationId) {
      this.pressCancelled.emit();
      this.cancelPress();
    }
  }
}
```

## 🧪 Patrones de Testing

### Mocking de Servicios con InjectionTokens
```typescript
describe('ComponentTest', () => {
  let component: ExampleComponent;
  let mockTtsService: jasmine.SpyObj<ITextToSpeechService>;

  beforeEach(async () => {
    mockTtsService = jasmine.createSpyObj('ITextToSpeechService', [
      'speak', 'stop', 'isSupported'
    ]);

    await TestBed.configureTestingModule({
      imports: [ExampleComponent],
      providers: [
        { provide: TEXT_TO_SPEECH_SERVICE, useValue: mockTtsService },
        { provide: THEME_SERVICE, useValue: mockThemeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  it('should call TTS service on action', async () => {
    mockTtsService.speak.and.returnValue(Promise.resolve());
    
    await component.performAction();
    
    expect(mockTtsService.speak).toHaveBeenCalledWith(
      jasmine.any(String),
      jasmine.any(Object)
    );
  });
});
```

## 🚀 Estados de Inicialización

### Patrón para Servicios Complejos
```typescript
export enum ServiceState {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZING = 'INITIALIZING',
  READY = 'READY',
  ERROR = 'ERROR'
}

@Injectable()
export class ComplexService {
  private state = ServiceState.UNINITIALIZED;

  async initialize(): Promise<void> {
    if (this.state === ServiceState.READY) return;
    
    this.state = ServiceState.INITIALIZING;
    
    try {
      await this.performInitialization();
      this.state = ServiceState.READY;
    } catch (error) {
      this.state = ServiceState.ERROR;
      throw error;
    }
  }

  isReady(): boolean {
    return this.state === ServiceState.READY;
  }
}
```

## 📋 Checklist de Desarrollo

### Para Nuevos Servicios
- [ ] Interface definida en `core/domain/interfaces/`
- [ ] InjectionToken creado en `injection-tokens.ts`
- [ ] Provider configurado en `providers.ts`
- [ ] Implementación híbrida (web + móvil)
- [ ] Estados de inicialización manejados
- [ ] Logging de debug implementado
- [ ] Tests con mocking via tokens

### Para Nuevos Componentes
- [ ] Standalone component
- [ ] Imports explícitos
- [ ] Accesibilidad implementada (keyboard, aria-labels)
- [ ] Integración con ThemeService
- [ ] Feedback TTS donde corresponda
- [ ] Tests de componente
- [ ] Responsive design

### Para Nuevas Páginas
- [ ] Lazy loading en rutas
- [ ] Mensaje TTS de bienvenida
- [ ] Navegación por teclado completa
- [ ] Estados de carga con spinner
- [ ] Manejo de errores con feedback
- [ ] Integración con servicios via tokens

## 🚫 Anti-Patrones

### ❌ NUNCA hacer esto:
```typescript
// Inyección directa sin interface
constructor(private service: ConcreteService) {}

// NgModules en Angular 20
@NgModule({ ... })

// Hardcodear plataforma
if (platform === 'mobile') { ... }

// Ignorar accesibilidad
<div (click)="action()">Click me</div>

// CSS sin variables de tema
.button { background: #ffff00; }
```

### ✅ SIEMPRE hacer esto:
```typescript
// Inyección via token
constructor(@Inject(SERVICE_TOKEN) private service: IService) {}

// Standalone components
@Component({ standalone: true, imports: [...] })

// Detección automática de plataforma
if (Capacitor.isNativePlatform()) { ... }

// Accesibilidad completa
<button [attr.aria-label]="..." (click)="..." (keydown.enter)="...">

// Variables de tema
.button { background: var(--ion-color-primary); }
```