import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
    <input #el type="radio" value="op1" [ngrxFormControlState]="control()" />
    <input #el type="radio" value="op2" checked="checked" [ngrxFormControlState]="control()" />
  `,
})
class StaticTestComponent {
  /**
   * A signal containting the control state to bind to the underlying form control.
   */
  public readonly control = input<FormControlState<any>>(INITIAL_STATE);
}

@Component({
  imports: [NgrxRadioViewAdapter],
  template: `
    @for (o of options(); track $index) {
      <input #el type="radio" [value]="o" [ngrxFormControlState]="control()" />
    }
  `,
})
class DynamicTestComponent<TValue> extends StaticTestComponent {
  /**
   * The options.
   */
  public readonly options = input<TValue[]>([]);
}

interface TypedDebugElement<TElement> extends DebugElement {
  /**
   * The underlying DOM element at the root of the component.
   */
  get nativeElement(): TElement;
}

describe(NgrxRadioViewAdapter.name, () => {
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

    let element1: TypedDebugElement<HTMLInputElement>;
    let element2: TypedDebugElement<HTMLInputElement>;
    beforeEach(() => {
      const elements = fixture.debugElement.queryAll(By.css('input'));
      element1 = elements[0];
      element2 = elements[1];
    });

    let viewAdapter1: NgrxRadioViewAdapter<any>;
    let viewAdapter2: NgrxRadioViewAdapter<any>;
    beforeEach(() => {
      viewAdapter1 = element1.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
      viewAdapter2 = element2.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
    });

    it('should attach the view adapter', () => {
      expect(viewAdapter1).toBeDefined();
      expect(viewAdapter2).toBeDefined();
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(OPTION1_VALUE);
      viewAdapter2.setViewValue(OPTION1_VALUE);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      viewAdapter1.setViewValue(OPTION1_VALUE);
      viewAdapter2.setViewValue(OPTION1_VALUE);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(true);

      viewAdapter1.setViewValue(OPTION2_VALUE);
      viewAdapter2.setViewValue(OPTION2_VALUE);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      element1.nativeElement.checked = true;
      element1.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(OPTION1_VALUE);
    });

    it('should disable the input', () => {
      viewAdapter1.setIsDisabled(true);
      viewAdapter2.setIsDisabled(true);
      fixture.detectChanges();

      expect(element1.nativeElement.disabled).toBe(true);
    });

    it('should enable the input', () => {
      viewAdapter1.setIsDisabled(true);
      viewAdapter2.setIsDisabled(true);
      fixture.detectChanges();

      expect(element1.nativeElement.disabled).toBe(true);

      viewAdapter1.setIsDisabled(false);
      viewAdapter2.setIsDisabled(false);
      fixture.detectChanges();

      expect(element1.nativeElement.disabled).toBe(false);
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

    let element1: TypedDebugElement<HTMLInputElement>;
    let element2: TypedDebugElement<HTMLInputElement>;
    beforeEach(() => {
      const elements = fixture.debugElement.queryAll(By.css('input'));
      element1 = elements[0];
      element2 = elements[1];
    });

    let viewAdapter1: NgrxRadioViewAdapter<any>;
    let viewAdapter2: NgrxRadioViewAdapter<any>;
    beforeEach(() => {
      viewAdapter1 = element1.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
      viewAdapter2 = element2.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
    });

    beforeEach(() => {
      viewAdapter1.setViewValue(STRING_OPTIONS[1]);
      viewAdapter2.setViewValue(STRING_OPTIONS[1]);
      fixture.detectChanges();
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(STRING_OPTIONS[0]);
      viewAdapter2.setViewValue(STRING_OPTIONS[0]);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      viewAdapter1.setViewValue(STRING_OPTIONS[0]);
      viewAdapter2.setViewValue(STRING_OPTIONS[0]);
      fixture.detectChanges();

      viewAdapter1.setViewValue(STRING_OPTIONS[1]);
      viewAdapter2.setViewValue(STRING_OPTIONS[1]);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      element1.nativeElement.checked = true;
      element1.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(STRING_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      const newValue = 'new value';
      const newValues = [STRING_OPTIONS[0], newValue];

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      const newValue = 'new value';
      const newValues = [newValue, STRING_OPTIONS[1]];

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const newValue = 'op3';
      const newValues = [...STRING_OPTIONS, newValue];

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const elements: TypedDebugElement<HTMLInputElement>[] = fixture.debugElement.queryAll(By.css('input'));
      expect(elements).toHaveLength(3);

      const newElement = elements[2];
      expect(newElement).toBeDefined();

      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      const newViewAdapter = newElement.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
      newViewAdapter.setOnChangeCallback(onChange);

      newElement.nativeElement.checked = true;
      newElement.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(newValue);
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

    let element1: TypedDebugElement<HTMLInputElement>;
    let element2: TypedDebugElement<HTMLInputElement>;
    beforeEach(() => {
      const elements = fixture.debugElement.queryAll(By.css('input'));
      element1 = elements[0];
      element2 = elements[1];
    });

    let viewAdapter1: NgrxRadioViewAdapter<any>;
    let viewAdapter2: NgrxRadioViewAdapter<any>;
    beforeEach(() => {
      viewAdapter1 = element1.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
      viewAdapter2 = element2.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
    });

    beforeEach(() => {
      viewAdapter1.setViewValue(NUMBER_OPTIONS[1]);
      viewAdapter2.setViewValue(NUMBER_OPTIONS[1]);
      fixture.detectChanges();
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(NUMBER_OPTIONS[0]);
      viewAdapter2.setViewValue(NUMBER_OPTIONS[0]);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      viewAdapter1.setViewValue(NUMBER_OPTIONS[0]);
      viewAdapter2.setViewValue(NUMBER_OPTIONS[0]);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(true);

      viewAdapter1.setViewValue(NUMBER_OPTIONS[1]);
      viewAdapter2.setViewValue(NUMBER_OPTIONS[1]);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      element1.nativeElement.checked = true;
      element1.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(NUMBER_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      const newValue = 3;
      const newValues = [NUMBER_OPTIONS[0], newValue];

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      const newValue = 3;
      const newValues = [newValue, NUMBER_OPTIONS[1]];

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const newValue = 3;
      const newValues = [...NUMBER_OPTIONS, newValue];

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const elements: TypedDebugElement<HTMLInputElement>[] = fixture.debugElement.queryAll(By.css('input'));
      expect(elements).toHaveLength(3);

      const newElement = elements[2];
      expect(newElement).toBeDefined();

      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      const newViewAdapter = newElement.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
      newViewAdapter.setOnChangeCallback(onChange);

      newElement.nativeElement.checked = true;
      newElement.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(newValue);
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

    let element1: TypedDebugElement<HTMLInputElement>;
    let element2: TypedDebugElement<HTMLInputElement>;
    beforeEach(() => {
      const elements = fixture.debugElement.queryAll(By.css('input'));
      element1 = elements[0];
      element2 = elements[1];
    });

    let viewAdapter1: NgrxRadioViewAdapter<any>;
    let viewAdapter2: NgrxRadioViewAdapter<any>;
    beforeEach(() => {
      viewAdapter1 = element1.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
      viewAdapter2 = element2.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
    });

    beforeEach(() => {
      viewAdapter1.setViewValue(BOOLEAN_OPTIONS[1]);
      viewAdapter2.setViewValue(BOOLEAN_OPTIONS[1]);
      fixture.detectChanges();
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(BOOLEAN_OPTIONS[0]);
      viewAdapter2.setViewValue(BOOLEAN_OPTIONS[0]);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      viewAdapter1.setViewValue(BOOLEAN_OPTIONS[0]);
      viewAdapter2.setViewValue(BOOLEAN_OPTIONS[0]);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(true);

      viewAdapter1.setViewValue(BOOLEAN_OPTIONS[1]);
      viewAdapter2.setViewValue(BOOLEAN_OPTIONS[1]);
      fixture.detectChanges();

      expect(element1.nativeElement.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      element1.nativeElement.checked = true;
      element1.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(BOOLEAN_OPTIONS[0]);
    });

    it("should call the registered function whenever the selected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      const newValue = true;
      const newValues = [BOOLEAN_OPTIONS[0], newValue];

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it("should not call the registered function whenever an unselected option's value changes", () => {
      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      const newValue = true;
      const newValues = [newValue, BOOLEAN_OPTIONS[1]];

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const newValue = true;
      const newValues = [...BOOLEAN_OPTIONS, newValue];

      fixture.componentRef.setInput('options', newValues);
      fixture.detectChanges();

      const elements: TypedDebugElement<HTMLInputElement>[] = fixture.debugElement.queryAll(By.css('input'));
      expect(elements).toHaveLength(3);

      const newElement = elements[2];
      expect(newElement).toBeDefined();

      const onChange = vi.fn();
      viewAdapter1.setOnChangeCallback(onChange);
      viewAdapter2.setOnChangeCallback(onChange);

      const newViewAdapter = newElement.injector.get<NgrxRadioViewAdapter<any>>(NgrxRadioViewAdapter);
      newViewAdapter.setOnChangeCallback(onChange);

      newElement.nativeElement.checked = true;
      newElement.triggerEventHandler('change');

      expect(onChange).toHaveBeenCalledWith(newValue);
    });
  });
});
