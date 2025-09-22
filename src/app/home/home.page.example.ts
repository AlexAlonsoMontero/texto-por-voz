import { Component, OnInit, Inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { SAFE_AREA_SERVICE } from '../core/infrastructure/injection-tokens';
import { ISafeAreaService } from '../core/domain/interfaces/safe-area.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent],
})
export class HomePage implements OnInit {
  constructor(
    @Inject(SAFE_AREA_SERVICE)
    private readonly safeAreaService: ISafeAreaService,
  ) {}

  async ngOnInit() {
    // Debug completo del safe area
    await this.safeAreaService.debugSafeAreaInfo();

    // Mostrar información específica
    const insets = await this.safeAreaService.getSafeAreaInsets();
    console.log('🔍 Barras detectadas:');
    console.log(`Status bar (superior): ${insets.top}px`);
    console.log(`Navigation bar (inferior): ${insets.bottom}px`);

    const hasSystemBars = await this.safeAreaService.hasSystemBars();
    console.log(`¿Tiene barras del sistema?: ${hasSystemBars}`);

    const availableHeight = await this.safeAreaService.getAvailableHeight();
    console.log(`Altura real disponible: ${availableHeight}px`);
  }
}
