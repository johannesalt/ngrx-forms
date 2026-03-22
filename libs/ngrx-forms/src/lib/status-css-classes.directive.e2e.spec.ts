import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFormGroupState } from './state';
import { NGRX_STATUS_CLASS_NAMES, NgrxStatusCssClassesDirective } from './status-css-classes.directive';

const FORM_CONTROL_ID = 'test ID';
const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, { inner: 'A' });

@Component({
  imports: [NgrxStatusCssClassesDirective],
  template: `
    @if (state(); as state) {
      <form [ngrxFormState]="state">
        <input type="text" [ngrxFormControlState]="state.controls.inner" />
        <select [ngrxFormControlState]="state.controls.inner">
          <option value="A">A</option>
        </select>
      </form>
    }
  `,
})
export class TestComponent {
  public readonly state = input(INITIAL_STATE);
}

describe(NgrxStatusCssClassesDirective.name, () => {
  let fixture: ComponentFixture<TestComponent>;
  let formElement: HTMLFormElement;
  let inputElement: HTMLInputElement;
  let selectElement: HTMLSelectElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    formElement = nativeElement.querySelector('form')!;
    inputElement = nativeElement.querySelector('input')!;
    selectElement = nativeElement.querySelector('select')!;
  });

  describe('should select the correct classes for isValid', () => {
    it('for form elements', () => {
      expect(formElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isValid);
      expect(formElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isInvalid);
    });

    it('for input elements', () => {
      expect(inputElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isValid);
      expect(inputElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isInvalid);
    });

    it('for select elements', () => {
      expect(selectElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isValid);
      expect(selectElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isInvalid);
    });
  });

  describe('should select the correct classes for isInvalid', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('state', {
        ...INITIAL_STATE,
        errors: {
          _inner: {
            required: { actual: true },
          },
        },
        isValid: false,
        isInvalid: true,
        controls: {
          ...INITIAL_STATE.controls,
          inner: {
            ...INITIAL_STATE.controls.inner,
            errors: {
              required: { actual: true },
            },
            isValid: false,
            isInvalid: true,
          },
        },
      });
      fixture.detectChanges();
    });

    it('for form elements', () => {
      expect(formElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isValid);
      expect(formElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isInvalid);
    });

    it('for input elements', () => {
      expect(inputElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isValid);
      expect(inputElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isInvalid);
    });

    it('for select elements', () => {
      expect(selectElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isValid);
      expect(selectElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isInvalid);
    });
  });

  describe('should select the correct classes for isDirty', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('state', {
        ...INITIAL_STATE,
        isDirty: true,
        isPristine: false,
        controls: {
          ...INITIAL_STATE.controls,
          inner: {
            ...INITIAL_STATE.controls.inner,
            isDirty: true,
            isPristine: false,
          },
        },
      });
      fixture.detectChanges();
    });

    it('for form elements', () => {
      expect(formElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isDirty);
      expect(formElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isPristine);
    });

    it('for input elements', () => {
      expect(inputElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isDirty);
      expect(inputElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isPristine);
    });

    it('for select elements', () => {
      expect(selectElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isDirty);
      expect(selectElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isPristine);
    });
  });

  describe('should select the correct classes for isPristine', () => {
    it('for form elements', () => {
      expect(formElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isDirty);
      expect(formElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isPristine);
    });

    it('for input elements', () => {
      expect(inputElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isDirty);
      expect(inputElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isPristine);
    });

    it('for select elements', () => {
      expect(selectElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isDirty);
      expect(selectElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isPristine);
    });
  });

  describe('should select the correct classes for isTouched', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('state', {
        ...INITIAL_STATE,
        isTouched: true,
        isUntouched: false,
        controls: {
          ...INITIAL_STATE.controls,
          inner: {
            ...INITIAL_STATE.controls.inner,
            isTouched: true,
            isUntouched: false,
          },
        },
      });
      fixture.detectChanges();
    });

    it('for form elements', () => {
      expect(formElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isTouched);
      expect(formElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isUntouched);
    });

    it('for input elements', () => {
      expect(inputElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isTouched);
      expect(inputElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isUntouched);
    });

    it('for select elements', () => {
      expect(selectElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isTouched);
      expect(selectElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isUntouched);
    });
  });

  describe('should select the correct classes for isUntouched', () => {
    it('for form elements', () => {
      expect(formElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isTouched);
      expect(formElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isUntouched);
    });

    it('for input elements', () => {
      expect(inputElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isTouched);
      expect(inputElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isUntouched);
    });

    it('for select elements', () => {
      expect(selectElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isTouched);
      expect(selectElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isUntouched);
    });
  });

  describe('should select the correct classes for isSubmitted', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('state', {
        ...INITIAL_STATE,
        isSubmitted: true,
        isUnsubmitted: false,
        controls: {
          ...INITIAL_STATE.controls,
          inner: {
            ...INITIAL_STATE.controls.inner,
            isSubmitted: true,
            isUnsubmitted: false,
          },
        },
      });
      fixture.detectChanges();
    });

    it('for form elements', () => {
      expect(formElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isSubmitted);
      expect(formElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isUnsubmitted);
    });

    it('for input elements', () => {
      expect(inputElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isSubmitted);
      expect(inputElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isUnsubmitted);
    });

    it('for select elements', () => {
      expect(selectElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isSubmitted);
      expect(selectElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isUnsubmitted);
    });
  });

  describe('should select the correct classes for isUnsubmitted', () => {
    it('for form elements', () => {
      expect(formElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isSubmitted);
      expect(formElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isUnsubmitted);
    });

    it('for input elements', () => {
      expect(inputElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isSubmitted);
      expect(inputElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isUnsubmitted);
    });

    it('for select elements', () => {
      expect(selectElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isSubmitted);
      expect(selectElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isUnsubmitted);
    });
  });

  describe('should select the correct classes for isValidationPending', () => {
    const markAsValidationPending = () => {
      fixture.componentRef.setInput('state', {
        ...INITIAL_STATE,
        pendingValidations: ['test'],
        isValidationPending: true,
        controls: {
          ...INITIAL_STATE.controls,
          inner: {
            ...INITIAL_STATE.controls.inner,
            pendingValidations: ['test'],
            isValidationPending: true,
          },
        },
      });
      fixture.detectChanges();
    };

    it('for form elements', () => {
      expect(formElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isValidationPending);
      markAsValidationPending();
      expect(formElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isValidationPending);
    });

    it('for input elements', () => {
      expect(inputElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isValidationPending);
      markAsValidationPending();
      expect(inputElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isValidationPending);
    });

    it('for select elements', () => {
      expect(selectElement.classList).not.toContain(NGRX_STATUS_CLASS_NAMES.isValidationPending);
      markAsValidationPending();
      expect(selectElement.classList).toContain(NGRX_STATUS_CLASS_NAMES.isValidationPending);
    });
  });
});
