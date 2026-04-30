import { Component, ElementRef, input, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormActionDispatcher, NGRX_FORM_ACTION_DISPATCHER } from '../dispatcher';
import { createFormGroupState, FormGroupState } from '../state';
import { NgrxFormDirective } from './directive';

const FORM_GROUP_ID = 'test ID';
const INITIAL_FORM_CONTROL_VALUE = {};
const INITIAL_STATE = createFormGroupState(FORM_GROUP_ID, INITIAL_FORM_CONTROL_VALUE);

@Component({
  imports: [NgrxFormDirective],
  template: `
    <form [ngrxFormState]="state()">
      <button #btn type="submit">Click me</button>
    </form>
  `,
})
export class TestComponent {
  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('btn');

  public readonly state = input<FormGroupState<any>>(INITIAL_STATE);

  public submit() {
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

  let dispatcher: FormActionDispatcher;
  beforeEach(() => {
    dispatcher = {
      addArrayControl: vi.fn(),
      addGroupControl: vi.fn(),
      clearAsyncError: vi.fn(),
      disable: vi.fn(),
      enable: vi.fn(),
      focus: vi.fn(),
      markAsDirty: vi.fn(),
      markAsPristine: vi.fn(),
      markAsSubmitted: vi.fn(),
      markAsTouched: vi.fn(),
      markAsUnsubmitted: vi.fn(),
      markAsUntouched: vi.fn(),
      moveArrayControl: vi.fn(),
      removeArrayControl: vi.fn(),
      removeGroupControl: vi.fn(),
      reset: vi.fn(),
      setAsyncError: vi.fn(),
      setErrors: vi.fn(),
      setUserDefinedProperty: vi.fn(),
      setValue: vi.fn(),
      startAsyncValidation: vi.fn(),
      swapArrayControl: vi.fn(),
      unfocus: vi.fn(),
    };
  });

  beforeEach(() => {
    TestBed.overrideDirective(NgrxFormDirective, {
      set: {
        providers: [{ provide: NGRX_FORM_ACTION_DISPATCHER, useValue: dispatcher }],
      },
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should call a markAsSubmitted if the form is submitted and the state is unsubmitted`, () => {
    component.submit();

    expect(dispatcher.markAsSubmitted).toHaveBeenCalledWith(INITIAL_STATE.id);
  });

  it(`should not call a markAsSubmitted if the form is submitted and the state is submitted`, () => {
    fixture.componentRef.setInput('state', { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false });
    fixture.detectChanges();

    component.submit();

    expect(dispatcher.markAsSubmitted).not.toHaveBeenCalledWith(INITIAL_STATE.id);
  });
});
