import { Component } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sidebar-navigation',
  standalone: true,
  imports: [IonButton, IonIcon],
  templateUrl: './sidebar-navigation.component.html',
  styleUrls: ['./sidebar-navigation.component.scss'],
})
export class SidebarNavigationComponent {
  onButtonAAClick(): void {
    console.log('Botón AA clicked');
  }

  onButtonBBClick(): void {
    console.log('Botón BB clicked');
  }
}
