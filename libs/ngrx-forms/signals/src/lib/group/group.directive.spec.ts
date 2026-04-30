import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createFormGroupState, FormGroupState } from 'ngrx-form-state';
import { NgrxSignalFormDirective } from './group.directive';

const FORM_GROUP_ID = 'test ID';
const INITIAL_FORM_CONTROL_VALUE = {};
const INITIAL_STATE = createFormGroupState(FORM_GROUP_ID, INITIAL_FORM_CONTROL_VALUE);

@Component({
  imports: [NgrxSignalFormDirective],
  template: ` <form [ngrxFormState]="state()"></form> `,
})
class TestComponent {
  public readonly state = input<FormGroupState<any>>(INITIAL_STATE);
}

describe('NgrxSignalFormDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  let element: DebugElement;
  beforeEach(() => {
    element = fixture.debugElement.query(By.css('form'));
  });

  let directive: NgrxSignalFormDirective;
  beforeEach(() => {
    directive = element.injector.get<NgrxSignalFormDirective>(NgrxSignalFormDirective);
  });

  it('should attach the directive', () => {
    expect(directive).toBeDefined();
  });
});
