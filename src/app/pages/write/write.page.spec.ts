import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritePage } from './write.page';
import { TEST_PROVIDERS } from '../../../testing';

/**
 * Tests de WritePage
 * Enfoque: Contratos básicos
 */
describe('WritePage', () => {
  let component: WritePage;
  let fixture: ComponentFixture<WritePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritePage],
      providers: [...TEST_PROVIDERS]
    }).compileComponents();

    fixture = TestBed.createComponent(WritePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have text content property', () => {
    expect(component.textContent).toBeDefined();
  });

  it('should have view state property', () => {
    expect(component.viewState).toBeDefined();
  });

  it('should have view mode property', () => {
    expect(component.viewMode).toBeDefined();
  });

  it('should have letter groups', () => {
    expect(component.letterGroups).toBeDefined();
  });
});


