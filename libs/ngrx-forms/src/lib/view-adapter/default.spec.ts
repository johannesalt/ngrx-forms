import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createFormControlState, FormControlState } from '../state';
import { NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED, NgrxDefaultViewAdapter } from './default';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

@Component({
  imports: [NgrxDefaultViewAdapter],
  template: `<input #el type="text" [ngrxFormControlState]="control()" />`,
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

describe(NgrxDefaultViewAdapter.name, () => {
  describe('Composition events not supported', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      TestBed.overrideProvider(NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED, { useValue: false });
    });

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

    let viewAdapter: NgrxDefaultViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<NgrxDefaultViewAdapter>(NgrxDefaultViewAdapter);
    });

    it('should attach the view adapter', () => {
      expect(viewAdapter).toBeDefined();
    });

    it('should call the registered function when the value changes and is composing but composition is not supported', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 'new value';
      element.nativeElement.value = newValue;
      element.triggerEventHandler('compositionstart');
      element.triggerEventHandler('input');

      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it('should not call the registered function on composition end if composition is not supported', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 'new value';
      element.nativeElement.value = newValue;
      element.triggerEventHandler('compositionend');

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Composition events supported', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      TestBed.overrideProvider(NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED, { useValue: true });
    });

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

    let viewAdapter: NgrxDefaultViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<NgrxDefaultViewAdapter>(NgrxDefaultViewAdapter);
    });

    it('should attach the view adapter', () => {
      expect(viewAdapter).toBeDefined();
    });

    it("should set the input's value", () => {
      viewAdapter.setViewValue('new value');
      fixture.detectChanges();

      expect(element.nativeElement.value).toBe('new value');
    });

    it("should set the input's value to empty string if null", () => {
      viewAdapter.setViewValue(null);
      fixture.detectChanges();

      expect(element.nativeElement.value).toBe('');
    });

    it('should call the registered function whenever the value changes', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 'new value';
      element.nativeElement.value = newValue;
      element.triggerEventHandler('input');

      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it('should not call the registered function when the value changes and is composing', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      element.nativeElement.value = 'new value';
      element.triggerEventHandler('compositionstart');
      element.triggerEventHandler('input');

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call the registered function on composition end', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      const newValue = 'new value';
      element.nativeElement.value = newValue;
      element.triggerEventHandler('compositionstart');
      element.triggerEventHandler('input');

      expect(onChange).not.toHaveBeenCalled();

      element.triggerEventHandler('compositionend');

      expect(onChange).toHaveBeenCalledWith(newValue);
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
});
