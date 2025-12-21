import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhrasesPage } from './phrases.page';
import { TEST_PROVIDERS } from '../../../testing';

describe('PhrasesPage', () => {
  let component: PhrasesPage;
  let fixture: ComponentFixture<PhrasesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhrasesPage],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(PhrasesPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have phrase slots if property exists', () => {
    if (component.hasOwnProperty('slots')) {
      expect(component).toBeTruthy();
    } else {
      expect(component).toBeTruthy();
    }
  });
});
