import { Component, getDebugNode, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFormControlState, FormControlState } from '../state';
import { NgrxSelectOption } from './option';
import { NgrxSelectMultipleViewAdapter } from './select-multiple';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

const OPTION1_VALUE = 'op1';
const OPTION2_VALUE = 'op2';
const OPTION3_VALUE = 'op3';

const BOOLEAN_OPTIONS = [true, false];
const NUMBER_OPTIONS = [1, 2, 3];
const STRING_OPTIONS = [OPTION1_VALUE, OPTION2_VALUE, OPTION3_VALUE];

@Component({
  imports: [NgrxSelectMultipleViewAdapter, NgrxSelectOption],
  template: `
    <select multiple [ngrxFormControlState]="state()">
      <option value="op1">op1</option>
      <option value="op2" selected>op2</option>
      <option value="op3" selected>op2</option>
    </select>

    <select multiple [ngrxFormControlState]="state()" id="customId">
      <option value="op1">op1</option>
      <option value="op2" selected>op2</option>
      <option value="op3" selected>op2</option>
    </select>

    <select multiple [ngrxFormControlState]="state()" [id]="boundId">
      <option value="op1">op1</option>
      <option value="op2" selected>op2</option>
      <option value="op3" selected>op2</option>
    </select>

    <select multiple [ngrxFormControlState]="state()">
      @for (o of stringOptions(); track $index) {
        <option [value]="o">{{ o }}</option>
      }
    </select>

    <select multiple [ngrxFormControlState]="state()">
      @for (o of numberOptions(); track $index) {
        <option [value]="o">{{ o }}</option>
      }
    </select>

    <select multiple [ngrxFormControlState]="state()">
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

describe(NgrxSelectMultipleViewAdapter.name, () => {
  let fixture: ComponentFixture<SelectTestComponent>;
  let viewAdapter: NgrxSelectMultipleViewAdapter;
  let element: HTMLSelectElement;
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [SelectTestComponent],
    }).compileComponents();
  });

  describe('static options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelector('select')!;
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      fixture.detectChanges();
    });

    it('should attach the view adapter', () => expect(viewAdapter).toBeDefined());

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([OPTION1_VALUE]);
      expect(option1.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([OPTION1_VALUE, OPTION2_VALUE]);
      expect(option1.selected).toBe(true);
      expect(option2.selected).toBe(true);
    });

    it('should mark options as unselected if different value is written', () => {
      viewAdapter.setViewValue([OPTION1_VALUE, OPTION3_VALUE]);
      expect(option2.selected).toBe(false);
    });

    it('should mark options as unselected if null is written', () => {
      viewAdapter.setViewValue(null);
      expect(option1.selected).toBe(false);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      option1.selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([OPTION1_VALUE, OPTION2_VALUE, OPTION3_VALUE]);
      option2.selected = false;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([OPTION1_VALUE, OPTION3_VALUE]);
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

    it('should throw if value is not an array', () => {
      expect(() => viewAdapter.setViewValue({})).toThrow();
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
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      viewAdapter.setViewValue([STRING_OPTIONS[1], STRING_OPTIONS[2]]);
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

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([STRING_OPTIONS[0]]);
      expect(option1.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([STRING_OPTIONS[0], STRING_OPTIONS[1]]);
      expect(option1.selected).toBe(true);
      expect(option2.selected).toBe(true);
    });

    it('should mark an option as unselected if different value is written', () => {
      viewAdapter.setViewValue([STRING_OPTIONS[0], STRING_OPTIONS[2]]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      option1.selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(STRING_OPTIONS);
      option2.selected = false;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([STRING_OPTIONS[0], STRING_OPTIONS[2]]);
    });

    it("should call the registered function whenever a selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 'new value';
      const newValues = [...STRING_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith([newValues[1], newValues[2]]);
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 'op4';
      const newValues = [...STRING_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      element.querySelectorAll('option')[3].selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([newValues[1], newValues[2], newValues[3]]);
    });

    it('should remove options dynamically', () => {
      const newValues = [...STRING_OPTIONS];
      newValues.pop();

      fixture.componentRef.setInput('stringOptions', newValues);
      fixture.detectChanges();

      const oldValue = [...STRING_OPTIONS];
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
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
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      viewAdapter.setViewValue([NUMBER_OPTIONS[1], NUMBER_OPTIONS[2]]);
    });

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([NUMBER_OPTIONS[0]]);
      expect(option1.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([NUMBER_OPTIONS[0], NUMBER_OPTIONS[1]]);
      expect(option1.selected).toBe(true);
      expect(option2.selected).toBe(true);
    });

    it('should mark an option as unselected if different value is written', () => {
      viewAdapter.setViewValue([NUMBER_OPTIONS[0], NUMBER_OPTIONS[2]]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      option1.selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(NUMBER_OPTIONS);
      option2.selected = false;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([NUMBER_OPTIONS[0], NUMBER_OPTIONS[2]]);
    });

    it("should call the registered function whenever a selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith([newValues[1], newValues[2]]);
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 4;
      const newValues = [...NUMBER_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      element.querySelectorAll('option')[3].selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([newValues[1], newValues[2], newValues[3]]);
    });

    it('should remove options dynamically', () => {
      const newValues = [...NUMBER_OPTIONS];
      newValues.pop();

      fixture.componentRef.setInput('numberOptions', newValues);
      fixture.detectChanges();

      const oldValue = [...NUMBER_OPTIONS];
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
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
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      viewAdapter.setViewValue([BOOLEAN_OPTIONS[1]]);
    });

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([BOOLEAN_OPTIONS[0]]);
      expect(option1.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([BOOLEAN_OPTIONS[0], BOOLEAN_OPTIONS[1]]);
      expect(option1.selected).toBe(true);
      expect(option2.selected).toBe(true);
    });

    it('should mark an option as unselected if different value is written', () => {
      viewAdapter.setViewValue([BOOLEAN_OPTIONS[0]]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      option1.selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(BOOLEAN_OPTIONS);
      option2.selected = false;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([BOOLEAN_OPTIONS[0]]);
    });

    it("should call the registered function whenever a selected option's value changes", () => {
      fixture.componentRef.setInput('booleanOptions', [true]);
      fixture.detectChanges();

      viewAdapter.setViewValue([true]);

      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      fixture.componentRef.setInput('booleanOptions', [false]);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith([false]);
    });

    it('should create new options dynamically', () => {
      fixture.componentRef.setInput('booleanOptions', [true]);
      fixture.detectChanges();

      viewAdapter.setViewValue([true]);

      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      fixture.componentRef.setInput('booleanOptions', [true, false]);
      fixture.detectChanges();

      element.querySelectorAll('option')[1].selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([true, false]);
    });

    it('should remove options dynamically', () => {
      const newValues = [...BOOLEAN_OPTIONS];
      viewAdapter.setViewValue(newValues);

      newValues.pop();

      fixture.componentRef.setInput('booleanOptions', newValues);
      fixture.detectChanges();

      const oldValue = [...BOOLEAN_OPTIONS];
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
    });
  });

  it('should not throw if calling callbacks before they are registered', () => {
    expect(() => viewAdapter.onChange()).not.toThrow();
    expect(() => viewAdapter.onTouched()).not.toThrow();
  });
});
