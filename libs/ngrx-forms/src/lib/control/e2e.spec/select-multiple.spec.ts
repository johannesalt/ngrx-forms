import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockInstance } from 'vitest';
import { MarkAsDirtyAction, SetValueAction } from '../../actions';
import { box, Boxed } from '../../boxing';
import { NgrxValueConverters } from '../../control/value-converter';
import { NgrxFormsModule } from '../../module';
import { createFormControlState, FormControlState } from '../../state';

const SELECT_OPTIONS = ['op1', 'op2'];

@Component({
  imports: [NgrxFormsModule],
  template: `
    @if (state) {
    <select multiple [ngrxFormControlState]="state" [ngrxValueConverter]="valueConverter">
      @for (o of options; track o) {
      <option [value]="o">{{ o }}</option>
      }
    </select>
    }
  `,
})
export class SelectMultipleComponent {
  state: FormControlState<string> | undefined;
  options = SELECT_OPTIONS;
  valueConverter = NgrxValueConverters.objectToJSON;
}

describe(SelectMultipleComponent.name, () => {
  let component: SelectMultipleComponent;
  let fixture: ComponentFixture<SelectMultipleComponent>;
  let element: HTMLSelectElement;
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = `["${SELECT_OPTIONS[1]}"]`;
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SelectMultipleComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMultipleComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select')!;
    option1 = nativeElement.querySelectorAll('option')[0];
    option2 = nativeElement.querySelectorAll('option')[1];
  });

  let dispatch: MockInstance<(action: Action) => void>;
  beforeEach(() => {
    const store = TestBed.inject(Store);
    dispatch = vi.spyOn(store, 'dispatch');
  });

  it('should select the correct option initially', () => {
    expect(option2.selected).toBe(true);
  });

  it('should trigger a SetValueAction with the selected value when an option is selected', () => {
    option1.selected = true;
    element.dispatchEvent(new Event('change'));

    expect(dispatch).toHaveBeenCalledWith(new SetValueAction(FORM_CONTROL_ID, JSON.stringify(SELECT_OPTIONS)));
  });

  it(`should trigger a ${MarkAsDirtyAction.name} when an option is selected`, () => {
    option1.selected = true;
    element.dispatchEvent(new Event('change'));

    expect(dispatch).toHaveBeenCalledWith(new MarkAsDirtyAction(FORM_CONTROL_ID));
  });
});

@Component({
  imports: [NgrxFormsModule],
  template: `
    @if (state) {
    <select multiple [ngrxFormControlState]="state">
      @for (o of options; track o) {
      <option [value]="o">{{ o }}</option>
      }
    </select>
    }
  `,
})
export class SelectMultipleWithoutConverterComponent {
  state: FormControlState<Boxed<string[]>> | undefined;
  options = SELECT_OPTIONS;
}

describe(SelectMultipleWithoutConverterComponent.name, () => {
  let component: SelectMultipleWithoutConverterComponent;
  let fixture: ComponentFixture<SelectMultipleWithoutConverterComponent>;
  let element: HTMLSelectElement;
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = box([SELECT_OPTIONS[1]]);
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SelectMultipleWithoutConverterComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMultipleWithoutConverterComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select')!;
    option1 = nativeElement.querySelectorAll('option')[0];
    option2 = nativeElement.querySelectorAll('option')[1];
  });

  let dispatch: MockInstance<(action: Action) => void>;
  beforeEach(() => {
    const store = TestBed.inject(Store);
    dispatch = vi.spyOn(store, 'dispatch');
  });

  it('should select the correct option initially', () => {
    expect(option2.selected).toBe(true);
  });

  it('should trigger a SetValueAction with the selected value when an option is selected', () => {
    option1.selected = true;
    element.dispatchEvent(new Event('change'));

    expect(dispatch).toHaveBeenCalledWith(new SetValueAction(FORM_CONTROL_ID, box(SELECT_OPTIONS)));
  });

  it(`should trigger a ${MarkAsDirtyAction.name} when an option is selected`, () => {
    option1.selected = true;
    element.dispatchEvent(new Event('change'));

    expect(dispatch).toHaveBeenCalledWith(new MarkAsDirtyAction(FORM_CONTROL_ID));
  });
});
