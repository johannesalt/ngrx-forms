import { Component, ElementRef, input, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkAsSubmittedAction } from '../actions';
import { createFormGroupState, FormGroupState } from '../state';
import { NgrxLocalFormDirective } from './local-state-directive';

const FORM_GROUP_ID = 'test ID';
const INITIAL_FORM_CONTROL_VALUE = {};
const INITIAL_STATE = createFormGroupState(FORM_GROUP_ID, INITIAL_FORM_CONTROL_VALUE);

@Component({
  imports: [NgrxLocalFormDirective],
  template: `
    <form (ngrxFormsAction)="formsAction($event)" [ngrxFormState]="state()">
      <button #btn type="submit">Click me</button>
    </form>
  `,
})
class TestComponent {
  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('btn');

  public readonly formsAction = vi.fn();

  public readonly state = input<FormGroupState<any>>(INITIAL_STATE);

  public submit() {
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

  it(`should dispatch a ${MarkAsSubmittedAction} to the event emitter if the form is submitted and the state is unsubmitted`, () => {
    component.submit();

    expect(component.formsAction).toHaveBeenCalledWith(new MarkAsSubmittedAction(INITIAL_STATE.id));
  });

  it(`should not dispatch a ${MarkAsSubmittedAction.name} to the event emitter if the form is submitted and the state is submitted`, () => {
    fixture.componentRef.setInput('state', { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false });
    fixture.detectChanges();

    component.submit();

    expect(component.formsAction).not.toHaveBeenCalled();
  });
});
