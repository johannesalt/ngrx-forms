import { NgModule } from '@angular/core';
import { NgrxFormControlDirective } from './control/directive';
import { NgrxLocalFormControlDirective } from './control/local-state-directive';
import { NgrxFormDirective } from './group/directive';
import { NgrxLocalFormDirective } from './group/local-state-directive';
import { NgrxStatusCssClassesDirective } from './status-css-classes.directive';
import { NgrxCheckboxViewAdapter } from './view-adapter/checkbox';
import { NgrxDefaultViewAdapter } from './view-adapter/default';
import { NgrxNumberViewAdapter } from './view-adapter/number';
import { NgrxSelectOption } from './view-adapter/option';
import { NgrxRadioViewAdapter } from './view-adapter/radio';
import { NgrxRangeViewAdapter } from './view-adapter/range';
import { NgrxSelectViewAdapter } from './view-adapter/select';
import { NgrxSelectMultipleViewAdapter } from './view-adapter/select-multiple';

const importsAndExports = [
  NgrxFormControlDirective,
  NgrxLocalFormControlDirective,
  NgrxFormDirective,
  NgrxLocalFormDirective,
  NgrxCheckboxViewAdapter,
  NgrxDefaultViewAdapter,
  NgrxNumberViewAdapter,
  NgrxRadioViewAdapter,
  NgrxRangeViewAdapter,
  NgrxSelectMultipleViewAdapter,
  NgrxSelectOption,
  NgrxSelectViewAdapter,
  NgrxStatusCssClassesDirective,
];

@NgModule({
  imports: [...importsAndExports],
  exports: importsAndExports,
})
export class NgrxFormsModule {}
