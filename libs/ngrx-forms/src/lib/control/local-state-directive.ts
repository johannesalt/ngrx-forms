import { Directive, ElementRef, Inject, Optional, output, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Actions } from '../actions';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from '../view-adapter/view-adapter';
import { NgrxFormControlDirective, NgrxFormControlValueType } from './directive';

@Directive({
  selector: '[ngrxFormControlState][ngrxFormsAction]',
})
export class NgrxLocalFormControlDirective<TStateValue, TViewValue = TStateValue> extends NgrxFormControlDirective<TStateValue, TViewValue> {
  public readonly ngrxFormsAction = output<Actions<NgrxFormControlValueType<TStateValue>>>();

  constructor(
    el: ElementRef,
    @Self() @Optional() @Inject(NGRX_FORM_VIEW_ADAPTER) viewAdapters: FormViewAdapter[],
    @Self() @Optional() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[]
  ) {
    super(el, null, viewAdapters, valueAccessors);
  }

  protected override dispatchAction(action: Actions<NgrxFormControlValueType<TStateValue>>) {
    this.ngrxFormsAction.emit(action);
  }
}
