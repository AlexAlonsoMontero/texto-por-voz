import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { PressHoldButtonComponent } from '../press-hold-button/press-hold-button.component';

@Component({
  selector: 'app-sidebar-navigation',
  standalone: true,
  imports: [IonIcon, PressHoldButtonComponent],
  templateUrl: './sidebar-navigation.component.html',
  styleUrls: ['./sidebar-navigation.component.scss'],
})
export class SidebarNavigationComponent {
  constructor(private readonly navCtrl: NavController) {}

  onButtonHomeClick(): void {
    this.navCtrl.navigateRoot('/home');
  }

  onButtonWriteClick(): void {
    this.navCtrl.navigateRoot('/write');
  }

  onButtonSettingsClick(): void {
    this.navCtrl.navigateRoot('/settings');
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
}
