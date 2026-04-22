import { Component, DebugElement, Directive, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createFormControlState, FormControlState } from '../state';
import { NgrxViewAdapter } from './view-adapter.directive';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<string>(TEST_ID, '');

@Directive({
  selector: 'input[ngrxFormControlState]',
})
class TestViewAdapter extends NgrxViewAdapter<HTMLInputElement, string, string> {
  /**
   * @inheritdoc
   */
  protected override getNativeControlValue(): string {
    const el: HTMLInputElement = this.element.nativeElement;
    return el.value;
  }
}

@Component({
  imports: [TestViewAdapter],
  template: `
    <input [ngrxFormControlState]="control()" type="text" />
    <input [ngrxFormControlState]="control()" type="text" id="customId" />
    <input [ngrxFormControlState]="control()" type="text" [id]="boundId()" />
  `,
})
class TestComponent {
  /**
   * Unique Id of the HTML input element.
   */
  public readonly boundId = input('boundId');

  /**
   * The control state to bind to the underlying form control.
   */
  public readonly control = input<FormControlState<string>>(INITIAL_STATE);
}

interface TypedDebugElement<TElement> extends DebugElement {
  /**
   * The underlying DOM element at the root of the component.
   */
  get nativeElement(): TElement;
}

describe(NgrxViewAdapter.name, () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestComponent] }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('after first render', () => {
    let viewAdapters: TestViewAdapter[];
    beforeEach(() => {
      const elements = fixture.debugElement.queryAll(By.css('input'));
      viewAdapters = elements.map((element) => element.injector.get<TestViewAdapter>(TestViewAdapter));
    });

    it('should be the ID of the control state if the ID is not set in template', () => {
      const viewAdapter = viewAdapters[0];
      expect(viewAdapter.name()).toBe(TEST_ID);
    });

    it('should be the ID manually bound in template', () => {
      const viewAdapter = viewAdapters[1];
      expect(viewAdapter.name()).toBe('customId');
    });

    it('should be the ID bound via binding', () => {
      const viewAdapter = viewAdapters[2];
      expect(viewAdapter.name()).toBe(component.boundId());
    });
  });

  describe('after control state changed', () => {
    let viewAdapters: TestViewAdapter[];
    beforeEach(() => {
      const elements = fixture.debugElement.queryAll(By.css('input'));
      viewAdapters = elements.map((element) => element.injector.get<TestViewAdapter>(TestViewAdapter));
    });

    beforeEach(() => {
      fixture.componentRef.setInput('control', { ...INITIAL_STATE, id: 'new ID' });
      fixture.detectChanges();
    });

    it('should be the ID of the control state if the ID is not set in template', () => {
      const viewAdapter = viewAdapters[0];
      expect(viewAdapter.name()).toBe('new ID');
    });

    it('should be the ID manually bound in template', () => {
      const viewAdapter = viewAdapters[1];
      expect(viewAdapter.name()).toBe('customId');
    });

    it('should be the ID bound via binding', () => {
      const viewAdapter = viewAdapters[2];
      expect(viewAdapter.name()).toBe(component.boundId());
    });
  });

  describe(() => {
    let element: TypedDebugElement<HTMLInputElement>;
    beforeEach(() => {
      const elements = fixture.debugElement.queryAll(By.css('input'));
      element = elements[0];
    });

    let viewAdapter: TestViewAdapter;
    beforeEach(() => {
      viewAdapter = element.injector.get<TestViewAdapter>(TestViewAdapter);
    });

    it('should be disabled', () => {
      viewAdapter.setIsDisabled(true);
      expect(viewAdapter.disabled()).toBe(true);
    });

    it('should be enabled', () => {
      viewAdapter.setIsDisabled(true);
      expect(viewAdapter.disabled()).toBe(true);

      viewAdapter.setIsDisabled(false);
      expect(viewAdapter.disabled()).toBe(false);
    });

    it('should call the registered function whenever the value is changed', () => {
      const onChange = vi.fn();
      viewAdapter.setOnChangeCallback(onChange);

      element.nativeElement.value = 'hello world';
      element.triggerEventHandler('input');

      expect(onChange).toHaveBeenCalledWith('hello world');
    });

    it('should call the registered function whenever the element is blurred', () => {
      const onTouched = vi.fn();
      viewAdapter.setOnTouchedCallback(onTouched);

      element.triggerEventHandler('blur');
      expect(onTouched).toHaveBeenCalled();
    });

    it('should update the value', () => {
      viewAdapter.setViewValue('hello');
      expect(viewAdapter.controlValue()).toBe('hello');
    });

    it('should throw if state is undefined', () => {
      const fn = () => {
        fixture.componentRef.setInput('control', undefined);
        fixture.detectChanges();
      };
      expect(fn).toThrow();
    });
  });
});
