import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  home,
  settings,
  create,
  pencil,
  document,
  documentText,
  reader,
  book,
  volumeHigh,
  backspace,
  trash,
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { CORE_PROVIDERS } from './app/core/infrastructure/providers';

addIcons({
  home,
  settings,
  create,
  pencil,
  document,
  'document-text': documentText,
  reader,
  book,
  'volume-high': volumeHigh,
  backspace,
  trash,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    ...CORE_PROVIDERS,
  ],
});
