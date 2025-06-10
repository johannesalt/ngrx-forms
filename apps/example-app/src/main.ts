import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppComponent } from './app/app.component';
import { reducers } from './app/app.reducer';
import { routes } from './app/app.routes';
import { CustomRouterStateSerializer } from './app/shared/utils';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { float: 'always' } },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideEffects([]),
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideRouterStore({ serializer: CustomRouterStateSerializer }),
    provideStore(reducers),
    provideStoreDevtools(),
  ],
}).catch((err) => console.log(err));
