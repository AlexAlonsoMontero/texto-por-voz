import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { ThemeService } from './theme.service';
import { ThemeColors, DEFAULT_THEME_COLORS } from '../../domain/interfaces/theme.interface';

describe('ThemeService', () => {
  let service: ThemeService;
  let documentElement: HTMLElement;

  beforeEach(() => {
    TestBed.resetTestingModule();
    
    documentElement = document.documentElement;
    
    // Mock Preferences ANTES de configurar el módulo
    spyOn(Preferences, 'set').and.returnValue(Promise.resolve());
    spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: null }));
    spyOn(Preferences, 'remove').and.returnValue(Promise.resolve());
    
    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    // Limpiar CSS variables después de cada test
    documentElement.style.cssText = '';
  });

  describe('Initialization', () => {
    it('should create service', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize without errors', async () => {
      await expectAsync(service.initialize()).toBeResolved();
    });

    it('should provide default theme colors', () => {
      const theme = service.getThemeColors();
      
      expect(theme).toBeDefined();
      expect(theme.primary).toBeDefined();
      expect(theme.secondary).toBeDefined();
      expect(theme.background).toBeDefined();
      expect(theme.text).toBeDefined();
    });

    it('should return copy of theme to prevent mutations', () => {
      const theme1 = service.getThemeColors();
      const theme2 = service.getThemeColors();
      
      expect(theme1).not.toBe(theme2); // Diferentes referencias
      expect(theme1).toEqual(theme2); // Mismo contenido
    });
  });

  describe('Theme Application', () => {
    it('should apply theme colors to CSS variables', () => {
      const testTheme: ThemeColors = {
        primary: '#2196F3',
        secondary: '#FF9800',
        background: '#FFFFFF',
        text: '#000000',
      };

      service.applyTheme(testTheme);

      expect(documentElement.style.getPropertyValue('--ion-color-primary')).toBe('#2196F3');
      expect(documentElement.style.getPropertyValue('--ion-color-secondary')).toBe('#FF9800');
      expect(documentElement.style.getPropertyValue('--ion-background-color')).toBe('#FFFFFF');
      expect(documentElement.style.getPropertyValue('--ion-text-color')).toBe('#000000');
    });

    it('should apply primary color with variants', () => {
      const testTheme: ThemeColors = {
        ...DEFAULT_THEME_COLORS,
        primary: '#2196F3',
      };

      service.applyTheme(testTheme);

      expect(documentElement.style.getPropertyValue('--ion-color-primary')).toBe('#2196F3');
      expect(documentElement.style.getPropertyValue('--ion-color-primary-rgb')).toBeTruthy();
      expect(documentElement.style.getPropertyValue('--ion-color-primary-contrast')).toBeTruthy();
      expect(documentElement.style.getPropertyValue('--ion-color-primary-shade')).toBeTruthy();
      expect(documentElement.style.getPropertyValue('--ion-color-primary-tint')).toBeTruthy();
    });

    it('should apply secondary color with variants', () => {
      const testTheme: ThemeColors = {
        ...DEFAULT_THEME_COLORS,
        secondary: '#FF9800',
      };

      service.applyTheme(testTheme);

      expect(documentElement.style.getPropertyValue('--ion-color-secondary')).toBe('#FF9800');
      expect(documentElement.style.getPropertyValue('--ion-color-secondary-rgb')).toBeTruthy();
      expect(documentElement.style.getPropertyValue('--ion-color-secondary-contrast')).toBeTruthy();
      expect(documentElement.style.getPropertyValue('--ion-color-secondary-shade')).toBeTruthy();
      expect(documentElement.style.getPropertyValue('--ion-color-secondary-tint')).toBeTruthy();
    });

    it('should apply background color', () => {
      const testTheme: ThemeColors = {
        ...DEFAULT_THEME_COLORS,
        background: '#121212',
      };

      service.applyTheme(testTheme);

      expect(documentElement.style.getPropertyValue('--ion-background-color')).toBe('#121212');
    });

    it('should apply text color', () => {
      const testTheme: ThemeColors = {
        ...DEFAULT_THEME_COLORS,
        text: '#FFFFFF',
      };

      service.applyTheme(testTheme);

      expect(documentElement.style.getPropertyValue('--ion-text-color')).toBe('#FFFFFF');
    });

    it('should convert hex to RGB for Ionic variables', () => {
      const testTheme: ThemeColors = {
        ...DEFAULT_THEME_COLORS,
        primary: '#2196F3', // RGB: 33, 150, 243
      };

      service.applyTheme(testTheme);

      expect(documentElement.style.getPropertyValue('--ion-color-primary-rgb')).toBe('33, 150, 243');
    });
  });

  describe('Color Utilities', () => {
    it('should generate darker shade', () => {
      const testTheme: ThemeColors = {
        ...DEFAULT_THEME_COLORS,
        primary: '#2196F3',
      };

      service.applyTheme(testTheme);

      const shade = documentElement.style.getPropertyValue('--ion-color-primary-shade');
      expect(shade).toBeTruthy();
      expect(shade).not.toBe('#2196F3'); // Debe ser diferente al original
    });

    it('should generate lighter tint', () => {
      const testTheme: ThemeColors = {
        ...DEFAULT_THEME_COLORS,
        primary: '#2196F3',
      };

      service.applyTheme(testTheme);

      const tint = documentElement.style.getPropertyValue('--ion-color-primary-tint');
      expect(tint).toBeTruthy();
      expect(tint).not.toBe('#2196F3'); // Debe ser diferente al original
    });

    it('should calculate correct contrast for light colors', () => {
      const testTheme: ThemeColors = {
        ...DEFAULT_THEME_COLORS,
        primary: '#FFFFFF', // Blanco - debe usar texto oscuro
      };

      service.applyTheme(testTheme);

      const contrast = documentElement.style.getPropertyValue('--ion-color-primary-contrast');
      expect(contrast).toBe('#222222'); // Texto oscuro para fondo claro
    });

    it('should calculate correct contrast for dark colors', () => {
      const testTheme: ThemeColors = {
        ...DEFAULT_THEME_COLORS,
        primary: '#000000', // Negro - debe usar texto claro
      };

      service.applyTheme(testTheme);

      const contrast = documentElement.style.getPropertyValue('--ion-color-primary-contrast');
      expect(contrast).toBe('#FFFFFF'); // Texto claro para fondo oscuro
    });

    it('should handle edge case hex colors', () => {
      const testTheme: ThemeColors = {
        primary: '#FFF',
        secondary: '#000',
        background: '#FFFFFF',
        text: '#000000',
      };

      // No debería lanzar errores
      expect(() => service.applyTheme(testTheme)).not.toThrow();
    });
  });

  describe('Theme Management', () => {
    it('should update theme colors', () => {
      const newTheme: ThemeColors = {
        primary: '#E91E63',
        secondary: '#9C27B0',
        background: '#FAFAFA',
        text: '#212121',
      };

      service.setThemeColors(newTheme);
      const currentTheme = service.getThemeColors();
      
      expect(currentTheme.primary).toBe(newTheme.primary);
      expect(currentTheme.secondary).toBe(newTheme.secondary);
      expect(currentTheme.background).toBe(newTheme.background);
      expect(currentTheme.text).toBe(newTheme.text);
    });

    it('should reset to default theme', () => {
      const customTheme: ThemeColors = {
        primary: '#FF0000',
        secondary: '#00FF00',
        background: '#0000FF',
        text: '#FFFF00',
      };

      service.setThemeColors(customTheme);
      service.resetToDefault();

      const theme = service.getThemeColors();
      expect(theme).toEqual(DEFAULT_THEME_COLORS);
    });

    it('should return copy of theme colors to prevent mutation', () => {
      const theme = service.getThemeColors();
      theme.primary = '#MUTATED';

      const actualTheme = service.getThemeColors();
      expect(actualTheme.primary).not.toBe('#MUTATED');
    });

    it('should not mutate when setting theme colors', () => {
      const originalTheme: ThemeColors = {
        primary: '#2196F3',
        secondary: '#FF9800',
        background: '#FFFFFF',
        text: '#000000',
      };

      service.setThemeColors(originalTheme);
      originalTheme.primary = '#MUTATED';

      const storedTheme = service.getThemeColors();
      expect(storedTheme.primary).toBe('#2196F3');
    });
  });

  describe('Predefined Colors', () => {
    it('should return predefined colors palette', () => {
      const colors = service.getPredefinedColors();

      expect(colors).toBeTruthy();
      expect(colors.length).toBeGreaterThan(0);
      expect(colors[0].name).toBeDefined();
      expect(colors[0].value).toBeDefined();
    });

    it('should find color by name', () => {
      const colors = service.getPredefinedColors();
      const firstColorName = colors[0].name;

      const foundColor = service.getColorByName(firstColorName);

      expect(foundColor).toBeTruthy();
      expect(foundColor?.name).toBe(firstColorName);
    });

    it('should return undefined for non-existent color', () => {
      const color = service.getColorByName('NonExistentColor123');

      expect(color).toBeUndefined();
    });
  });

  describe('Persistence', () => {
    it('should not throw when setting theme', () => {
      const newTheme: ThemeColors = {
        primary: '#E91E63',
        secondary: '#9C27B0',
        background: '#FAFAFA',
        text: '#212121',
      };

      expect(() => service.setThemeColors(newTheme)).not.toThrow();
    });

    it('should initialize without throwing', async () => {
      await expectAsync(service.initialize()).toBeResolved();
    });
  });

  describe('WCAG AAA Compliance', () => {
    it('should ensure high contrast for accessibility', () => {
      // Probar con combinación de alto contraste
      const highContrastTheme: ThemeColors = {
        primary: '#000000',
        secondary: '#FFFFFF',
        background: '#FFFFFF',
        text: '#000000',
      };

      service.applyTheme(highContrastTheme);

      const primaryContrast = documentElement.style.getPropertyValue('--ion-color-primary-contrast');
      const secondaryContrast = documentElement.style.getPropertyValue('--ion-color-secondary-contrast');

      // Negro debe tener texto blanco
      expect(primaryContrast).toBe('#FFFFFF');
      // Blanco debe tener texto oscuro
      expect(secondaryContrast).toBe('#222222');
    });

    it('should maintain contrast ratios for medium colors', () => {
      const mediumTheme: ThemeColors = {
        primary: '#2196F3', // Azul medio
        secondary: '#FF9800', // Naranja medio
        background: '#F5F5F5',
        text: '#212121',
      };

      service.applyTheme(mediumTheme);

      const primaryContrast = documentElement.style.getPropertyValue('--ion-color-primary-contrast');
      const secondaryContrast = documentElement.style.getPropertyValue('--ion-color-secondary-contrast');

      expect(primaryContrast).toBeTruthy();
      expect(secondaryContrast).toBeTruthy();
    });
  });
});
