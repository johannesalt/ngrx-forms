import { Component, getDebugNode } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControlState } from '../state';
import { NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED, NgrxDefaultViewAdapter } from './default';

const TEST_ID = 'test ID';

@Component({
  imports: [NgrxDefaultViewAdapter],
  template: `
    <input type="text" [ngrxFormControlState]="state" />
    <input type="text" [ngrxFormControlState]="state" id="customId" />
    <input type="text" [ngrxFormControlState]="state" [id]="boundId" />
  `,
})
export class DefaultInputTestComponent {
  public readonly boundId = 'boundId';

  public state: Partial<FormControlState<any>> | null | undefined = { id: TEST_ID };
}

describe(NgrxDefaultViewAdapter, () => {
  let component: DefaultInputTestComponent;
  let fixture: ComponentFixture<DefaultInputTestComponent>;
  let viewAdapter: NgrxDefaultViewAdapter;
  let element: HTMLInputElement;

  describe('Composition events not supported', () => {
    beforeEach(() => {
      TestBed.overrideDirective(NgrxDefaultViewAdapter, {
        set: {
          providers: [{ provide: NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED, useValue: false }],
        },
      });
    });

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DefaultInputTestComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(DefaultInputTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    beforeEach(() => {
      element = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
      viewAdapter = getDebugNode(element)!.injector.get<NgrxDefaultViewAdapter>(NgrxDefaultViewAdapter);
    });

    it('should call the registered function when the value changes and is composing but composition is not supported', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 'new value';
      element.value = newValue;

      viewAdapter.compositionStart();
      viewAdapter.handleInput({ target: element } as any);

      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should not call the registered function on composition end if composition is not supported', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);

      const newValue = 'new value';
      element.value = newValue;

      viewAdapter.compositionStart();
      viewAdapter.handleInput({ target: element } as any);

      expect(spy).toHaveBeenCalledTimes(1);

      viewAdapter.compositionEnd({ target: element } as any);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Composition events supported', () => {
    beforeEach(() => {
      TestBed.overrideDirective(NgrxDefaultViewAdapter, {
        set: {
          providers: [{ provide: NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED, useValue: true }],
        },
      });
    });

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DefaultInputTestComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(DefaultInputTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    beforeEach(() => {
      element = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
      viewAdapter = getDebugNode(element)!.injector.get<NgrxDefaultViewAdapter>(NgrxDefaultViewAdapter);
    });

    it('should attach the view adapter', () => expect(viewAdapter).toBeDefined());

    it("should set the input's value", () => {
      const newValue = 'new value';
      viewAdapter.setViewValue(newValue);
      expect(element.value).toBe(newValue);
    });

    it("should set the input's value to empty string if null", () => {
      viewAdapter.setViewValue(null);
      expect(element.value).toBe('');
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'new value';
      element.value = newValue;
      element.dispatchEvent(new Event('input'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should not call the registered function when the value changes and is composing', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'new value';
      element.value = newValue;
      viewAdapter.compositionStart();
      element.dispatchEvent(new Event('input'));
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call the registered function on composition end', () => {
      const spy = vi.fn();
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'new value';
      element.value = newValue;
      element.dispatchEvent(new Event('compositionstart'));
      element.dispatchEvent(new Event('input'));
      expect(spy).not.toHaveBeenCalled();
      element.dispatchEvent(new Event('compositionend'));
      expect(spy).toHaveBeenCalledWith(newValue);
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
        component.state = undefined;
        fixture.detectChanges();
      };
      expect(fn).toThrowError();
    });

    it('should not throw if calling callbacks before they are registered', () => {
      expect(() => viewAdapter.onChange(undefined)).not.toThrow();
      expect(() => viewAdapter.onTouched()).not.toThrow();
    });
  });
});
