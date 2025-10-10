# 🔄 Contexto de Refactoring - Mejora Continua del Código

## 🎯 Filosofía de Refactoring

### Principios de Mejora Continua

1. **Refactoring incremental** - Cambios pequeños y frecuentes vs grandes reescrituras
2. **Test-driven refactoring** - Tests primero, luego refactorizar
3. **Boy Scout Rule** - Deja el código mejor de como lo encontraste
4. **No romper accesibilidad** - Mantener o mejorar estándares WCAG
5. **Backward compatibility** - Mantener interfaces públicas estables

### Triggers para Refactoring

```
Code Smells (80%) - Duplicación, complejidad, acoplamiento
├── Componentes con más de 300 líneas
├── Servicios con más de 5 responsabilidades
├── Duplicación de código > 3 veces
├── Métodos con más de 20 líneas
└── Ciclo de dependencias

Performance Issues (15%) - Optimización y eficiencia
├── Componentes con OnPush strategy faltante
├── Subscriptions sin unsubscribe
├── Heavy computations sin memoization
└── Bundle size > 2MB

Accessibility Debt (5%) - Mejoras en accesibilidad
├── Elementos sin ARIA labels
├── Contraste insuficiente
├── Navegación por teclado incompleta
└── TTS feedback faltante
```

## 🏗️ Estrategias de Refactoring Arquitectural

### Migración a Arquitectura Hexagonal

#### Paso 1: Identificar Boundaries

```typescript
// ANTES - Acoplamiento directo
@Component({...})
export class HomeComponent {
  constructor(
    private http: HttpClient,  // ❌ Dependencia directa
    private storage: Storage   // ❌ Dependencia directa
  ) {}
}

// DESPUÉS - Arquitectura hexagonal
@Component({...})
export class HomeComponent {
  constructor(
    @Inject(TEXT_TO_SPEECH_SERVICE) 
    private readonly tts: ITextToSpeechService,  // ✅ Puerto/Interface
    @Inject(THEME_SERVICE)
    private readonly theme: IThemeService        // ✅ Puerto/Interface
  ) {}
}
```

#### Paso 2: Crear Interfaces (Puertos)

```typescript
// src/app/core/domain/interfaces/storage.interface.ts
export interface IStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

// src/app/core/infrastructure/injection-tokens.ts
export const STORAGE_SERVICE = new InjectionToken<IStorageService>(
  'StorageService',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error('STORAGE_SERVICE debe ser provisto explícitamente');
    },
  }
);
```

#### Paso 3: Implementar Adaptadores

```typescript
// src/app/core/infrastructure/services/hybrid-storage.service.ts
@Injectable()
export class HybridStorageService implements IStorageService {
  private readonly isNative = Capacitor.isNativePlatform();

  async get<T>(key: string): Promise<T | null> {
    if (this.isNative) {
      const result = await Preferences.get({ key });
      return result.value ? JSON.parse(result.value) : null;
    } else {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    const stringValue = JSON.stringify(value);
    
    if (this.isNative) {
      await Preferences.set({ key, value: stringValue });
    } else {
      localStorage.setItem(key, stringValue);
    }
  }
}
```

### Migración de NgModules a Standalone

#### Script de Migración Automática

```bash
#!/bin/bash
# scripts/migrate-to-standalone.sh

echo "🔄 Migrando componentes a standalone..."

# Encontrar componentes con @Component
find src/app -name "*.component.ts" -exec grep -l "@Component" {} \; | while read file; do
  echo "Procesando: $file"
  
  # Agregar standalone: true si no existe
  if ! grep -q "standalone:" "$file"; then
    sed -i '/templateUrl/a\  standalone: true,' "$file"
    echo "  ✅ Agregado standalone: true"
  fi
  
  # Agregar imports array si no existe
  if ! grep -q "imports:" "$file"; then
    sed -i '/standalone: true,/a\  imports: [],' "$file"
    echo "  ✅ Agregado imports array vacío"
  fi
done

echo "🎉 Migración completada"
```

#### Template de Refactoring

```typescript
// ANTES
@NgModule({
  declarations: [ExampleComponent],
  imports: [CommonModule, IonicModule],
  exports: [ExampleComponent]
})
export class ExampleModule {}

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {}

// DESPUÉS
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  standalone: true,  // ✅ Nuevo
  imports: [         // ✅ Nuevo - imports explícitos
    CommonModule,
    IonButton,
    IonContent,
    IonHeader
  ]
})
export class ExampleComponent {}

// El módulo ya no es necesario ❌
```

## 🧩 Refactoring de Componentes

### Extracción de Smart/Dumb Components

#### Identificar Candidatos

```typescript
// ANTES - Componente "Smart" sobrecargado
@Component({
  selector: 'app-settings',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Configuración</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <!-- 200+ líneas de template -->
      <div class="theme-section">
        <h2>Personalizar Tema</h2>
        <ion-item>
          <ion-label>Color Primario</ion-label>
          <ion-input 
            type="color" 
            [(ngModel)]="primaryColor"
            (ionChange)="onPrimaryColorChange()">
          </ion-input>
        </ion-item>
        <!-- Más controles de tema... -->
      </div>
      
      <div class="tts-section">
        <h2>Text-to-Speech</h2>
        <!-- Controles TTS... -->
      </div>
      
      <div class="accessibility-section">
        <h2>Accesibilidad</h2>
        <!-- Controles accesibilidad... -->
      </div>
    </ion-content>
  `
})
export class SettingsPage implements OnInit {
  // 500+ líneas de lógica
}
```

#### Refactorizar en Componentes Especializados

```typescript
// DESPUÉS - Componente principal simplificado
@Component({
  selector: 'app-settings',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Configuración</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <app-theme-settings 
        [currentTheme]="currentTheme"
        (themeChanged)="onThemeChanged($event)">
      </app-theme-settings>
      
      <app-tts-settings 
        [ttsConfig]="ttsConfig"
        (configChanged)="onTtsConfigChanged($event)">
      </app-tts-settings>
      
      <app-accessibility-settings 
        [a11yConfig]="a11yConfig"
        (configChanged)="onA11yConfigChanged($event)">
      </app-accessibility-settings>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    ThemeSettingsComponent,
    TtsSettingsComponent,
    AccessibilitySettingsComponent
  ]
})
export class SettingsPage implements OnInit {
  // Solo 50 líneas de lógica de coordinación
}

// Componente "Dumb" especializado
@Component({
  selector: 'app-theme-settings',
  template: `
    <div class="theme-section">
      <h2>Personalizar Tema</h2>
      <ion-item>
        <ion-label>Color Primario</ion-label>
        <ion-input 
          type="color" 
          [value]="currentTheme.primary"
          (ionChange)="onPrimaryColorChange($event)">
        </ion-input>
      </ion-item>
      <!-- Solo controles de tema -->
    </div>
  `,
  standalone: true,
  imports: [CommonModule, IonItem, IonLabel, IonInput]
})
export class ThemeSettingsComponent {
  @Input() currentTheme!: ThemeColors;
  @Output() themeChanged = new EventEmitter<ThemeColors>();

  onPrimaryColorChange(event: any): void {
    const newTheme = { ...this.currentTheme, primary: event.detail.value };
    this.themeChanged.emit(newTheme);
  }
}
```

### Implementar OnPush Strategy

```typescript
// ANTES - Default change detection
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Rerender en cada cycle ❌
}

// DESPUÉS - OnPush optimization
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  // ✅
  standalone: true,
  imports: [CommonModule]
})
export class ExampleComponent {
  // Rerender solo cuando inputs cambien o events se disparen ✅
  
  constructor(private readonly cdr: ChangeDetectorRef) {}

  // Trigger manual cuando sea necesario
  onAsyncDataReceived(): void {
    this.cdr.markForCheck();
  }
}
```

## 🔧 Refactoring de Servicios

### Aplicar Single Responsibility Principle

```typescript
// ANTES - Servicio con múltiples responsabilidades
@Injectable({ providedIn: 'root' })
export class AppService {
  // ❌ Mezclando responsabilidades
  
  // TTS functionality
  async speak(text: string): Promise<void> { /* ... */ }
  async getVoices(): Promise<SpeechVoice[]> { /* ... */ }
  
  // Theme functionality  
  setTheme(colors: ThemeColors): void { /* ... */ }
  getTheme(): ThemeColors { /* ... */ }
  
  // Storage functionality
  async saveData(key: string, data: any): Promise<void> { /* ... */ }
  async loadData(key: string): Promise<any> { /* ... */ }
  
  // HTTP functionality
  async fetchUserData(): Promise<User> { /* ... */ }
  async updateProfile(profile: Profile): Promise<void> { /* ... */ }
}

// DESPUÉS - Servicios especializados
@Injectable({ providedIn: 'root' })
export class HybridTextToSpeechService implements ITextToSpeechService {
  // ✅ Solo responsabilidades TTS
  async speak(text: string, options?: SpeechOptions): Promise<void> { /* ... */ }
  async stop(): Promise<void> { /* ... */ }
  async getVoices(): Promise<SpeechVoice[]> { /* ... */ }
  isSupported(): boolean { /* ... */ }
}

@Injectable({ providedIn: 'root' })
export class ThemeService implements IThemeService {
  // ✅ Solo responsabilidades de tema
  setThemeColors(colors: ThemeColors): void { /* ... */ }
  getThemeColors(): ThemeColors { /* ... */ }
  applyTheme(colors: ThemeColors): void { /* ... */ }
}

@Injectable({ providedIn: 'root' })
export class HybridStorageService implements IStorageService {
  // ✅ Solo responsabilidades de storage
  async get<T>(key: string): Promise<T | null> { /* ... */ }
  async set<T>(key: string, value: T): Promise<void> { /* ... */ }
}
```

### Implementar Error Handling Consistente

```typescript
// ANTES - Error handling inconsistente
export class TextToSpeechService {
  async speak(text: string): Promise<void> {
    try {
      // Implementación...
    } catch (error) {
      console.log(error); // ❌ Inconsistente
      throw error;
    }
  }

  async getVoices(): Promise<SpeechVoice[]> {
    try {
      // Implementación...
    } catch (error) {
      console.error('Error:', error); // ❌ Diferente formato
      return [];
    }
  }
}

// DESPUÉS - Error handling consistente
export class HybridTextToSpeechService implements ITextToSpeechService {
  private readonly logger = console; // O servicio de logging

  async speak(text: string, options?: SpeechOptions): Promise<void> {
    try {
      this.logger.debug('[TTS] Speaking:', { text, options });
      // Implementación...
      this.logger.debug('[TTS] Speech completed successfully');
    } catch (error) {
      this.logger.error('[TTS] Speech failed:', error);
      throw new TTSError('Failed to speak text', error);
    }
  }

  async getVoices(): Promise<SpeechVoice[]> {
    try {
      this.logger.debug('[TTS] Getting available voices');
      const voices = await this.getAvailableVoices();
      this.logger.debug('[TTS] Found voices:', voices.length);
      return voices;
    } catch (error) {
      this.logger.error('[TTS] Failed to get voices:', error);
      throw new TTSError('Failed to get available voices', error);
    }
  }
}

// Error personalizado para mejor debugging
export class TTSError extends Error {
  constructor(message: string, public readonly originalError?: any) {
    super(message);
    this.name = 'TTSError';
  }
}
```

## 🧪 Test-Driven Refactoring

### Proceso TDD para Refactoring

#### 1. Escribir Tests para Comportamiento Actual

```typescript
// tests/legacy-component.spec.ts
describe('LegacyComponent (before refactoring)', () => {
  let component: LegacyComponent;
  
  beforeEach(() => {
    // Setup...
  });

  // Capturar comportamiento actual
  it('should handle theme change', () => {
    component.changeTheme({ primary: '#ff0000' });
    expect(component.getCurrentTheme().primary).toBe('#ff0000');
  });

  it('should speak text with TTS', async () => {
    await component.speakText('Hello world');
    expect(mockTtsService.speak).toHaveBeenCalledWith('Hello world');
  });
});
```

#### 2. Refactorizar Manteniendo Tests Verdes

```typescript
// REFACTORING - Extraer servicio
@Injectable()
export class ExtractedThemeService {
  private currentTheme: ThemeColors = DEFAULT_THEME;

  changeTheme(colors: ThemeColors): void {
    this.currentTheme = { ...colors };
    this.applyTheme(colors);
  }

  getCurrentTheme(): ThemeColors {
    return { ...this.currentTheme };
  }

  private applyTheme(colors: ThemeColors): void {
    // Lógica extraída del componente
  }
}

// Componente refactorizado
@Component({...})
export class RefactoredComponent {
  constructor(
    @Inject(THEME_SERVICE) private readonly themeService: IThemeService
  ) {}

  changeTheme(colors: ThemeColors): void {
    this.themeService.changeTheme(colors);
  }

  getCurrentTheme(): ThemeColors {
    return this.themeService.getCurrentTheme();
  }
}
```

#### 3. Actualizar Tests para Nueva Arquitectura

```typescript
// tests/refactored-component.spec.ts
describe('RefactoredComponent (after refactoring)', () => {
  let component: RefactoredComponent;
  let mockThemeService: jasmine.SpyObj<IThemeService>;

  beforeEach(() => {
    mockThemeService = jasmine.createSpyObj('IThemeService', [
      'changeTheme', 'getCurrentTheme'
    ]);

    TestBed.configureTestingModule({
      imports: [RefactoredComponent],
      providers: [
        { provide: THEME_SERVICE, useValue: mockThemeService }
      ]
    });
  });

  // Mismo comportamiento, nueva implementación
  it('should handle theme change via service', () => {
    const newTheme = { primary: '#ff0000' };
    mockThemeService.getCurrentTheme.and.returnValue(newTheme);

    component.changeTheme(newTheme);

    expect(mockThemeService.changeTheme).toHaveBeenCalledWith(newTheme);
  });
});
```

## 📊 Métricas de Refactoring

### Code Quality Metrics

```typescript
// scripts/measure-complexity.js
const metrics = {
  codeComplexity: {
    cyclomaticComplexity: 'max 10 per method',
    linesOfCode: 'max 300 per component',
    methodLength: 'max 20 lines per method',
    parameterCount: 'max 5 parameters per method'
  },
  
  codeQuality: {
    duplicatedLines: 'less than 5%',
    testCoverage: 'minimum 80%',
    eslintErrors: '0 errors',
    eslintWarnings: 'max 10 warnings'
  },
  
  architecture: {
    dependencyInversion: '100% via InjectionTokens',
    circularDependencies: '0 cycles',
    layerViolations: '0 violations',
    interfaceSegregation: '100% single responsibility'
  }
};
```

### Automated Refactoring Tools

```json
{
  "scripts": {
    "refactor:complexity": "madge --circular --extensions ts src/",
    "refactor:duplicates": "jscpd src/",
    "refactor:lint": "eslint src/ --fix",
    "refactor:format": "prettier src/ --write",
    "refactor:audit": "npm audit && yarn audit",
    "refactor:bundle": "webpack-bundle-analyzer dist/main.js",
    "refactor:all": "npm run refactor:lint && npm run refactor:format && npm run test"
  }
}
```

## 🚀 Proceso de Refactoring

### Workflow de Refactoring Continuo

#### 1. Identificación (Semanal)

```bash
#!/bin/bash
# scripts/identify-refactoring-candidates.sh

echo "🔍 Identificando candidatos para refactoring..."

# Complejidad ciclomática alta
npx complexity-report src/ | grep "complexity:"

# Archivos largos (>300 líneas)
find src/ -name "*.ts" -exec wc -l {} + | awk '$1 > 300 {print $0}'

# Duplicación de código
npx jscpd src/ --threshold 3

# Dependencias circulares
npx madge --circular src/

echo "📊 Reporte generado en refactoring-candidates.md"
```

#### 2. Priorización (Matriz de Impacto)

| Complejidad | Frecuencia Cambios | Prioridad | Acción |
|-------------|-------------------|-----------|---------|
| Alta | Alta | 🔴 Crítica | Refactorizar inmediatamente |
| Alta | Baja | 🟡 Media | Refactorizar en próximo sprint |
| Baja | Alta | 🟡 Media | Monitorear y mejorar incrementalmente |
| Baja | Baja | 🟢 Baja | Mantener como está |

#### 3. Ejecución (Sprint Planning)

```typescript
// Ejemplo de plan de refactoring
const refactoringPlan = {
  sprint1: {
    focus: 'Migración a Standalone Components',
    effort: '8 story points',
    components: ['HomeComponent', 'SettingsComponent'],
    tests: 'Mantener cobertura 80%+'
  },
  
  sprint2: {
    focus: 'Extracción de Servicios',
    effort: '13 story points', 
    services: ['AppService -> TTS + Theme + Storage'],
    interfaces: 'Crear puertos para nuevos servicios'
  },
  
  sprint3: {
    focus: 'Performance Optimization',
    effort: '5 story points',
    tasks: ['OnPush strategy', 'Bundle size reduction'],
    metrics: 'Mejorar Lighthouse score'
  }
};
```

#### 4. Validación (Post-Refactoring)

```bash
#!/bin/bash
# scripts/validate-refactoring.sh

echo "✅ Validando refactoring..."

# Tests deben pasar
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests fallan - revertir refactoring"
  exit 1
fi

# Cobertura no debe bajar
npm run test:coverage
# Validar que coverage >= baseline

# Performance no debe degradarse  
npm run build
# Validar bundle size

# Accesibilidad no debe romperse
npm run test:e2e:accessibility

echo "🎉 Refactoring validado exitosamente"
```

## 📋 Checklist de Refactoring

### Pre-Refactoring

- [ ] Tests existentes identificados y ejecutándose
- [ ] Baseline de métricas establecido (coverage, bundle size, performance)
- [ ] Branch de refactoring creado
- [ ] Documentación actual revisada
- [ ] Stakeholders informados del plan

### Durante Refactoring

- [ ] Cambios incrementales (commits pequeños)
- [ ] Tests ejecutándose en cada cambio
- [ ] Cobertura de tests mantenida o mejorada
- [ ] Accesibilidad verificada en cada cambio
- [ ] Performance monitoreada

### Post-Refactoring

- [ ] Todos los tests pasan
- [ ] Cobertura >= baseline original
- [ ] Bundle size <= baseline original
- [ ] Performance >= baseline original
- [ ] Accesibilidad mantenida (WCAG AAA)
- [ ] Documentación actualizada
- [ ] Code review completado
- [ ] Deploy a staging/testing exitoso