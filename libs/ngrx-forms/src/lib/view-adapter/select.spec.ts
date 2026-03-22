import { Component, getDebugNode, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFormControlState, FormControlState } from '../state';
import { NgrxSelectOption } from './option';
import { NgrxSelectViewAdapter } from './select';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

const OPTION1_VALUE = 'op1';

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
      @for (o of stringOptions; track $index) {
      <option [value]="o">{{ o }}</option>
      }
    </select>

    <select [ngrxFormControlState]="state()">
      @for (o of numberOptions; track $index) {
      <option [value]="o">{{ o }}</option>
      }
    </select>

    <select [ngrxFormControlState]="state()">
      @for (o of booleanOptions; track $index) {
      <option [value]="o">{{ o }}</option>
      }
    </select>
  `,
})
export class SelectTestComponent {
  boundId = 'boundId';
  stringOptions = ['op1', 'op2'];
  numberOptions = [1, 2];
  booleanOptions = [true, false];

  public readonly state = input<FormControlState<any>>(INITIAL_STATE);
}

describe(NgrxSelectViewAdapter.name, () => {
  let component: SelectTestComponent;
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
      component = fixture.componentInstance;
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelector('select')!;
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      fixture.detectChanges();
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
      component = fixture.componentInstance;
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[3];
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(component.stringOptions[1]);
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
      viewAdapter.setViewValue(component.stringOptions[0]);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(component.stringOptions[0]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      element.selectedIndex = 0;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.stringOptions[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'new value';
      component.stringOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'new value';
      component.stringOptions[0] = newValue;
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'op3';
      component.stringOptions.push(newValue);
      fixture.detectChanges();
      element.selectedIndex = 2;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const oldValue = component.stringOptions[1];
      component.stringOptions.pop();
      fixture.detectChanges();
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
      expect(element.selectedIndex).toEqual(-1);
    });

    it('should select the correct option when a new option is added for the current state value', () => {
      const newValue = 'new value';
      viewAdapter.setViewValue(newValue);
      component.stringOptions.push(newValue);
      fixture.detectChanges();
      const newOption = element.querySelectorAll('option')[2];
      expect(newOption.selected).toBe(true);
    });
  });

  describe('dynamic number options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[4];
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(component.numberOptions[1]);
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(component.numberOptions[0]);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(component.numberOptions[0]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      element.selectedIndex = 0;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.numberOptions[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 3;
      component.numberOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 3;
      component.numberOptions[0] = newValue;
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 3;
      component.numberOptions.push(newValue);
      fixture.detectChanges();
      element.selectedIndex = 2;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const oldValue = component.numberOptions[1];
      component.numberOptions.pop();
      fixture.detectChanges();
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
      expect(element.selectedIndex).toEqual(-1);
    });

    it('should select the correct option when a new option is added for the current state value', () => {
      const newValue = 3;
      viewAdapter.setViewValue(newValue);
      component.numberOptions.push(newValue);
      fixture.detectChanges();
      const newOption = element.querySelectorAll('option')[2];
      expect(newOption.selected).toBe(true);
    });
  });

  describe('dynamic boolean options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[5];
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(component.booleanOptions[1]);
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(component.booleanOptions[0]);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(component.booleanOptions[0]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      element.selectedIndex = 0;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.booleanOptions[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = true;
      component.booleanOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = true;
      component.booleanOptions.push(newValue);
      fixture.detectChanges();
      element.selectedIndex = 2;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const oldValue = component.booleanOptions[1];
      component.booleanOptions.pop();
      fixture.detectChanges();
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
      expect(element.selectedIndex).toEqual(-1);
    });

    it('should select the correct option when a new option is added for the current state value', () => {
      const newValue = false;
      viewAdapter.setViewValue(newValue);
      component.booleanOptions = [true];
      fixture.detectChanges();
      component.booleanOptions.push(newValue);
      fixture.detectChanges();
      const newOption = element.querySelectorAll('option')[1];
      expect(newOption.selected).toBe(true);
    });
  });

  it('should not throw if calling callbacks before they are registered', () => {
    expect(() => viewAdapter.onChange({ target: option1 })).not.toThrowError();
    expect(() => viewAdapter.onTouched()).not.toThrowError();
  });
});
