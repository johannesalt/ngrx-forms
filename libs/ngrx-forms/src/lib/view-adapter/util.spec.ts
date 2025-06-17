import { Component, ElementRef, getDebugNode, inject, ProviderToken } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControlState } from '../state';
import { NgrxDefaultViewAdapter } from './default';
import { NgrxNumberViewAdapter } from './number';
import { NgrxRangeViewAdapter } from './range';
import { selectViewAdapter } from './util';
import { FormViewAdapter } from './view-adapter';

@Component({
  imports: [NgrxDefaultViewAdapter, NgrxNumberViewAdapter, NgrxRangeViewAdapter],
  template: `
    <input type="number" [ngrxFormControlState]="state" />
    <input type="range" [ngrxFormControlState]="state" />
    <input type="text" [ngrxFormControlState]="state" />
  `,
})
class TestComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  public readonly state: Partial<FormControlState<any>> = { id: 'test ID' };

  public get defaultViewAdapter(): NgrxDefaultViewAdapter {
    return this.getViewAdapterAtIndex(2, NgrxDefaultViewAdapter);
  }

  public get numberViewAdapter(): NgrxNumberViewAdapter {
    return this.getViewAdapterAtIndex(0, NgrxNumberViewAdapter);
  }

  public get rangeViewAdapter(): NgrxRangeViewAdapter {
    return this.getViewAdapterAtIndex(1, NgrxRangeViewAdapter);
  }

  private getElementAtIndex(index: number) {
    const element: HTMLElement | null | undefined = this.elementRef?.nativeElement;
    if (!element) {
      throw 'Element cannot be null';
    }

    return element.children.item(index);
  }

  private getViewAdapterAtIndex<T>(index: number, providerToken: ProviderToken<T>) {
    const element = this.getElementAtIndex(index);
    if (!element) {
      throw 'Element cannot be null';
    }

    const node = getDebugNode(element);
    if (!node) {
      throw 'Debug node cannot be null';
    }

    return node.injector.get<T>(providerToken);
  }
}

describe(selectViewAdapter, () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return the default view adapter if it is the only provided', () => {
    const viewAdapters = [component.defaultViewAdapter];
    const result = selectViewAdapter(viewAdapters);
    expect(result).toBe(viewAdapters[0]);
  });

  it('should throw if more than one built-in adapter is provided', () => {
    const viewAdapters = [component.numberViewAdapter, component.rangeViewAdapter];
    expect(() => selectViewAdapter(viewAdapters)).toThrowError('More than one built-in view adapter matches!');
  });

  it('should throw if more than one custom adapter is provided', () => {
    const viewAdapters: FormViewAdapter[] = [
      {
        setIsDisabled: vi.fn(),
        setOnChangeCallback: vi.fn(),
        setOnTouchedCallback: vi.fn(),
        setViewValue: vi.fn(),
      },
      {
        setIsDisabled: undefined,
        setOnChangeCallback: vi.fn(),
        setOnTouchedCallback: vi.fn(),
        setViewValue: vi.fn(),
      },
    ];
    expect(() => selectViewAdapter(viewAdapters)).toThrowError('More than one custom view adapter matches!');
  });

  it('should throw if no view adapters are provided', () => {
    expect(() => selectViewAdapter(null as any)).toThrowError('No view adapter matches!');
    expect(() => selectViewAdapter([])).toThrowError('No valid view adapter!');
  });
});
