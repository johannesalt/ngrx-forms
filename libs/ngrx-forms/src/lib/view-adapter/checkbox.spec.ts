import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createFormControlState, FormControlState } from '../state';
import { NgrxCheckboxViewAdapter } from './checkbox';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

@Component({
  imports: [NgrxCheckboxViewAdapter],
  template: `<input #el type="checkbox" [ngrxFormControlState]="control()" />`,
})
class TestComponent {
  /**
   * The control state to bind to the underlying form control.
   */
  public readonly control = input<FormControlState<any>>(INITIAL_STATE);
}

interface TypedDebugElement<TElement> extends DebugElement {
  /**
   * The underlying DOM element at the root of the component.
   */
  get nativeElement(): TElement;
}

describe(NgrxCheckboxViewAdapter.name, () => {
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

  let element: TypedDebugElement<HTMLInputElement>;
  beforeEach(() => {
    element = fixture.debugElement.query(By.css('input'));
  });

  let viewAdapter: NgrxCheckboxViewAdapter;
  beforeEach(() => {
    viewAdapter = element.injector.get<NgrxCheckboxViewAdapter>(NgrxCheckboxViewAdapter);
  });

  it('should attach the view adapter', () => {
    expect(viewAdapter).toBeDefined();
  });

  it('should mark the input as checked', () => {
    viewAdapter.setViewValue(true);
    fixture.detectChanges();

    expect(element.nativeElement.checked).toBe(true);
  });

  it('should call the registered function whenever the checkbox is checked', () => {
    const changeOn = vi.fn();
    viewAdapter.setOnChangeCallback(changeOn);

    element.nativeElement.checked = true;
    element.triggerEventHandler('input');

    expect(changeOn).toHaveBeenCalledWith(true);
  });

  it('should call the registered function whenever the checkbox is unchecked', () => {
    element.nativeElement.checked = true;
    element.triggerEventHandler('input');

    const changeOn = vi.fn();
    viewAdapter.setOnChangeCallback(changeOn);

    element.nativeElement.checked = false;
    element.triggerEventHandler('input');

    expect(changeOn).toHaveBeenCalledWith(false);
  });

  it('should disable the input', () => {
    viewAdapter.setIsDisabled(true);
    fixture.detectChanges();

    expect(element.nativeElement.disabled).toBe(true);
  });

  it('should enable the input', () => {
    viewAdapter.setIsDisabled(true);
    fixture.detectChanges();

    expect(element.nativeElement.disabled).toBe(true);

    viewAdapter.setIsDisabled(false);
    fixture.detectChanges();

    expect(element.nativeElement.disabled).toBe(false);
  });
});
