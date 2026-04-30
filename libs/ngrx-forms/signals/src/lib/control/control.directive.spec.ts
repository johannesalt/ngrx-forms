import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createFormControlState, NgrxDefaultViewAdapter } from 'ngrx-form-state';
import { NgrxSignalFormControlDirective } from './control.directive';

const FORM_CONTROL_ID = 'test ID';
const INITIAL_FORM_CONTROL_VALUE = 'value';
const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

@Component({
  imports: [NgrxSignalFormControlDirective, NgrxDefaultViewAdapter],
  template: ` <input #el type="text" [ngrxFormControlState]="state" /> `,
})
export class TestComponent {
  public readonly state = INITIAL_STATE;
}

describe('NgrxSignalFormControlDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  let element: DebugElement;
  beforeEach(() => {
    element = fixture.debugElement.query(By.css('input'));
  });

  let directive: NgrxSignalFormControlDirective;
  beforeEach(() => {
    directive = element.injector.get<NgrxSignalFormControlDirective>(NgrxSignalFormControlDirective);
  });

  it('should attach the directive', () => {
    expect(directive).toBeDefined();
  });
});
