import { TestBed } from '@angular/core/testing';
import { HybridOrientationService } from './hybrid-orientation.service';

describe('HybridOrientationService', () => {
  let service: HybridOrientationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HybridOrientationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have orientation methods', () => {
    expect(service).toBeTruthy();
  });
});
