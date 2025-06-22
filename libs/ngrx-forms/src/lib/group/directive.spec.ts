import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockInstance } from 'vitest';
import { MarkAsSubmittedAction } from '../actions';
import { createFormGroupState, FormGroupState } from '../state';
import { NgrxFormDirective } from './directive';

const FORM_GROUP_ID = 'test ID';
const INITIAL_FORM_CONTROL_VALUE = {};
const INITIAL_STATE = createFormGroupState(FORM_GROUP_ID, INITIAL_FORM_CONTROL_VALUE);

@Component({
  imports: [NgrxFormDirective],
  template: `
    <form [ngrxFormState]="state">
      <button #btn type="submit">Click me</button>
    </form>
  `,
})
export class TestComponent {
  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('btn');

  public state: Partial<FormGroupState<any>> | null | undefined = INITIAL_STATE;

  public submitForm() {
    const button = this.button();
    if (!button || !button.nativeElement) {
      throw 'Button cannot be null';
    }

    button.nativeElement.click();
  }
}

describe(NgrxFormDirective, () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let dispatch: MockInstance<(action: Action) => void>;
  beforeEach(() => {
    const store = TestBed.inject(Store);
    dispatch = vi.spyOn(store, 'dispatch');
  });

  it(`should dispatch a ${MarkAsSubmittedAction} if the form is submitted and the state is unsubmitted`, () => {
    component.submitForm();

    expect(dispatch).toHaveBeenCalledWith(new MarkAsSubmittedAction(INITIAL_STATE.id));
  });

  it(`should not dispatch a ${MarkAsSubmittedAction} if the form is submitted and the state is submitted`, () => {
    component.state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
    fixture.detectChanges();

    component.submitForm();

    expect(dispatch).not.toHaveBeenCalledWith(new MarkAsSubmittedAction(INITIAL_STATE.id));
  });
});
