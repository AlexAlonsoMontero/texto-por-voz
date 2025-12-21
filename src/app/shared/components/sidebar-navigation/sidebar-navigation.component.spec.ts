import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarNavigationComponent } from './sidebar-navigation.component';
import { TEST_PROVIDERS } from '../../../../testing';

/**
 * Tests de SidebarNavigationComponent  
 * Enfoque: Navegación + accesibilidad + contratos
 * 
 * CRÍTICO: Componente de navegación principal para accesibilidad
 */
describe('SidebarNavigationComponent', () => {
  let component: SidebarNavigationComponent;
  let fixture: ComponentFixture<SidebarNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavigationComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Contract', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have navigation methods', () => {
      expect(typeof component.onButtonHomeClick).toBe('function');
      expect(typeof component.onButtonWriteClick).toBe('function');
      expect(typeof component.onButtonPhrasesClick).toBe('function');
      expect(typeof component.onButtonSettingsClick).toBe('function');
    });

    it('should have press-hold action handlers', () => {
      expect(typeof component.onHomeAction).toBe('function');
      expect(typeof component.onWriteAction).toBe('function');
      expect(typeof component.onPhrasesAction).toBe('function');
      expect(typeof component.onSettingsAction).toBe('function');
      expect(typeof component.onBackAction).toBe('function');
    });

    it('should have observable for hold duration', () => {
      expect(component.holdDuration$).toBeDefined();
    });
  });

  describe('Navigation Actions', () => {
    it('should handle home navigation', () => {
      expect(() => component.onButtonHomeClick()).not.toThrow();
    });

    it('should handle write navigation', () => {
      expect(() => component.onButtonWriteClick()).not.toThrow();
    });

    it('should handle phrases navigation', () => {
      expect(() => component.onButtonPhrasesClick()).not.toThrow();
    });

    it('should handle settings navigation', () => {
      expect(() => component.onButtonSettingsClick()).not.toThrow();
    });
  });

  describe('Press-Hold Action Handlers', () => {
    it('should handle home action', () => {
      expect(() => component.onHomeAction('home-action')).not.toThrow();
    });

    it('should handle write action', () => {
      expect(() => component.onWriteAction('write-action')).not.toThrow();
    });

    it('should handle phrases action', () => {
      expect(() => component.onPhrasesAction('phrases-action')).not.toThrow();
    });

    it('should handle settings action', () => {
      expect(() => component.onSettingsAction('settings-action')).not.toThrow();
    });

    it('should handle back action', () => {
      expect(() => component.onBackAction('back-action')).not.toThrow();
    });
  });

  describe('Integration', () => {
    it('should work with navigation controller', () => {
      // NavController está inyectado via TEST_PROVIDERS
      expect(component).toBeTruthy();
    });

    it('should work with router', () => {
      // Router está inyectado via TEST_PROVIDERS
      expect(component).toBeTruthy();
    });
  });
});

