import { Component, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Mock, MockInstance } from 'vitest';
import { NGRX_SELECT_VIEW_ADAPTER, NgrxSelectOption, SelectViewAdapter } from './option';

@Component({
  imports: [NgrxSelectOption],
  template: `
    <select>
      <option [selected]="option1.selected" [value]="option1.value">op1</option>
    </select>
  `,
})
export class TestComponent {
  public option1 = { selected: false, value: 'op1' };
  public option2 = { selected: true, value: 'op2' };
}

describe(NgrxSelectOption, () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  describe('Default behaviour of Angular', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    });

    let renderer: Renderer2;
    beforeEach(() => {
      renderer = fixture.componentRef.injector.get(Renderer2);
    });

    let setProperty: MockInstance<(element: HTMLElement, name: string, value: any) => void>;
    beforeEach(() => {
      setProperty = vi.spyOn(renderer, 'setProperty');
    });

    it('should set the value attribute if no view adapter is provided', () => {
      component.option1 = { selected: false, value: 'value' };
      fixture.detectChanges();

      expect(setProperty).toHaveBeenCalledWith(expect.anything(), 'value', 'value');
    });
  });

  describe('ViewAdapter integration', () => {
    let deregisterOption: Mock<(id: any) => void>;
    beforeEach(() => {
      deregisterOption = vi.fn();
    });

    let registerOption: Mock<(option: NgrxSelectOption) => string>;
    beforeEach(() => {
      registerOption = vi.fn().mockImplementation(() => '0');
    });

    let updateOptionValue: Mock<(id: string, value: any) => void>;
    beforeEach(() => {
      updateOptionValue = vi.fn();
    });

    let viewAdapter: SelectViewAdapter;
    beforeEach(() => {
      viewAdapter = {
        deregisterOption: deregisterOption,
        registerOption: registerOption,
        setIsDisabled: vi.fn(),
        setOnChangeCallback: vi.fn(),
        setOnTouchedCallback: vi.fn(),
        setViewValue: vi.fn(),
        updateOptionValue: updateOptionValue,
      };
    });

    beforeEach(() => {
      TestBed.overrideDirective(NgrxSelectOption, {
        set: {
          providers: [{ provide: NGRX_SELECT_VIEW_ADAPTER, useValue: viewAdapter }],
        },
      });
    });

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    });

    let renderer: Renderer2;
    beforeEach(() => {
      renderer = fixture.componentRef.injector.get(Renderer2);
    });

    let setProperty: MockInstance<(element: HTMLElement, name: string, value: any) => void>;
    beforeEach(() => {
      setProperty = vi.spyOn(renderer, 'setProperty');
    });

    it('should not set the value attribute (to value) if a view adapter is provided', () => {
      component.option1 = { selected: false, value: 'value' };
      fixture.detectChanges();

      expect(setProperty).not.toHaveBeenCalledWith(expect.anything(), 'value', 'value');
    });

    it('should set the value to the id of the element', () => {
      component.option1 = { selected: false, value: 'value' };
      fixture.detectChanges();

      expect(setProperty).toHaveBeenCalledWith(expect.anything(), 'value', '0');
    });
  });
});
