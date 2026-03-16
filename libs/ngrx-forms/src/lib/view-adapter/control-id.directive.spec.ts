import { Component, input, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFormControlState, FormControlState } from '../state';
import { ControlIdDirective } from './control-id.directive';

const TEST_ID = 'test ID';
const INITIAL_STATE = createFormControlState<any>(TEST_ID, undefined);

@Component({
  imports: [ControlIdDirective],
  template: `
    <input [ngrxFormControlState]="state()" type="text" />
    <input [ngrxFormControlState]="state()" type="text" id="customId" />
    <input [ngrxFormControlState]="state()" type="text" [id]="boundId" />
  `,
})
export class TestComponent {
  public readonly boundId = 'boundId';

  public readonly state = input<FormControlState<any>>(INITIAL_STATE);
}

describe(ControlIdDirective.name, () => {
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

  it('should set the ID of the element to the ID of the state if the ID is not already set', () => {
    const element = nativeElement.querySelectorAll('input')[0];
    expect(element.id).toBe(TEST_ID);
  });

  it('should not set the ID of the element to the ID of the state if the ID is set in template manually', () => {
    const element = nativeElement.querySelectorAll('input')[1];
    expect(element.id).toBe('customId');
  });

  it('should not set the ID of the element to the ID of the state if the ID is set in template via binding', () => {
    const element = nativeElement.querySelectorAll('input')[2];
    expect(element.id).toBe(component.boundId);
  });
  
  it('should set the ID of the element if the ID of the state changes and the ID was set previously', () => {
    const newId = 'new ID';

    fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: newId });
    fixture.detectChanges();

    const element = nativeElement.querySelectorAll('input')[0];
    expect(element.id).toBe(newId);
  });

  it('should not set the ID of the element if the ID of the state changes and the ID was not set previously due to manual value', () => {
    const newId = 'new ID';
    
    fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: newId });
    fixture.detectChanges();

    const element = nativeElement.querySelectorAll('input')[1];
    expect(element.id).toBe('customId');
  });

  it('should not set the ID of the element if the ID of the state changes and the ID was not set previously due to other binding', () => {
    const newId = 'new ID';
    
    fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: newId });
    fixture.detectChanges();

    const element = nativeElement.querySelectorAll('input')[2];
    expect(element.id).toBe(component.boundId);
  });

  it('should not set the ID of the element if the ID of the state does not change', () => {
    const renderer = fixture.componentRef.injector.get(Renderer2);
    const setProperty = vi.spyOn(renderer, 'setProperty');

    fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: `${TEST_ID}1`, value: 1 });
    fixture.detectChanges();

    expect(setProperty).toHaveBeenCalledWith(expect.anything(), 'id', `${TEST_ID}1`);
    setProperty.mockClear();

    fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: `${TEST_ID}1`, value: 2 });
    fixture.detectChanges();

    expect(setProperty).not.toHaveBeenCalled();
  });
});
