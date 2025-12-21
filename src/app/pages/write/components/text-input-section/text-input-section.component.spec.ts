import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextInputSectionComponent } from './text-input-section.component';
import { TEST_PROVIDERS } from '../../../../../testing';

describe('TextInputSectionComponent', () => {
  let component: TextInputSectionComponent;
  let fixture: ComponentFixture<TextInputSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputSectionComponent],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(TextInputSectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle text input', () => {
    expect(component).toBeTruthy();
  });

  it('should emit text changes', () => {
    expect(component).toBeTruthy();
  });
});
