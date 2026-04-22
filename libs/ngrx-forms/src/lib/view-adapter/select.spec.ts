import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
    <select [ngrxFormControlState]="control()">
      <option value="op1">op1</option>
      <option value="op2" selected>op2</option>
    </select>
  `,
})
export class StaticTestComponent {
  public readonly control = input<FormControlState<any>>(INITIAL_STATE);
}

@Component({
  imports: [NgrxSelectViewAdapter, NgrxSelectOption],
  template: `
    <select [ngrxFormControlState]="control()">
      @for (o of options(); track $index) {
        <option [value]="o">{{ o }}</option>
      }
    </select>
  `,
})
class DynamicTestComponent<T> extends StaticTestComponent {
  /**
   * Option values.
   */
  public readonly options = input<T[]>([]);
}

interface TypedDebugElement<TElement> extends DebugElement {
  /**
   * The underlying DOM element at the root of the component.
   */
  get nativeElement(): TElement;
}

describe(NgrxSelectViewAdapter.name, () => {
  describe('static options', () => {
    let fixture: ComponentFixture<StaticTestComponent>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [StaticTestComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(StaticTestComponent);
      fixture.detectChanges();
    });

    let element: TypedDebugElement<HTMLSelectElement>;
    beforeEach(() => {
      element = fixture.debugElement.query(By.css('select'));
    });

    let option1: TypedDebugElement<HTMLOptionElement>;
    let option2: TypedDebugElement<HTMLOptionElement>;
    beforeEach(() => {
      const options = element.queryAll(By.css('option'));
      option1 = options[0];
      option2 = options[1];
    });

    let viewAdapter: NgrxSelectViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(STRING_OPTIONS[1]);
      fixture.detectChanges();
    });

    it('should attach the view adapter', () => {
      expect(viewAdapter).toBeDefined();
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(OPTION1_VALUE);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(OPTION1_VALUE);
      fixture.detectChanges();

      expect(option2.nativeElement.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChanges = vi.fn();
      viewAdapter.setOnChangeCallback(onChanges);

      option1.nativeElement.selected = true;
      element.triggerEventHandler('change');
      fixture.detectChanges();

      expect(onChanges).toHaveBeenCalledWith(OPTION1_VALUE);
    });

    it('should call the registered function whenever the input is blurred', () => {
      const spy = vi.fn();
      viewAdapter.setOnTouchedCallback(spy);

      element.triggerEventHandler('blur');

      expect(spy).toHaveBeenCalled();
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

    it('should throw if state is undefined', () => {
      const fn = () => {
        fixture.componentRef.setInput('state', undefined);
        fixture.detectChanges();
      };
      expect(fn).toThrow();
    });

    it('should not throw if calling callbacks before they are registered', () => {
      const fn = (type: string) => () => element.triggerEventHandler(type);
      expect(fn('change')).not.toThrow();
      expect(fn('blur')).not.toThrow();
    });
  });

  describe('dynamic string options', () => {
    let fixture: ComponentFixture<DynamicTestComponent<string>>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [DynamicTestComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent<DynamicTestComponent<string>>(DynamicTestComponent);
      fixture.detectChanges();
    });

    beforeEach(() => {
      fixture.componentRef.setInput('options', STRING_OPTIONS);
      fixture.detectChanges();
    });

    let element: TypedDebugElement<HTMLSelectElement>;
    beforeEach(() => {
      element = fixture.debugElement.query(By.css('select'));
    });

    let option1: TypedDebugElement<HTMLOptionElement>;
    let option2: TypedDebugElement<HTMLOptionElement>;
    beforeEach(() => {
      const options = element.queryAll(By.css('option'));
      option1 = options[0];
      option2 = options[1];
    });

    let viewAdapter: NgrxSelectViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(STRING_OPTIONS[1]);
      fixture.detectChanges();
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(STRING_OPTIONS[0]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(STRING_OPTIONS[0]);
      fixture.detectChanges();

      expect(option2.nativeElement.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      element.nativeElement.selectedIndex = 0;
      element.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(STRING_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 'new value';
      const newValues = [...STRING_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 'new value';
      const newValues = [...STRING_OPTIONS];
      newValues[0] = newValue;

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 'op3';
      const newValues = [...STRING_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      element.nativeElement.selectedIndex = 2;
      element.triggerEventHandler('change');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const newValues = [...STRING_OPTIONS];
      newValues.pop();

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const fn = () => {
        viewAdapter.setViewValue([...STRING_OPTIONS]);
        fixture.detectChanges();
      };

      expect(fn).not.toThrow();
      expect(element.nativeElement.selectedIndex).toEqual(-1);
    });

    it('should select the correct option when a new option is added for the current state value', () => {
      const newValue = 'new value';
      viewAdapter.setViewValue(newValue);

      const newValues = [...STRING_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const options = element.queryAll(By.css('option'));
      const newOption = options[2];
      expect(newOption.nativeElement.selected).toBe(true);
    });
  });

  describe('dynamic number options', () => {
    let fixture: ComponentFixture<DynamicTestComponent<number>>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [DynamicTestComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent<DynamicTestComponent<number>>(DynamicTestComponent);
      fixture.detectChanges();
    });

    beforeEach(() => {
      fixture.componentRef.setInput('options', NUMBER_OPTIONS);
      fixture.detectChanges();
    });

    let element: TypedDebugElement<HTMLSelectElement>;
    beforeEach(() => {
      element = fixture.debugElement.query(By.css('select'));
    });

    let option1: TypedDebugElement<HTMLOptionElement>;
    let option2: TypedDebugElement<HTMLOptionElement>;
    beforeEach(() => {
      const options = element.queryAll(By.css('option'));
      option1 = options[0];
      option2 = options[1];
    });

    let viewAdapter: NgrxSelectViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(NUMBER_OPTIONS[1]);
      fixture.detectChanges();
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(NUMBER_OPTIONS[0]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(NUMBER_OPTIONS[0]);
      fixture.detectChanges();

      expect(option2.nativeElement.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      element.nativeElement.selectedIndex = 0;
      element.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(NUMBER_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues[0] = newValue;

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      element.nativeElement.selectedIndex = 2;
      element.triggerEventHandler('change');
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      fixture.componentRef.setInput('options', [1]);
      fixture.detectChanges();

      const fn = () => {
        viewAdapter.setViewValue(2);
        fixture.detectChanges();
      };
      expect(fn).not.toThrow();
      expect(element.nativeElement.selectedIndex).toEqual(-1);
    });

    it('should select the correct option when a new option is added for the current state value', () => {
      const newValue = 3;
      viewAdapter.setViewValue(newValue);

      const newValues = [...NUMBER_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const options = element.queryAll(By.css('option'));
      const newOption = options[2];
      expect(newOption.nativeElement.selected).toBe(true);
    });
  });

  describe('dynamic boolean options', () => {
    let fixture: ComponentFixture<DynamicTestComponent<boolean>>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [DynamicTestComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent<DynamicTestComponent<boolean>>(DynamicTestComponent);
      fixture.detectChanges();
    });

    beforeEach(() => {
      fixture.componentRef.setInput('options', BOOLEAN_OPTIONS);
      fixture.detectChanges();
    });

    let element: TypedDebugElement<HTMLSelectElement>;
    beforeEach(() => {
      element = fixture.debugElement.query(By.css('select'));
    });

    let option1: TypedDebugElement<HTMLOptionElement>;
    let option2: TypedDebugElement<HTMLOptionElement>;
    beforeEach(() => {
      const options = element.queryAll(By.css('option'));
      option1 = options[0];
      option2 = options[1];
    });

    let viewAdapter: NgrxSelectViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<NgrxSelectViewAdapter>(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(BOOLEAN_OPTIONS[1]);
      fixture.detectChanges();
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(BOOLEAN_OPTIONS[0]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(BOOLEAN_OPTIONS[0]);
      fixture.detectChanges();

      expect(option2.nativeElement.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      element.nativeElement.selectedIndex = 0;
      element.triggerEventHandler('change');
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith(BOOLEAN_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = true;
      const newValues = [...BOOLEAN_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it('should create new options dynamically', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = true;
      const newValues = [...BOOLEAN_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      element.nativeElement.selectedIndex = 2;
      element.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const newValues = [...BOOLEAN_OPTIONS];
      newValues.pop();

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const fn = () => {
        viewAdapter.setViewValue(BOOLEAN_OPTIONS[1]);
        fixture.detectChanges();
      };
      expect(fn).not.toThrow();
      expect(element.nativeElement.selectedIndex).toEqual(-1);
    });

    it('should select the correct option when a new option is added for the current state value', () => {
      viewAdapter.setViewValue(false);
      fixture.detectChanges();

      fixture.componentRef.setInput('options', [true]);
      fixture.detectChanges();

      fixture.componentRef.setInput('options', [true, false]);
      fixture.detectChanges();

      const options = element.queryAll(By.css('option'));
      const newOption = options[1];
      expect(newOption.nativeElement.selected).toBe(true);
    });
  });
});
