import { Component, getDebugNode, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFormControlState, FormControlState } from '../state';
import { NgrxCheckboxViewAdapter } from './checkbox';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

@Component({
  imports: [NgrxCheckboxViewAdapter],
  template: `
    <input type="checkbox" [ngrxFormControlState]="state()" />
    <input type="checkbox" [ngrxFormControlState]="state()" id="customId" />
    <input type="checkbox" [ngrxFormControlState]="state()" [id]="boundId" />
  `,
})
export class CheckboxTestComponent {
  public readonly boundId = 'boundId';

  public readonly state = input<FormControlState<any>>(INITIAL_STATE);
}

describe(NgrxCheckboxViewAdapter.name, () => {
  let fixture: ComponentFixture<CheckboxTestComponent>;
  let viewAdapter: NgrxCheckboxViewAdapter;
  let element: HTMLInputElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CheckboxTestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxTestComponent);
    fixture.detectChanges();
    element = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    viewAdapter = getDebugNode(element)!.injector.get<NgrxCheckboxViewAdapter>(NgrxCheckboxViewAdapter);
  });

  it('should attach the view adapter', () => expect(viewAdapter).toBeDefined());

  it('should mark the input as checked', () => {
    const newValue = true;
    viewAdapter.setViewValue(newValue);
    expect(element.checked).toBe(newValue);
  });

  it('should call the registered function whenever the checkbox is checked', () => {
    const spy = vi.fn();
    viewAdapter.setOnChangeCallback(spy);
    element.checked = true;
    element.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should call the registered function whenever the checkbox is unchecked', () => {
    element.checked = true;
    element.dispatchEvent(new Event('change'));
    const spy = vi.fn();
    viewAdapter.setOnChangeCallback(spy);
    element.checked = false;
    element.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith(false);
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
