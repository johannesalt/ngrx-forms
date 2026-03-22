import { Component, getDebugNode, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFormControlState, FormControlState } from '../state';
import { NgrxRadioViewAdapter } from './radio';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

const OPTION1_VALUE = 'op1';
const OPTION2_VALUE = 'op2';

const BOOLEAN_OPTIONS = [true, false];
const NUMBER_OPTIONS = [1, 2];
const STRING_OPTIONS = ['op1', 'op2'];

@Component({
  imports: [NgrxRadioViewAdapter],
  template: `
    <input type="radio" value="op1" [ngrxFormControlState]="state()" />
    <input type="radio" value="op2" checked="checked" [ngrxFormControlState]="state()" />

    <input type="radio" value="op1" [ngrxFormControlState]="state()" name="customName" />
    <input type="radio" value="op1" [ngrxFormControlState]="state()" [name]="boundName" />

    @for (o of stringOptions(); track $index) {
    <input type="radio" [value]="o" [ngrxFormControlState]="state()" />
    } @for (o of numberOptions(); track $index) {
    <input type="radio" [value]="o" [ngrxFormControlState]="state()" />
    } @for (o of booleanOptions(); track $index) {
    <input type="radio" [value]="o" [ngrxFormControlState]="state()" />
    }
  `,
})
export class RadioTestComponent {
  public readonly boundName = 'boundName';
  public readonly stringOptions = input(STRING_OPTIONS);
  public readonly numberOptions = input(NUMBER_OPTIONS);
  public readonly booleanOptions = input(BOOLEAN_OPTIONS);

  public readonly state = input<FormControlState<any>>(INITIAL_STATE);
}

describe(NgrxRadioViewAdapter.name, () => {
  let fixture: ComponentFixture<RadioTestComponent>;
  let viewAdapter1: NgrxRadioViewAdapter;
  let viewAdapter2: NgrxRadioViewAdapter;
  let element1: HTMLInputElement;
  let element2: HTMLInputElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RadioTestComponent],
    }).compileComponents();
  });

  describe('static options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RadioTestComponent);
      fixture.detectChanges();
      element1 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[0];
      element2 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[1];
      viewAdapter1 = getDebugNode(element1)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter2 = getDebugNode(element2)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
    });

    it('should attach the view adapter', () => expect(viewAdapter1).toBeDefined());

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(OPTION1_VALUE);
      expect(element1.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      element1.checked = true;
      viewAdapter1.setViewValue(OPTION2_VALUE);
      expect(element1.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      element1.checked = true;
      element1.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(OPTION1_VALUE);
    });

    it('should call the registered function whenever the input is blurred', () => {
      const spy = vi.fn();
      viewAdapter1.setOnTouchedCallback(spy);
      element1.dispatchEvent(new Event('blur'));
      expect(spy).toHaveBeenCalled();
    });

    it('should disable the input', () => {
      viewAdapter1.setIsDisabled(true);
      expect(element1.disabled).toBe(true);
    });

    it('should enable the input', () => {
      element1.disabled = true;
      viewAdapter1.setIsDisabled(false);
      expect(element1.disabled).toBe(false);
    });

    it('should throw if state is undefined', () => {
      const fn = () => {
        fixture.componentRef.setInput('state', undefined);
        fixture.detectChanges();
      };
      expect(fn).toThrow();
    });

    it('should not throw if calling callbacks before they are registered', () => {
      expect(() => viewAdapter1.onChange()).not.toThrow();
      expect(() => viewAdapter1.onTouched()).not.toThrow();
    });
  });

  describe('dynamic string options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RadioTestComponent);
      fixture.detectChanges();
      element1 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[4];
      element2 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[5];
      viewAdapter1 = getDebugNode(element1)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter2 = getDebugNode(element2)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter1.setViewValue(STRING_OPTIONS[1]);
      viewAdapter2.setViewValue(STRING_OPTIONS[1]);
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(STRING_OPTIONS[0]);
      viewAdapter2.setViewValue(STRING_OPTIONS[0]);
      expect(element1.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      element1.checked = true;
      viewAdapter1.setViewValue(STRING_OPTIONS[1]);
      viewAdapter2.setViewValue(STRING_OPTIONS[1]);
      expect(element1.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      element1.checked = true;
      element1.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(STRING_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);

      const newValue = 'new value';
      const newValues = [...STRING_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);

      const newValue = 'new value';
      const newValues = [...STRING_OPTIONS];
      newValues[0] = newValue;

      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);

      const newValue = 'op3';
      const newValues = [...STRING_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      const newElement = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[6];
      const newViewAdapter = getDebugNode(newElement)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      newViewAdapter.setOnChangeCallback(spy);
      newElement.checked = true;
      newElement.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });
  });

  describe('dynamic number options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RadioTestComponent);
      fixture.detectChanges();
      element1 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[6];
      element2 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[7];
      viewAdapter1 = getDebugNode(element1)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter2 = getDebugNode(element2)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter1.setViewValue(NUMBER_OPTIONS[1]);
      viewAdapter2.setViewValue(NUMBER_OPTIONS[1]);
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(NUMBER_OPTIONS[0]);
      viewAdapter2.setViewValue(NUMBER_OPTIONS[0]);
      expect(element1.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      element1.checked = true;
      viewAdapter1.setViewValue(NUMBER_OPTIONS[1]);
      viewAdapter2.setViewValue(NUMBER_OPTIONS[1]);
      expect(element1.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      element1.checked = true;
      element1.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(NUMBER_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues[0] = newValue;

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      const newElement = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[8];
      const newViewAdapter = getDebugNode(newElement)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      newViewAdapter.setOnChangeCallback(spy);
      newElement.checked = true;
      newElement.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });
  });

  describe('dynamic boolean options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RadioTestComponent);
      fixture.detectChanges();
      element1 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[8];
      element2 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[9];
      viewAdapter1 = getDebugNode(element1)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter2 = getDebugNode(element2)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter1.setViewValue(BOOLEAN_OPTIONS[1]);
      viewAdapter2.setViewValue(BOOLEAN_OPTIONS[1]);
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(BOOLEAN_OPTIONS[0]);
      viewAdapter2.setViewValue(BOOLEAN_OPTIONS[0]);
      expect(element1.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      element1.checked = true;
      viewAdapter1.setViewValue(BOOLEAN_OPTIONS[1]);
      viewAdapter2.setViewValue(BOOLEAN_OPTIONS[1]);
      expect(element1.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      element1.checked = true;
      element1.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(BOOLEAN_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);

      const newValue = true;
      const newValues = [...BOOLEAN_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('booleanOptions', newValues);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);

      const newValue = true;
      const newValues = [...BOOLEAN_OPTIONS];
      newValues[0] = newValue;

      fixture.componentRef.setInput('booleanOptions', newValues);
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);

      const newValue = true;
      const newValues = [...BOOLEAN_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('booleanOptions', newValues);
      fixture.detectChanges();

      const newElement = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[10];
      const newViewAdapter = getDebugNode(newElement)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      newViewAdapter.setOnChangeCallback(spy);
      newElement.checked = true;
      newElement.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });
  });
});
