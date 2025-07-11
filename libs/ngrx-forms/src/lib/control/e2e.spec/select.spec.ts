import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockInstance } from 'vitest';
import { MarkAsDirtyAction, SetValueAction } from '../../actions';
import { NgrxFormsModule } from '../../module';
import { createFormControlState, FormControlState } from '../../state';

const SELECT_OPTIONS = ['op1', 'op2'];

@Component({
  imports: [NgrxFormsModule],
  template: `
    @if (state) {
    <select [ngrxFormControlState]="state">
      @for (o of options; track o) {
      <option [value]="o">{{ o }}</option>
      }
    </select>
    }
  `,
})
export class SelectComponent {
  state: FormControlState<string> | undefined;
  options = SELECT_OPTIONS;
}

@Component({
  imports: [NgrxFormsModule],
  template: '<select>@for (o of options; track o) {<option [value]="o">{{ o }} Label</option>}</select>',
})
export class SelectFallbackComponent {
  options = SELECT_OPTIONS;
}

describe(SelectComponent.name, () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let element: HTMLSelectElement;
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = SELECT_OPTIONS[1];
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SelectComponent, SelectFallbackComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select')!;
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

  it(`should trigger a ${SetValueAction.name} with the selected value when an option is selected`, () => {
    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));

    expect(dispatch).toHaveBeenCalledWith(new SetValueAction(FORM_CONTROL_ID, SELECT_OPTIONS[0]));
  });

  it(`should trigger a ${MarkAsDirtyAction.name} when an option is selected`, () => {
    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));

    expect(dispatch).toHaveBeenCalledWith(new MarkAsDirtyAction(FORM_CONTROL_ID));
  });

  it('should set the value attribute for options without associated form state', () => {
    const fallbackFixture = TestBed.createComponent(SelectFallbackComponent);
    fallbackFixture.detectChanges();
    const nativeElement = fallbackFixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select')!;
    option1 = nativeElement.querySelectorAll('option')[0];
    option2 = nativeElement.querySelectorAll('option')[1];
    expect(option1.value).toBe(SELECT_OPTIONS[0]);
    expect(option2.value).toBe(SELECT_OPTIONS[1]);
  });
});

const SELECT_NUMBER_OPTIONS = [1, 2];

@Component({
  imports: [NgrxFormsModule],
  template: `
    @if (state) {
    <select [ngrxFormControlState]="state">
      @for (o of options; track o) {
      <option [value]="o">{{ o }}</option>
      }
    </select>
    }
  `,
})
export class NumberSelectComponent {
  state: FormControlState<number> | undefined;
  options = SELECT_NUMBER_OPTIONS;
}

describe(NumberSelectComponent.name, () => {
  let component: NumberSelectComponent;
  let fixture: ComponentFixture<NumberSelectComponent>;
  let element: HTMLSelectElement;
  let option2: HTMLOptionElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = SELECT_NUMBER_OPTIONS[1];
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NumberSelectComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberSelectComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select')!;
    option2 = element.querySelectorAll('option')[1];
  });

  let dispatch: MockInstance<(action: Action) => void>;
  beforeEach(() => {
    const store = TestBed.inject(Store);
    dispatch = vi.spyOn(store, 'dispatch');
  });

  it('should select the correct option initially', () => {
    expect(option2.selected).toBe(true);
  });

  it(`should trigger a ${SetValueAction.name} with the selected value when an option is selected`, () => {
    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));

    expect(dispatch).toHaveBeenCalledWith(new SetValueAction(FORM_CONTROL_ID, SELECT_NUMBER_OPTIONS[0]));
  });

  it(`should trigger a ${MarkAsDirtyAction.name} when an option is selected`, () => {
    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));

    expect(dispatch).toHaveBeenCalledWith(new MarkAsDirtyAction(FORM_CONTROL_ID));
  });
});
