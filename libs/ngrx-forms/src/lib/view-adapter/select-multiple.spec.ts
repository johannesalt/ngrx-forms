import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
    <select multiple [ngrxFormControlState]="control()">
      <option value="op1">op1</option>
      <option value="op2" selected>op2</option>
      <option value="op3" selected>op2</option>
    </select>
  `,
})
class StaticTestComponent {
  /**
   * The control state to bind to the underlying form control.
   */
  public readonly control = input<FormControlState<any>>(INITIAL_STATE);
}

@Component({
  imports: [NgrxSelectMultipleViewAdapter, NgrxSelectOption],
  template: `
    <select multiple [ngrxFormControlState]="control()">
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

describe(NgrxSelectMultipleViewAdapter.name, () => {
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

    let viewAdapter: NgrxSelectMultipleViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      viewAdapter.setViewValue([STRING_OPTIONS[1], STRING_OPTIONS[2]]);
      fixture.detectChanges();
    });

    it('should attach the view adapter', () => {
      expect(viewAdapter).toBeDefined();
    });

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([OPTION1_VALUE]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([OPTION1_VALUE, OPTION2_VALUE]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
      expect(option2.nativeElement.selected).toBe(true);
    });

    it('should mark options as unselected if different value is written', () => {
      viewAdapter.setViewValue([OPTION1_VALUE, OPTION3_VALUE]);
      fixture.detectChanges();

      expect(option2.nativeElement.selected).toBe(false);
    });

    it('should mark options as unselected if null is written', () => {
      viewAdapter.setViewValue(null);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(false);
      expect(option2.nativeElement.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      option1.nativeElement.selected = true;
      element.triggerEventHandler('change');
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith([OPTION1_VALUE, OPTION2_VALUE, OPTION3_VALUE]);

      option2.nativeElement.selected = false;
      element.triggerEventHandler('change');
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith([OPTION1_VALUE, OPTION3_VALUE]);
    });

    it('should call the registered function whenever the input is blurred', () => {
      const onChange = vi.fn();
      viewAdapter.setOnTouchedCallback(onChange);

      element.triggerEventHandler('blur');

      expect(onChange).toHaveBeenCalled();
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

    it('should throw if value is not an array', () => {
      expect(() => viewAdapter.setViewValue({})).toThrow();
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

    let viewAdapter: NgrxSelectMultipleViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      viewAdapter.setViewValue([STRING_OPTIONS[1], STRING_OPTIONS[2]]);
      fixture.detectChanges();
    });

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([STRING_OPTIONS[0]]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([STRING_OPTIONS[0], STRING_OPTIONS[1]]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
      expect(option2.nativeElement.selected).toBe(true);
    });

    it('should mark an option as unselected if different value is written', () => {
      viewAdapter.setViewValue([STRING_OPTIONS[0], STRING_OPTIONS[2]]);
      fixture.detectChanges();

      expect(option2.nativeElement.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      option1.nativeElement.selected = true;
      element.triggerEventHandler('change');
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith(STRING_OPTIONS);

      option2.nativeElement.selected = false;
      element.triggerEventHandler('change');
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith([STRING_OPTIONS[0], STRING_OPTIONS[2]]);
    });

    it("should call the registered function whenever a selected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 'new value';
      const newValues = [...STRING_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith([newValues[1], newValues[2]]);
    });

    it('should create new options dynamically', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 'op4';
      const newValues = [...STRING_OPTIONS, newValue];

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const options = element.queryAll(By.css('option'));
      options[3].nativeElement.selected = true;
      element.triggerEventHandler('change');
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith([newValues[1], newValues[2], newValues[3]]);
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

    let viewAdapter: NgrxSelectMultipleViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      viewAdapter.setViewValue([NUMBER_OPTIONS[1], NUMBER_OPTIONS[2]]);
      fixture.detectChanges();
    });

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([NUMBER_OPTIONS[0]]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([NUMBER_OPTIONS[0], NUMBER_OPTIONS[1]]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
      expect(option2.nativeElement.selected).toBe(true);
    });

    it('should mark an option as unselected if different value is written', () => {
      viewAdapter.setViewValue([NUMBER_OPTIONS[0], NUMBER_OPTIONS[2]]);
      fixture.detectChanges();

      expect(option2.nativeElement.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      option1.nativeElement.selected = true;
      element.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(NUMBER_OPTIONS);

      option2.nativeElement.selected = false;
      element.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith([NUMBER_OPTIONS[0], NUMBER_OPTIONS[2]]);
    });

    it("should call the registered function whenever a selected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS];
      newValues[1] = newValue;

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith([newValues[1], newValues[2]]);
    });

    it('should create new options dynamically', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 4;
      const newValues = [...NUMBER_OPTIONS];
      newValues.push(newValue);

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const options = element.queryAll(By.css('option'));
      options[3].nativeElement.selected = true;
      element.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith([newValues[1], newValues[2], newValues[3]]);
    });

    it('should remove options dynamically', () => {
      const newValues = [...NUMBER_OPTIONS];
      newValues.pop();

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const fn = () => {
        viewAdapter.setViewValue([...NUMBER_OPTIONS]);
        fixture.detectChanges();
      };
      expect(fn).not.toThrow();
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

    let viewAdapter: NgrxSelectMultipleViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      viewAdapter.setViewValue([BOOLEAN_OPTIONS[1]]);
      fixture.detectChanges();
    });

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([BOOLEAN_OPTIONS[0]]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([BOOLEAN_OPTIONS[0], BOOLEAN_OPTIONS[1]]);
      fixture.detectChanges();

      expect(option1.nativeElement.selected).toBe(true);
      expect(option2.nativeElement.selected).toBe(true);
    });

    it('should mark an option as unselected if different value is written', () => {
      viewAdapter.setViewValue([BOOLEAN_OPTIONS[0]]);
      fixture.detectChanges();

      expect(option2.nativeElement.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      option1.nativeElement.selected = true;
      element.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(BOOLEAN_OPTIONS);

      option2.nativeElement.selected = false;
      element.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith([BOOLEAN_OPTIONS[0]]);
    });

    it("should call the registered function whenever a selected option's value changes", () => {
      fixture.componentRef.setInput('options', [true]);
      fixture.detectChanges();

      viewAdapter.setViewValue([true]);

      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      fixture.componentRef.setInput('options', [false]);
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith([false]);
    });

    it('should create new options dynamically', () => {
      fixture.componentRef.setInput('options', [true]);
      fixture.detectChanges();

      viewAdapter.setViewValue([true]);

      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      fixture.componentRef.setInput('options', [true, false]);
      fixture.detectChanges();

      const options = element.queryAll(By.css('option'));
      options[1].nativeElement.selected = true;
      element.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith([true, false]);
    });

    it('should remove options dynamically', () => {
      const newValues = [...BOOLEAN_OPTIONS];
      viewAdapter.setViewValue(newValues);

      newValues.pop();

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const fn = () => {
        viewAdapter.setViewValue([...BOOLEAN_OPTIONS]);
        fixture.detectChanges();
      };
      expect(fn).not.toThrow();
    });
  });
});
