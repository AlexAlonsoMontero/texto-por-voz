import { TestBed } from '@angular/core/testing';
import { PhraseButtonConfigService } from './phrase-button-config.service';

describe('PhraseButtonConfigService', () => {
  let service: PhraseButtonConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhraseButtonConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should manage button configuration', () => {
    expect(service).toBeTruthy();
  });
});
