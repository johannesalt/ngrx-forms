import { Component, getDebugNode, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFormControlState, FormControlState } from '../state';
import { NgrxSelectOption } from './option';
import { NgrxSelectViewAdapter } from './select';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

const OPTION1_VALUE = 'op1';

const BOOLEAN_OPTIONS = [true, false];
const NUMBER_OPTIONS = [1, 2];
const STRING_OPTIONS = ['op1', 'op2'];

@Component({
  imports: [NgrxSelectViewAdapter, NgrxSelectOption],
  template: `
    <select [ngrxFormControlState]="state()">
      <option value="op1">op1</option>
      <option value="op2" selected>op2</option>
    </select>

    <select [ngrxFormControlState]="state()" id="customId">
      <option value="op1">op1</option>
      <option value="op2" selected>op2</option>
    </select>

    <select [ngrxFormControlState]="state()" [id]="boundId">
      <option value="op1">op1</option>
      <option value="op2" selected>op2</option>
    </select>

    <select [ngrxFormControlState]="state()">
      @for (o of stringOptions(); track $index) {
        <option [value]="o">{{ o }}</option>
      }
    </select>

    <select [ngrxFormControlState]="state()">
      @for (o of numberOptions(); track $index) {
        <option [value]="o">{{ o }}</option>
      }
    </select>

    <select [ngrxFormControlState]="state()">
      @for (o of booleanOptions(); track $index) {
        <option [value]="o">{{ o }}</option>
      }
    </select>
  `,
})
export class SelectTestComponent {
  public readonly boundId = 'boundId';
  public readonly stringOptions = input(STRING_OPTIONS);
  public readonly numberOptions = input(NUMBER_OPTIONS);
  public readonly booleanOptions = input(BOOLEAN_OPTIONS);

  public readonly state = input<FormControlState<any>>(INITIAL_STATE);
}

describe(NgrxSelectViewAdapter.name, () => {
  let fixture: ComponentFixture<SelectTestComponent>;
  let viewAdapter: NgrxSelectViewAdapter;
  let element: HTMLSelectElement;
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTestComponent],
    }).compileComponents();
  });

  describe('static options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelector('select')!;
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
    });

    it('should attach the view adapter', () => {
      expect(viewAdapter).toBeDefined();
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(OPTION1_VALUE);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(OPTION1_VALUE);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      element.value = '0';
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(OPTION1_VALUE);
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
  });

  describe('dynamic string options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[3];
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(STRING_OPTIONS[1]);
    });

    it('should set the ID of the element to the ID of the state', () => {
      expect(element.id).toBe(TEST_ID);
    });

    it('should set the ID of the element if the ID of the state changes', () => {
      const newId = 'new ID';
      fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: newId });
      fixture.detectChanges();

      expect(element.id).toBe(newId);
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(STRING_OPTIONS[0]);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(STRING_OPTIONS[0]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      element.selectedIndex = 0;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(STRING_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 'new value';
      const newValues = [...STRING_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 'new value';
      const newValues = [...STRING_OPTIONS];
      newValues[0] = newValue;

      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 'op3';
      const newValues = [...STRING_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      element.selectedIndex = 2;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const newValues = [...STRING_OPTIONS];
      newValues.pop();

      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      const oldValue = [...STRING_OPTIONS];
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
      expect(element.selectedIndex).toEqual(-1);
    });

    it('should select the correct option when a new option is added for the current state value', () => {
      const newValue = 'new value';
      viewAdapter.setViewValue(newValue);

      const newValues = [...STRING_OPTIONS];
      newValues.push(newValue);
      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      const newOption = element.querySelectorAll('option')[2];
      expect(newOption.selected).toBe(true);
    });
  });

  describe('dynamic number options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[4];
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(NUMBER_OPTIONS[1]);
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(NUMBER_OPTIONS[0]);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(NUMBER_OPTIONS[0]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      element.selectedIndex = 0;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(NUMBER_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues[0] = newValue;

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      element.selectedIndex = 2;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const newValues = [...NUMBER_OPTIONS];
      newValues.pop();

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      const oldValue = NUMBER_OPTIONS[1];
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
      expect(element.selectedIndex).toEqual(-1);
    });

    it('should select the correct option when a new option is added for the current state value', () => {
      const newValue = 3;
      viewAdapter.setViewValue(newValue);

      const newValues = [...NUMBER_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      const newOption = element.querySelectorAll('option')[2];
      expect(newOption.selected).toBe(true);
    });
  });

  describe('dynamic boolean options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[5];
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(BOOLEAN_OPTIONS[1]);
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(BOOLEAN_OPTIONS[0]);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(BOOLEAN_OPTIONS[0]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      element.selectedIndex = 0;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(BOOLEAN_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = true;
      const newValues = [...BOOLEAN_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('booleanOptions', newValues);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = true;
      const newValues = [...BOOLEAN_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('booleanOptions', newValues);
      fixture.detectChanges();

      element.selectedIndex = 2;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const newValues = [...BOOLEAN_OPTIONS];
      newValues.pop();

      fixture.componentRef.setInput('booleanOptions', newValues);
      fixture.detectChanges();

      const oldValue = BOOLEAN_OPTIONS[1];
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
      expect(element.selectedIndex).toEqual(-1);
    });

    it('should select the correct option when a new option is added for the current state value', () => {
      const newValue = false;
      viewAdapter.setViewValue(newValue);

      fixture.componentRef.setInput('booleanOptions', [true]);
      fixture.detectChanges();

      fixture.componentRef.setInput('booleanOptions', [true, false]);
      fixture.detectChanges();

      const newOption = element.querySelectorAll('option')[1];
      expect(newOption.selected).toBe(true);
    });
  });

  it('should not throw if calling callbacks before they are registered', () => {
    const fn = (type: string) => () => element.dispatchEvent(new Event(type));
    expect(fn('change')).not.toThrow();
    expect(fn('blur')).not.toThrow();
  });
});
