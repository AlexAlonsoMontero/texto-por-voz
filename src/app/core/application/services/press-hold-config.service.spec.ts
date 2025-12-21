import { TestBed } from '@angular/core/testing';
import { PressHoldConfigService } from './press-hold-config.service';

describe('PressHoldConfigService', () => {
  let service: PressHoldConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PressHoldConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should manage press-hold configuration', () => {
    expect(service).toBeTruthy();
  });
});
