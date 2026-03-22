import { Component, input, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFormControlState, FormControlState } from '../state';
import { ControlNameDirective } from './control-name.directive';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

@Component({
  imports: [ControlNameDirective],
  template: `
    <input type="radio" value="op1" [ngrxFormControlState]="state()" />
    <input type="radio" value="op2" [ngrxFormControlState]="state()" checked="checked" />
    <input type="radio" value="op3" [ngrxFormControlState]="state()" name="customName" />
    <input type="radio" value="op4" [ngrxFormControlState]="state()" [name]="boundName" />
  `,
})
export class TestComponent {
  public readonly boundName = 'boundName';

  public readonly state = input<FormControlState<any>>(INITIAL_STATE);
}

describe(ControlNameDirective.name, () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let nativeElement: HTMLElement;
  beforeEach(() => {
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  it('should set the name of the elements to the ID of the state if the name is not already set', () => {
    const element1 = nativeElement.querySelectorAll('input')[0];
    expect(element1.name).toBe(TEST_ID);

    const element2 = nativeElement.querySelectorAll('input')[1];
    expect(element2.name).toBe(TEST_ID);
  });

  it('should not set the name of the element to the ID of the state if the name is set in template manually', () => {
    const element = nativeElement.querySelectorAll('input')[2];
    expect(element.name).toBe('customName');
  });

  it('should not set the name of the element to the ID of the state if the name is set in template via binding', () => {
    const element = nativeElement.querySelectorAll('input')[3];
    expect(element.name).toBe(component.boundName);
  });

  it("should set the name of the elements when the state's ID changes and the name was set previously", () => {
    const newId = 'new ID';

    fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: newId });
    fixture.detectChanges();

    const element1 = nativeElement.querySelectorAll('input')[0];
    expect(element1.name).toBe(newId);

    const element2 = nativeElement.querySelectorAll('input')[1];
    expect(element2.name).toBe(newId);
  });

  it("should not set the name of the elements when the state's ID changes and the name was not set previously due to manual value", () => {
    const newId = 'new ID';
    fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: newId });
    fixture.detectChanges();

    const element = nativeElement.querySelectorAll('input')[2];
    expect(element.name).toBe('customName');
  });

  it("should not set the name of the elements when the state's ID changes and the name was not set previously due to other binding", () => {
    const newId = 'new ID';
    fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: newId });
    fixture.detectChanges();

    const element = nativeElement.querySelectorAll('input')[3];
    expect(element.name).toBe(component.boundName);
  });

  it('should not set the name of the elements if the ID of the state does not change', () => {
    const renderer = fixture.componentRef.injector.get(Renderer2);
    const setProperty = vi.spyOn(renderer, 'setProperty');

    fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: `${TEST_ID}1` });
    fixture.detectChanges();

    expect(setProperty).toHaveBeenCalledWith(expect.anything(), 'name', `${TEST_ID}1`);
    setProperty.mockClear();

    fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: `${TEST_ID}1` });
    fixture.detectChanges();

    expect(setProperty).not.toHaveBeenCalled();
  });
});
