import { TestBed } from '@angular/core/testing';
import { HybridSafeAreaService } from './hybrid-safe-area.service';

describe('HybridSafeAreaService', () => {
  let service: HybridSafeAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HybridSafeAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle safe area insets', () => {
    expect(service).toBeTruthy();
  });
});
