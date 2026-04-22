import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createFormControlState, FormControlState } from '../state';
import { NgrxNumberViewAdapter } from './number';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

@Component({
  imports: [NgrxNumberViewAdapter],
  template: `<input #el type="number" [ngrxFormControlState]="control()" />`,
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

describe(NgrxNumberViewAdapter.name, () => {
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

  let viewAdapter: NgrxNumberViewAdapter;
  beforeEach(() => {
    viewAdapter = element.injector.get<NgrxNumberViewAdapter>(NgrxNumberViewAdapter);
  });

  it('should attach the view adapter', () => {
    expect(viewAdapter).toBeDefined();
  });

  it("should set the input's value", () => {
    viewAdapter.setViewValue(10);
    fixture.detectChanges();

    expect(element.nativeElement.value).toBe('10');
  });

  it("should set the input's value to empty string if null", () => {
    viewAdapter.setViewValue(null);
    fixture.detectChanges();

    expect(element.nativeElement.value).toBe('');
  });

  it('should call the registered function whenever the value changes with a change event', () => {
    const onChange = vi.fn();
    viewAdapter.setOnChangeCallback(onChange);

    element.nativeElement.value = '100';
    element.triggerEventHandler('change');

    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('should call the registered function whenever the value changes with an input event', () => {
    const onChange = vi.fn();
    viewAdapter.setOnChangeCallback(onChange);

    element.nativeElement.value = '100';
    element.triggerEventHandler('input');

    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('should call the registered function with null if value is empty string', () => {
    const onChange = vi.fn();
    viewAdapter.setOnChangeCallback(onChange);

    element.nativeElement.value = '';
    element.triggerEventHandler('change');

    expect(onChange).toHaveBeenCalledWith(null);
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
