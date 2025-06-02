import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { reducers } from './app.reducer';
import { routes } from './app.routes';
import { LayoutModule } from './layout/layout.module';
import { MaterialModule } from './material';
import { SharedModule } from './shared/shared.module';
import { CustomRouterStateSerializer } from './shared/utils';

export const COMPONENTS = [
  AppComponent,
];

@NgModule({ declarations: COMPONENTS,
    exports: COMPONENTS,
    bootstrap: [AppComponent], imports: [CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        RouterModule.forRoot(routes, {}),
        StoreModule.forRoot(reducers),
        StoreRouterConnectingModule.forRoot(),
        !environment.production ? StoreDevtoolsModule.instrument({ connectInZone: true }) : [],
        EffectsModule.forRoot([]),
        LayoutModule.forRoot()], providers: [
        { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
