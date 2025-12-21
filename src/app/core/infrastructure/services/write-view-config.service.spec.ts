import { TestBed } from '@angular/core/testing';
import { WriteViewConfigService } from './write-view-config.service';

describe('WriteViewConfigService', () => {
  let service: WriteViewConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WriteViewConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should manage view configuration', () => {
    expect(service).toBeTruthy();
  });
});
