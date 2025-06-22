import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockInstance } from 'vitest';
import { MarkAsSubmittedAction } from '../actions';
import { createFormGroupState, FormGroupState } from '../state';
import { NgrxLocalFormDirective } from './local-state-directive';

const FORM_GROUP_ID = 'test ID';
const INITIAL_FORM_CONTROL_VALUE = {};
const INITIAL_STATE = createFormGroupState(FORM_GROUP_ID, INITIAL_FORM_CONTROL_VALUE);

@Component({
  imports: [NgrxLocalFormDirective],
  template: `
    <form (ngrxFormsAction)="formsAction($event)" [ngrxFormState]="state">
      <button #btn type="submit">Click me</button>
    </form>
  `,
})
export class TestComponent {
  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('btn');

  public readonly formsAction = vi.fn();

  public state: Partial<FormGroupState<any>> | null | undefined = INITIAL_STATE;

  public submitForm() {
    const button = this.button();
    if (!button || !button.nativeElement) {
      throw 'Button cannot be null';
    }

    button.nativeElement.click();
  }
}

describe(NgrxLocalFormDirective, () => {
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

  describe('local action emit', () => {
    it(`should not dispatch a ${MarkAsSubmittedAction} to the global store if the form is submitted and the state is unsubmitted`, () => {
      component.submitForm();

      expect(dispatch).not.toHaveBeenCalled();
    });

    it(`should dispatch a ${MarkAsSubmittedAction} to the event emitter if the form is submitted and the state is unsubmitted`, () => {
      component.submitForm();

      expect(component.formsAction).toHaveBeenCalledWith(new MarkAsSubmittedAction(INITIAL_STATE.id));
    });

    it(`should not dispatch a ${MarkAsSubmittedAction.name} to the global store if the form is submitted and the state is submitted`, () => {
      component.state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      fixture.detectChanges();

      component.submitForm();

      expect(dispatch).not.toHaveBeenCalled();
    });

    it(`should not dispatch a ${MarkAsSubmittedAction.name} to the event emitter if the form is submitted and the state is submitted`, () => {
      component.state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      fixture.detectChanges();

      component.submitForm();

      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
