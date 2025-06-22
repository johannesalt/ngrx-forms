import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockInstance } from 'vitest';
import { MarkAsDirtyAction } from '../../actions';
import { NgrxFormsModule } from '../../module';
import { createFormControlState, FormControlState } from '../../state';

const SELECT_NUMBER_OPTIONS = [1, 2];

@Component({
  imports: [NgrxFormsModule],
  template: ` @if (state) {
    <select [ngrxFormControlState]="state" (ngrxFormsAction)="handleAction($event)">
      @for (o of options; track o) {
      <option [value]="o">{{ o }}</option>
      }
    </select>
    }`,
})
export class NumberSelectComponentLocalStateComponent {
  state: FormControlState<number> | undefined;
  options = SELECT_NUMBER_OPTIONS;

  action: Action | null = null;
  handleAction(actionParam: Action) {
    this.action = actionParam;
  }
}

describe(NumberSelectComponentLocalStateComponent.name, () => {
  let component: NumberSelectComponentLocalStateComponent;
  let fixture: ComponentFixture<NumberSelectComponentLocalStateComponent>;
  let element: HTMLSelectElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = SELECT_NUMBER_OPTIONS[1];
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NumberSelectComponentLocalStateComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberSelectComponentLocalStateComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select')!;
  });

  let dispatch: MockInstance<(action: Action) => void>;
  beforeEach(() => {
    const store = TestBed.inject(Store);
    dispatch = vi.spyOn(store, 'dispatch');
  });

  it(`should not trigger a ${MarkAsDirtyAction.name} to the global store when an option is selected`, () => {
    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it(`should trigger a ${MarkAsDirtyAction.name} to the event emitter when an option is selected`, () => {
    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));

    expect(component.action).toBeTruthy();
    expect(component.action!.type).toBe(MarkAsDirtyAction.TYPE);
  });
});
