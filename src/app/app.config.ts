import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { DatePipe } from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), DatePipe,
    provideHttpClient(withFetch()),
    // importProvidersFrom([NgxSliderModule]),
     provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
