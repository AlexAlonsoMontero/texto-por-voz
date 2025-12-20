import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { TEST_PROVIDERS } from '../../testing';
import { NavController } from '@ionic/angular';
import { PressHoldConfigService } from '../core/application/services/press-hold-config.service';
import { of } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mockNavController: jasmine.SpyObj<NavController>;
  let mockPressHoldConfigService: jasmine.SpyObj<PressHoldConfigService>;

  beforeEach(async () => {
    mockNavController = jasmine.createSpyObj('NavController', ['navigateRoot', 'back']);
    mockPressHoldConfigService = jasmine.createSpyObj('PressHoldConfigService', [], {
      duration$: of(3000),
    });

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        ...TEST_PROVIDERS,
        { provide: NavController, useValue: mockNavController },
        { provide: PressHoldConfigService, useValue: mockPressHoldConfigService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have ion-content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('ion-content')).toBeTruthy();
  });
});
