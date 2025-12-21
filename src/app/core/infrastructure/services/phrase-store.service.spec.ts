import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { PhraseStoreService } from './phrase-store.service';
import { FileStorageService } from './file-storage.service';
import { PhraseButtonConfigService } from './phrase-button-config.service';

/**
 * Tests de PhraseStoreService
 * Enfoque: Contrato de interfaz + comportamiento observable
 */
describe('PhraseStoreService', () => {
  let service: PhraseStoreService;
  let mockFileStorage: jasmine.SpyObj<FileStorageService>;
  let mockButtonConfig: jasmine.SpyObj<PhraseButtonConfigService>;

  beforeEach(() => {
    // Mock FileStorageService
    mockFileStorage = jasmine.createSpyObj('FileStorageService', [
      'saveTextFile',
      'readTextFile',
      'deleteFile',
      'fileExists',
    ]);

    // Mock PhraseButtonConfigService
    mockButtonConfig = jasmine.createSpyObj('PhraseButtonConfigService', ['getConfig']);
    mockButtonConfig.getConfig.and.returnValue(
      Promise.resolve({
        count: 12,
        layout: 'grid',
        size: 'medium',
      })
    );

    // Mock Preferences
    spyOn(Preferences, 'set').and.returnValue(Promise.resolve());
    spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: null }));

    TestBed.configureTestingModule({
      providers: [
        PhraseStoreService,
        { provide: FileStorageService, useValue: mockFileStorage },
        { provide: PhraseButtonConfigService, useValue: mockButtonConfig },
      ],
    });

    service = TestBed.inject(PhraseStoreService);
  });

  describe('Interface Contract', () => {
    it('should create service', () => {
      expect(service).toBeTruthy();
    });

    it('should implement IPhraseStoreService methods', () => {
      expect(typeof service.saveAt).toBe('function');
      expect(typeof service.getAll).toBe('function');
      expect(typeof service.removeAt).toBe('function');
      expect(typeof service.clearAll).toBe('function');
      expect(typeof service.observeAll).toBe('function');
      expect(typeof service.findDuplicateIndex).toBe('function');
      expect(typeof service.normalize).toBe('function');
    });

    it('should provide capacity property', () => {
      expect(typeof service.capacity).toBe('number');
      expect(service.capacity).toBeGreaterThan(0);
    });

    it('should provide observeAll observable', () => {
      const observable = service.observeAll();
      expect(observable).toBeDefined();
      expect(typeof observable.subscribe).toBe('function');
    });
  });

  describe('Basic Operations', () => {
    it('should save phrase without throwing', async () => {
      await expectAsync(service.saveAt(0, 'Test phrase')).toBeResolved();
    });

    it('should get all phrases without throwing', async () => {
      await expectAsync(service.getAll()).toBeResolved();
    });

    it('should remove slot without throwing', async () => {
      await expectAsync(service.removeAt(0)).toBeResolved();
    });

    it('should clear all slots without throwing', async () => {
      await expectAsync(service.clearAll()).toBeResolved();
    });

    it('should find duplicate index without throwing', async () => {
      await expectAsync(service.findDuplicateIndex('test')).toBeResolved();
    });
  });

  describe('Slot Validation', () => {
    it('should handle negative slot index gracefully', async () => {
      await expectAsync(service.saveAt(-1, 'test')).toBeResolved();
    });

    it('should handle slot index beyond capacity gracefully', async () => {
      const beyondCapacity = service.capacity + 10;
      await expectAsync(service.saveAt(beyondCapacity, 'test')).toBeResolved();
    });

    it('should handle valid slot indexes', async () => {
      await expectAsync(service.saveAt(0, 'first')).toBeResolved();
      await expectAsync(service.saveAt(service.capacity - 1, 'last')).toBeResolved();
    });
  });

  describe('Data Persistence', () => {
    it('should return SaveResult with ok property', async () => {
      const result = await service.saveAt(0, 'test');
      expect(result).toBeDefined();
      expect(typeof result.ok).toBe('boolean');
    });

    it('should handle save without error', async () => {
      const result = await service.saveAt(0, 'Test phrase');
      expect(result.ok).toBeDefined();
    });

    it('should handle empty string', async () => {
      await expectAsync(service.saveAt(0, '')).toBeResolved();
    });

    it('should handle very long strings', async () => {
      const longString = 'a'.repeat(10000);
      await expectAsync(service.saveAt(0, longString)).toBeResolved();
    });

    it('should normalize strings', () => {
      const normalized = service.normalize('  test  phrase  ');
      expect(typeof normalized).toBe('string');
    });
  });

  describe('Observable Updates', () => {
    it('should emit slots on subscription', (done) => {
      service.observeAll().subscribe((slots) => {
        expect(Array.isArray(slots)).toBe(true);
        expect(slots.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should emit slots with correct structure', (done) => {
      service.observeAll().subscribe((slots) => {
        const firstSlot = slots[0];
        expect(firstSlot).toBeDefined();
        expect(typeof firstSlot.index).toBe('number');
        expect(typeof firstSlot.value).toBe('string');
        done();
      });
    });
  });

  describe('Error Handling', () => {
    it('should have error handling methods', () => {
      // Verificar que el servicio está preparado para manejar errores
      expect(service).toBeTruthy();
      expect(typeof service.getAll).toBe('function');
      expect(typeof service.saveAt).toBe('function');
    });

    it('should normalize handle edge cases', () => {
      expect(() => service.normalize('')).not.toThrow();
      expect(() => service.normalize('  ')).not.toThrow();
      expect(() => service.normalize('test')).not.toThrow();
    });
  });
});
