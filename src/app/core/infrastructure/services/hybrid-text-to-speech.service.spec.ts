import { TestBed } from '@angular/core/testing';
import { HybridTextToSpeechService } from './hybrid-text-to-speech.service';
import { TTSStatus } from '../../domain/interfaces/text-to-speech.interface';

/**
 * Tests simplificados de HybridTextToSpeechService
 * Enfoque: Tests de contrato de interfaz y comportamiento observable
 * 
 * Nota: Los tests de interacción con speechSynthesis API nativa se realizan
 * mediante tests E2E ya que mockear APIs readonly del browser es frágil.
 */
describe('HybridTextToSpeechService', () => {
  let service: HybridTextToSpeechService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HybridTextToSpeechService],
    });

    service = TestBed.inject(HybridTextToSpeechService);
  });

  afterEach(() => {
    service.stop();
  });

  describe('Interface Contract', () => {
    it('should create service', () => {
      expect(service).toBeTruthy();
    });

    it('should implement ITextToSpeechService methods', () => {
      expect(typeof service.speak).toBe('function');
      expect(typeof service.stop).toBe('function');
      expect(typeof service.initialize).toBe('function');
      expect(typeof service.isSupported).toBe('function');
      expect(typeof service.getStatus).toBe('function');
    });

    it('should provide isSupported as boolean', () => {
      const supported = service.isSupported();
      expect(typeof supported).toBe('boolean');
    });

    it('should provide status from enum', () => {
      const status = service.getStatus();
      expect(Object.values(TTSStatus)).toContain(status);
    });
  });

  describe('Initialization', () => {
    it('should initialize with UNINITIALIZED status', () => {
      expect(service.getStatus()).toBe(TTSStatus.UNINITIALIZED);
    });

    it('should provide needsActivation flag', () => {
      expect(typeof service.needsActivation).toBe('function');
      expect(typeof service.needsActivation()).toBe('boolean');
    });
  });

  describe('Platform Detection', () => {
    it('should return false when no TTS available', () => {
      delete (globalThis as any).speechSynthesis;
      const newService = new HybridTextToSpeechService();

      expect(newService.isSupported()).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty text without throwing', () => {
      // No debe lanzar error síncrono
      expect(() => service.speak('')).not.toThrow();
      expect(() => service.speak('   ')).not.toThrow();
    });

    it('should handle undefined text without throwing', () => {
      // No debe lanzar error síncrono
      expect(() => service.speak(undefined as any)).not.toThrow();
    });

    it('should not throw when stop called without active speech', () => {
      expect(() => service.stop()).not.toThrow();
    });
  });

  describe('Status Management', () => {
    it('should provide isReady method', () => {
      expect(typeof service.isReady).toBe('function');
      expect(typeof service.isReady()).toBe('boolean');
    });

    it('should provide isSpeaking method', () => {
      expect(typeof service.isSpeaking).toBe('function');
      expect(typeof service.isSpeaking()).toBe('boolean');
    });
  });

  describe('Voice Management', () => {
    it('should provide getAvailableVoices method', () => {
      expect(typeof service.getAvailableVoices).toBe('function');
    });

    it('should return promise from getAvailableVoices', () => {
      const result = service.getAvailableVoices();
      expect(result instanceof Promise).toBe(true);
    });
  });

  describe('Playback Control', () => {
    it('should provide pause method', () => {
      expect(typeof service.pause).toBe('function');
    });

    it('should provide resume method', () => {
      expect(typeof service.resume).toBe('function');
    });
  });
});
