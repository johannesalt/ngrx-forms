import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockInstance } from 'vitest';
import { MarkAsDirtyAction, SetValueAction } from '../../actions';
import { NgrxFormsModule } from '../../module';
import { createFormControlState, FormControlState } from '../../state';

const RADIO_OPTIONS = ['op1', 'op2'] as readonly string[];

@Component({
  imports: [NgrxFormsModule],
  template: `
    @if (state) { @for (o of options; track $index) {
    <input type="radio" [value]="o" [ngrxFormControlState]="state" />
    } }
  `,
})
export class RadioTestComponent {
  state: FormControlState<string> | undefined;
  options = RADIO_OPTIONS;
}

describe(RadioTestComponent.name, () => {
  let component: RadioTestComponent;
  let fixture: ComponentFixture<RadioTestComponent>;
  let element1: HTMLInputElement;
  let element2: HTMLInputElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = RADIO_OPTIONS[1];
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RadioTestComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioTestComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    fixture.detectChanges();
    element1 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[0];
    element2 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[1];
  });

  let dispatch: MockInstance<(action: Action) => void>;
  beforeEach(() => {
    const store = TestBed.inject(Store);
    dispatch = vi.spyOn(store, 'dispatch');
  });

  it('should set the name of all elements to the ID of the state', () => {
    expect(element1.name).toBe(INITIAL_STATE.id);
    expect(element2.name).toBe(INITIAL_STATE.id);
  });

  it("should update the name of the elements if the state's ID changes", () => {
    const newId = 'new ID';
    component.state = { ...INITIAL_STATE, id: newId };
    fixture.detectChanges();
    expect(element1.name).toBe(newId);
    expect(element2.name).toBe(newId);
  });

  it('should not set the id of any element', () => {
    expect(element1.id).not.toBe(INITIAL_STATE.id);
    expect(element2.id).not.toBe(INITIAL_STATE.id);
  });

  it('should select the correct option initially', () => {
    expect(element2.checked).toBe(true);
  });

  it(`should trigger a ${SetValueAction.name} with the selected value when an option is selected`, () => {
    element1.click();

    expect(dispatch).toHaveBeenCalledWith(new SetValueAction(INITIAL_STATE.id, RADIO_OPTIONS[0]));
  });

  it(`should trigger a ${MarkAsDirtyAction.name} when an option is selected`, () => {
    element1.click();

    expect(dispatch).toHaveBeenCalledWith(new MarkAsDirtyAction(INITIAL_STATE.id));
  });

  it(`should trigger ${SetValueAction.name}s and ${MarkAsDirtyAction.name}s when switching between options`, () => {
    element1.click();

    expect(dispatch).toHaveBeenCalledWith(new SetValueAction(INITIAL_STATE.id, RADIO_OPTIONS[0]));
    expect(dispatch).toHaveBeenCalledWith(new MarkAsDirtyAction(INITIAL_STATE.id));

    component.state = { ...INITIAL_STATE, value: RADIO_OPTIONS[0] };
    fixture.detectChanges();

    element2.click();

    expect(dispatch).toHaveBeenCalledWith(new SetValueAction(INITIAL_STATE.id, RADIO_OPTIONS[1]));
    expect(dispatch).toHaveBeenCalledWith(new MarkAsDirtyAction(INITIAL_STATE.id));
  });

  it(`should trigger a ${SetValueAction.name} if the value of the selected option changes`, () => {
    const newValue = 'new value';

    component.options = [RADIO_OPTIONS[0], newValue];
    fixture.detectChanges();

    expect(dispatch).toHaveBeenCalledWith(new SetValueAction(INITIAL_STATE.id, newValue));
  });

  it('should deselect other options when option is selected', () => {
    element1.click();
    expect(element2.checked).toBe(false);
  });
});
