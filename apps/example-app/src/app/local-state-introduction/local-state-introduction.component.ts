import { Component } from '@angular/core';
import {
  Actions,
  NgrxDefaultViewAdapter,
  NgrxLocalFormControlDirective,
  NgrxLocalFormDirective,
  NgrxStatusCssClassesDirective,
} from '@johannes-it-solution/ngrx-forms';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { INITIAL_FORM_STATE, reducer } from './local-state-introduction.reducer';

@Component({
  selector: 'ngf-local-state-introduction',
  templateUrl: './local-state-introduction.component.html',
  styleUrls: ['./local-state-introduction.component.scss'],
  imports: [FormExampleComponent, NgrxDefaultViewAdapter, NgrxLocalFormDirective, NgrxLocalFormControlDirective, NgrxStatusCssClassesDirective],
})
export class LocalStateIntroductionComponent {
  formState = INITIAL_FORM_STATE;

  handleFormAction(action: Actions<any>) {
    this.formState = reducer(this.formState, action);
  }
}
