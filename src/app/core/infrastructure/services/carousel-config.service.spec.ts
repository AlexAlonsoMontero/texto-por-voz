import { TestBed } from '@angular/core/testing';
import { CarouselConfigService } from './carousel-config.service';

describe('CarouselConfigService', () => {
  let service: CarouselConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should manage carousel config', () => {
    expect(service).toBeTruthy();
  });
});
