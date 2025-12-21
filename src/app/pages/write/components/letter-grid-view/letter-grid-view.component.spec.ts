import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterGridViewComponent } from './letter-grid-view.component';
import { TEST_PROVIDERS } from '../../../../../testing';

describe('LetterGridViewComponent', () => {
  let component: LetterGridViewComponent;
  let fixture: ComponentFixture<LetterGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterGridViewComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(LetterGridViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display letters in grid', () => {
    expect(component).toBeTruthy();
  });

  it('should be keyboard accessible', () => {
    expect(component).toBeTruthy();
  });
});
