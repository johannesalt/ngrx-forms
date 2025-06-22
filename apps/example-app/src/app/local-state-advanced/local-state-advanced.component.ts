import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  NgrxDefaultViewAdapter,
  NgrxFallbackSelectOption,
  Actions as NgrxFormActions,
  NgrxLocalFormControlDirective,
  NgrxLocalFormDirective,
  NgrxSelectMultipleOption,
  NgrxSelectOption,
  NgrxSelectViewAdapter,
  NgrxStatusCssClassesDirective,
  SetValueAction,
} from 'ngrx-form-state';
import { Subscription } from 'rxjs';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { GetManufacturersAction, INITIAL_LOCAL_STATE, reducer } from './local-state-advanced.reducer';

@Component({
  selector: 'ngf-local-state-advanced',
  templateUrl: './local-state-advanced.component.html',
  styleUrls: ['./local-state-advanced.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormExampleComponent,
    NgrxLocalFormControlDirective,
    NgrxLocalFormDirective,
    NgrxDefaultViewAdapter,
    NgrxFallbackSelectOption,
    NgrxSelectViewAdapter,
    NgrxSelectMultipleOption,
    NgrxSelectOption,
    NgrxStatusCssClassesDirective,
  ],
})
export class LocalStateAdvancedComponent implements OnInit, OnDestroy {
  private actions = inject(Actions);

  private store = inject(Store);

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private subscription = new Subscription();

  public localState = INITIAL_LOCAL_STATE;

  ngOnInit() {
    this.subscription = this.actions.subscribe((action) => {
      const updated = this.updateState(action);
      if (updated) {
        // since OnPush is used, need to trigger detectChanges
        // when action from outside updates localState
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleFormAction(action: NgrxFormActions<any>) {
    this.updateState(action);

    // trigger loading of new manufacturers list in effect
    if (action.type === SetValueAction.TYPE && action.controlId === this.localState.formState.controls.countryCode.id) {
      this.store.dispatch(new GetManufacturersAction(action.value));
    }
  }

  private updateState(action: Action): boolean {
    const localState = reducer(this.localState, action);
    const updated = localState !== this.localState;
    this.localState = localState;

    return updated;
  }
}
