import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { reducer as arrayReducer } from './array/array.reducer';
import { AsyncValidationEffects } from './async-validation/async-validation.effects';
import { reducer as asyncValidationReducer } from './async-validation/async-validation.reducer';
import { reducer as dynamicReducer } from './dynamic/dynamic.reducer';
import { LocalStateAdvancedEffects } from './local-state-advanced/local-state-advanced.effects';
import { reducer as simpleFormReducer } from './simple-form/simple-form.reducer';
import { reducer as syncValidationReducer } from './sync-validation/sync-validation.reducer';
import { reducer as valueBoxingReducer } from './value-boxing/value-boxing.reducer';
import { reducer as valueConversionReducer } from './value-conversion/value-conversion.reducer';
import { reducer as recursiveUpdateReducer } from './recursive-update/recursive-update.reducer';
import { reducer as materialReducer } from './material-example/material.reducer';

export const routes: Routes = [
  { path: '', redirectTo: '/introduction', pathMatch: 'full' },
  {
    loadComponent: () => import('./introduction/introduction.component').then((m) => m.IntroductionPageComponent),
    path: 'introduction',
  },
  {
    loadComponent: () => import('./simple-form/simple-form.component').then((m) => m.SimpleFormPageComponent),
    path: 'simpleForm',
    providers: [provideState('simpleForm', simpleFormReducer)],
  },
  {
    loadComponent: () => import('./simple-form-ngrx8/simple-form-ngrx8.component').then((m) => m.SimpleFormNgrx8PageComponent),
    path: 'simpleFormNgrx8',
    providers: [provideState('simpleFormNgrx8', simpleFormReducer)],
  },
  {
    loadComponent: () => import('./sync-validation/sync-validation.component').then((m) => m.SyncValidationPageComponent),
    path: 'syncValidation',
    providers: [provideState('syncValidation', syncValidationReducer)],
  },
  {
    loadComponent: () => import('./async-validation/async-validation.component').then((m) => m.AsyncValidationPageComponent),
    path: 'asyncValidation',
    providers: [provideEffects([AsyncValidationEffects]), provideState('asyncValidation', asyncValidationReducer)],
  },
  {
    loadComponent: () => import('./array/array.component').then((m) => m.ArrayPageComponent),
    path: 'array',
    providers: [provideState('array', arrayReducer)],
  },
  {
    loadComponent: () => import('./dynamic/dynamic.component').then((m) => m.DynamicPageComponent),
    path: 'dynamic',
    providers: [provideState('dynamic', dynamicReducer)],
  },
  {
    loadComponent: () => import('./value-boxing/value-boxing.component').then((m) => m.ValueBoxingPageComponent),
    path: 'valueBoxing',
    providers: [provideState('valueBoxing', valueBoxingReducer)],
  },
  {
    loadComponent: () => import('./value-conversion/value-conversion.component').then((m) => m.ValueConversionPageComponent),
    path: 'valueConversion',
    providers: [provideState('valueConversion', valueConversionReducer)],
  },
  {
    loadComponent: () => import('./recursive-update/recursive-update.component').then((m) => m.RecursiveUpdatePageComponent),
    path: 'recursiveUpdate',
    providers: [provideState('recursiveUpdate', recursiveUpdateReducer)],
  },
  {
    loadComponent: () => import('./material-example/material.component').then((m) => m.MaterialPageComponent),
    path: 'material',
    providers: [provideState('material', materialReducer)],
  },
  {
    loadComponent: () => import('./local-state-introduction/local-state-introduction.component').then((m) => m.LocalStateIntroductionComponent),
    path: 'localStateIntroduction',
  },
  {
    // Notice that provideState() is not included here!
    loadComponent: () => import('./local-state-advanced/local-state-advanced.component').then((m) => m.LocalStateAdvancedComponent),
    path: 'localStateAdvanced',
    providers: [provideEffects([LocalStateAdvancedEffects])],
  },
  { path: '**', redirectTo: '/introduction' },
];
