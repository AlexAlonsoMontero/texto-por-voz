import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { PressHoldConfigService } from '../../../core/application/services/press-hold-config.service';
import { BackNavigationService } from '../../../core/application/services/back-navigation.service';
import { PressHoldButtonComponent } from '../press-hold-button/press-hold-button.component';

@Component({
  selector: 'app-sidebar-navigation',
  standalone: true,
  imports: [CommonModule, IonIcon, PressHoldButtonComponent],
  templateUrl: './sidebar-navigation.component.html',
  styleUrls: ['./sidebar-navigation.component.scss'],
})
export class SidebarNavigationComponent {
  holdDuration$ = this.pressHoldConfig.duration$;

  constructor(
    private readonly navCtrl: NavController,
    private readonly pressHoldConfig: PressHoldConfigService,
    private readonly router: Router,
    private readonly backNavService: BackNavigationService,
  ) {}

  onButtonHomeClick(): void {
    this.navCtrl.navigateRoot('/home');
  }

  onButtonWriteClick(): void {
    this.navCtrl.navigateRoot('/write');
  }

  onButtonSettingsClick(): void {
    this.navCtrl.navigateRoot('/settings');
  }

  onButtonPhrasesClick(): void {
    this.navCtrl.navigateRoot('/phrases');
  }

  /**
   * Maneja la acción del botón Home (press-hold)
   */
  onHomeAction(actionId: string): void {
    console.log(`🏠 [Sidebar] Acción Home ejecutada: ${actionId}`);
    this.onButtonHomeClick();
  }

  /**
   * Maneja la acción del botón Write (press-hold)
   */
  onWriteAction(actionId: string): void {
    console.log(`✍️ [Sidebar] Acción Write ejecutada: ${actionId}`);
    this.onButtonWriteClick();
  }

  /**
   * Maneja la acción del botón Settings (press-hold)
   */
  onSettingsAction(actionId: string): void {
    console.log(`⚙️ [Sidebar] Acción Settings ejecutada: ${actionId}`);
    this.onButtonSettingsClick();
  }

  /**
   * Maneja la acción del botón Phrases (press-hold)
   */
  onPhrasesAction(actionId: string): void {
    console.log(`📝 [Sidebar] Acción Phrases ejecutada: ${actionId}`);
    this.onButtonPhrasesClick();
  }

  /**
   * Maneja la acción del botón Volver (press-hold)
   */
  onBackAction(actionId: string): void {
    console.log(`🔙 [Sidebar] Acción Volver ejecutada: ${actionId}`);
    
    // 1. Prioridad: Handler personalizado (navegación interna de la página)
    if (this.backNavService.handleBack()) {
      return;
    }

    const currentUrl = this.router.url;
    // Si estamos en una página raíz distinta de home, volvemos a home
    if (currentUrl.includes('/write') || currentUrl.includes('/phrases') || currentUrl.includes('/settings')) {
      this.navCtrl.navigateRoot('/home');
    } else {
      // En otros casos (subpáginas o historial válido), intentamos volver atrás
      this.navCtrl.back();
    }
  }
}
