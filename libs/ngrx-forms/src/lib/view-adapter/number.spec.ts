import { Component, getDebugNode, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFormControlState, FormControlState } from '../state';
import { NgrxNumberViewAdapter } from './number';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

@Component({
  imports: [NgrxNumberViewAdapter],
  template: `
    <input type="number" [ngrxFormControlState]="state()" />
    <input type="number" [ngrxFormControlState]="state()" id="customId" />
    <input type="number" [ngrxFormControlState]="state()" [id]="boundId" />
  `,
})
export class NumberTestComponent {
  public readonly boundId = 'boundId';

  public readonly state = input<FormControlState<any>>(INITIAL_STATE);
}

describe(NgrxNumberViewAdapter.name, () => {
  let fixture: ComponentFixture<NumberTestComponent>;
  let viewAdapter: NgrxNumberViewAdapter;
  let element: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberTestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberTestComponent);
    fixture.detectChanges();
    element = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    viewAdapter = getDebugNode(element)!.injector.get<NgrxNumberViewAdapter>(NgrxNumberViewAdapter);
  });

  it('should attach the view adapter', () => expect(viewAdapter).toBeDefined());

  it("should set the input's value", () => {
    const newValue = 10;
    viewAdapter.setViewValue(newValue);
    expect(element.value).toBe(newValue.toString());
  });

  it("should set the input's value to empty string if null", () => {
    viewAdapter.setViewValue(null);
    expect(element.value).toBe('');
  });

  it('should call the registered function whenever the value changes with a change event', () => {
    const spy = vi.fn();
    viewAdapter.setOnChangeCallback(spy);
    const newValue = 100;
    element.value = newValue.toString();
    element.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith(newValue);
  });

  it('should call the registered function whenever the value changes with an input event', () => {
    const spy = vi.fn();
    viewAdapter.setOnChangeCallback(spy);
    const newValue = 100;
    element.value = newValue.toString();
    element.dispatchEvent(new Event('input'));
    expect(spy).toHaveBeenCalledWith(newValue);
  });

  it('should call the registered function with null if value is empty string', () => {
    const spy = vi.fn();
    viewAdapter.setOnChangeCallback(spy);
    element.value = '';
    element.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('should call the registered function whenever the input is blurred', () => {
    const spy = vi.fn();
    viewAdapter.setOnTouchedCallback(spy);
    element.dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalled();
  });

  it('should disable the input', () => {
    viewAdapter.setIsDisabled(true);
    expect(element.disabled).toBe(true);
  });

  it('should enable the input', () => {
    element.disabled = true;
    viewAdapter.setIsDisabled(false);
    expect(element.disabled).toBe(false);
  });

  it('should throw if state is undefined', () => {
    const fn = () => {
      fixture.componentRef.setInput('state', undefined);
      fixture.detectChanges();
    };
    expect(fn).toThrow();
  });

  it('should not throw if calling callbacks before they are registered', () => {
    expect(() => viewAdapter.onChange(undefined)).not.toThrow();
    expect(() => viewAdapter.onTouched()).not.toThrow();
  });
});
