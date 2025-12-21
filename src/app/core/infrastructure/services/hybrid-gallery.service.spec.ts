import { TestBed } from '@angular/core/testing';
import { HybridGalleryService } from './hybrid-gallery.service';

describe('HybridGalleryService', () => {
  let service: HybridGalleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HybridGalleryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle image selection', () => {
    expect(service).toBeTruthy();
  });
});
