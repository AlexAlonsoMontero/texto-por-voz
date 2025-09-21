import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonSplitPane, IonMenu } from '@ionic/angular/standalone';
import { SidebarNavigationComponent } from './shared/components/sidebar-navigation/sidebar-navigation.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonSplitPane, IonMenu, SidebarNavigationComponent],
})
export class AppComponent {
  constructor() {}
}
