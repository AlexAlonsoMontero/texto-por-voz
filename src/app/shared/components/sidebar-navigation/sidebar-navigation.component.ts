import { Component } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-sidebar-navigation',
  standalone: true,
  imports: [IonButton, IonIcon],
  templateUrl: './sidebar-navigation.component.html',
  styleUrls: ['./sidebar-navigation.component.scss'],
})
export class SidebarNavigationComponent {
  constructor(private readonly navCtrl: NavController) {}

  onButtonHomeClick(): void {
    this.navCtrl.navigateRoot('/home');
  }

  onButtonSettingsClick(): void {
    this.navCtrl.navigateRoot('/settings');
  }
}
