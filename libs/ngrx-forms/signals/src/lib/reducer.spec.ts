import { TestBed } from '@angular/core/testing';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { Dispatcher } from '@ngrx/signals/events';
import { unprotected } from '@ngrx/signals/testing';
import { createFormArrayState, createFormControlState, createFormGroupState, FormState } from 'ngrx-form-state';
import { withName, withOnStateChange, withUpdate } from './config';
import {
  addArrayControl,
  addGroupControl,
  clearAsyncError,
  disable,
  enable,
  focus,
  markAsDirty,
  markAsPristine,
  markAsSubmitted,
  markAsTouched,
  markAsUnsubmitted,
  markAsUntouched,
  moveArrayControl,
  removeArrayControl,
  removeGroupControl,
  reset,
  setAsyncError,
  setErrors,
  setUserDefinedProperty,
  setValue,
  startAsyncValidation,
  swapArrayControl,
  unfocus,
} from './events';
import { withFormReducer } from './reducer';

const FORM_ARRAY_ID = 'array';
const FORM_ARRAY = createFormArrayState<number>(FORM_ARRAY_ID, [1, 2, 3, 4]);

const FORM_CONTROL_ID = 'control';
const FORM_CONTROL = createFormControlState<number>(FORM_CONTROL_ID, 1);

const FORM_GROUP_ID = 'group';
const FORM_GROUP = createFormGroupState(FORM_GROUP_ID, { id: 1, name: 'Test' });

describe('withFormReducer', () => {
  describe('form array', () => {
    const State = signalStore({ providedIn: 'root' }, withFormReducer(), withState({ ['form']: FORM_ARRAY }));

    let dispatcher: Dispatcher;
    beforeEach(() => {
      dispatcher = TestBed.inject(Dispatcher);
    });

    it('should add control', () => {
      const store = TestBed.inject(State);

      dispatcher.dispatch(addArrayControl({ controlId: FORM_ARRAY_ID, value: 5 }));

      const form = store.form();
      expect(form.value).toEqual([1, 2, 3, 4, 5]);
    });

    it('should move control', () => {
      const store = TestBed.inject(State);

      dispatcher.dispatch(moveArrayControl({ controlId: FORM_ARRAY_ID, fromIndex: 1, toIndex: 3 }));

      const form = store.form();
      expect(form.value).toEqual([1, 3, 4, 2]);
    });

    it('should swap control', () => {
      const store = TestBed.inject(State);

      dispatcher.dispatch(swapArrayControl({ controlId: FORM_ARRAY_ID, fromIndex: 0, toIndex: 2 }));

      const form = store.form();
      expect(form.value).toEqual([3, 2, 1, 4]);
    });

    it('should remove control', () => {
      const store = TestBed.inject(State);

      dispatcher.dispatch(removeArrayControl({ controlId: FORM_ARRAY_ID, index: 1 }));

      const form = store.form();
      expect(form.value).toEqual([1, 3, 4]);
    });
  });

  describe('form control', () => {
    const State = signalStore({ providedIn: 'root' }, withFormReducer(), withState({ ['form']: FORM_CONTROL }));

    let dispatcher: Dispatcher;
    beforeEach(() => {
      dispatcher = TestBed.inject(Dispatcher);
    });

    it('should remove async error', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, pendingValidations: ['min', 'max'] } });

      dispatcher.dispatch(clearAsyncError({ controlId: FORM_CONTROL_ID, name: 'min' }));

      const form = store.form();
      expect(form.pendingValidations).toEqual(['max']);
    });

    it('should disable', () => {
      const store = TestBed.inject(State);

      dispatcher.dispatch(disable({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isEnabled).toBe(false);
      expect(form.isDisabled).toBe(true);
    });

    it('should enable', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isDisabled: true, isEnabled: false } });

      dispatcher.dispatch(enable({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isEnabled).toBe(true);
      expect(form.isDisabled).toBe(false);
    });

    it('should set the focus status to true', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isFocused: false, isUnfocused: true } });

      dispatcher.dispatch(focus({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isFocused).toBe(true);
      expect(form.isUnfocused).toBe(false);
    });

    it('should set the dirty status to true', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isDirty: false, isPristine: true } });

      dispatcher.dispatch(markAsDirty({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isDirty).toBe(true);
      expect(form.isPristine).toBe(false);
    });

    it('should set the dirty status to false', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isDirty: true, isPristine: false } });

      dispatcher.dispatch(markAsPristine({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isDirty).toBe(false);
      expect(form.isPristine).toBe(true);
    });

    it('should set the submit status to true', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isSubmitted: false, isUnsubmitted: true } });

      dispatcher.dispatch(markAsSubmitted({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isSubmitted).toBe(true);
      expect(form.isUnsubmitted).toBe(false);
    });

    it('should set the touch status to true', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isTouched: false, isUntouched: true } });

      dispatcher.dispatch(markAsTouched({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isTouched).toBe(true);
      expect(form.isUntouched).toBe(false);
    });

    it('should set the submit status to false', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isSubmitted: true, isUnsubmitted: false } });

      dispatcher.dispatch(markAsUnsubmitted({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isSubmitted).toBe(false);
      expect(form.isUnsubmitted).toBe(true);
    });

    it('should set the touch status to false', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isTouched: true, isUntouched: false } });

      dispatcher.dispatch(markAsUntouched({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isTouched).toBe(false);
      expect(form.isUntouched).toBe(true);
    });

    it('should reset the touch and dirty status', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isDirty: true, isPristine: false, isTouched: true, isUntouched: false } });

      dispatcher.dispatch(reset({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isDirty).toBe(false);
      expect(form.isPristine).toBe(true);
      expect(form.isTouched).toBe(false);
      expect(form.isUntouched).toBe(true);
    });

    it('should set async error', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), {
        form: { ...FORM_CONTROL, isInvalid: false, isValid: true, isValidationPending: true, pendingValidations: ['required'] },
      });

      dispatcher.dispatch(setAsyncError({ controlId: FORM_CONTROL_ID, name: 'required', value: { actual: null } }));

      const form = store.form();
      expect(form.errors).toEqual({ $required: { actual: null } });
      expect(form.isInvalid).toBe(true);
      expect(form.isValid).toBe(false);
      expect(form.isValidationPending).toBe(false);
      expect(form.pendingValidations).toEqual([]);
    });

    it('should set errors', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, errors: {}, isInvalid: false, isValid: true } });

      dispatcher.dispatch(setErrors({ controlId: FORM_CONTROL_ID, errors: { required: { actual: null } } }));

      const form = store.form();
      expect(form.errors).toEqual({ required: { actual: null } });
      expect(form.isInvalid).toBe(true);
      expect(form.isValid).toBe(false);
    });

    it('should set user defined property', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, userDefinedProperties: {} } });

      dispatcher.dispatch(setUserDefinedProperty({ controlId: FORM_CONTROL_ID, name: 'allowedValues', value: ['foo', 'bar'] }));

      const form = store.form();
      expect(form.userDefinedProperties).toEqual({ allowedValues: ['foo', 'bar'] });
    });

    it('should value to 4', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, userDefinedProperties: {} } });

      dispatcher.dispatch(setValue({ controlId: FORM_CONTROL_ID, value: 4 }));

      const form = store.form();
      expect(form.value).toBe(4);
    });

    it('should set validation pending status to true', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isInvalid: false, isValid: true, isValidationPending: false, pendingValidations: [] } });

      dispatcher.dispatch(startAsyncValidation({ controlId: FORM_CONTROL_ID, name: 'required' }));

      const form = store.form();
      expect(form.isInvalid).toBe(false);
      expect(form.isValid).toBe(true);
      expect(form.isValidationPending).toBe(true);
      expect(form.pendingValidations).toEqual(['required']);
    });

    it('should set the focus status to false', () => {
      const store = TestBed.inject(State);
      patchState(unprotected(store), { form: { ...FORM_CONTROL, isFocused: true, isUnfocused: false } });

      dispatcher.dispatch(unfocus({ controlId: FORM_CONTROL_ID }));

      const form = store.form();
      expect(form.isFocused).toBe(false);
      expect(form.isUnfocused).toBe(true);
    });
  });

  describe('form group', () => {
    describe('withName', () => {
      const State = signalStore({ providedIn: 'root' }, withFormReducer(withName('user')), withState({ ['user']: FORM_GROUP }));

      let dispatcher: Dispatcher;
      beforeEach(() => {
        dispatcher = TestBed.inject(Dispatcher);
      });

      it('should add control', () => {
        const store = TestBed.inject(State);

        dispatcher.dispatch(addGroupControl({ controlId: FORM_GROUP_ID, name: 'password', value: 'password123' }));

        const form = store.user();
        expect((form.controls as any).password).toBeDefined();
        expect((form.controls as any).password.value).toBe('password123');
      });

      it('should set the dirty status to true', () => {
        const store = TestBed.inject(State);
        patchState(unprotected(store), { user: { ...FORM_GROUP, isDirty: false, isPristine: true } });

        dispatcher.dispatch(markAsDirty({ controlId: FORM_GROUP_ID }));

        const form = store.user();
        expect(form.isDirty).toBe(true);
        expect(form.isPristine).toBe(false);
      });

      it('should set the dirty status to false', () => {
        const store = TestBed.inject(State);
        patchState(unprotected(store), { user: { ...FORM_GROUP, isDirty: true, isPristine: false } });

        dispatcher.dispatch(markAsPristine({ controlId: FORM_GROUP_ID }));

        const form = store.user();
        expect(form.isDirty).toBe(false);
        expect(form.isPristine).toBe(true);
      });

      it('should set the submit status to true', () => {
        const store = TestBed.inject(State);
        patchState(unprotected(store), { user: { ...FORM_GROUP, isSubmitted: false, isUnsubmitted: true } });

        dispatcher.dispatch(markAsSubmitted({ controlId: FORM_GROUP_ID }));

        const form = store.user();
        expect(form.isSubmitted).toBe(true);
        expect(form.isUnsubmitted).toBe(false);
      });

      it('should set the submit status to false', () => {
        const store = TestBed.inject(State);
        patchState(unprotected(store), { user: { ...FORM_GROUP, isSubmitted: true, isUnsubmitted: false } });

        dispatcher.dispatch(markAsUnsubmitted({ controlId: FORM_GROUP_ID }));

        const form = store.user();
        expect(form.isSubmitted).toBe(false);
        expect(form.isUnsubmitted).toBe(true);
      });

      it('should remove control', () => {
        const store = TestBed.inject(State);

        dispatcher.dispatch(removeGroupControl({ controlId: FORM_GROUP_ID, name: 'name' }));

        const form = store.user();
        expect(form.controls.name).toBeUndefined();
      });
    });

    describe('withOnStateChange', () => {
      let dispatcher: Dispatcher;
      beforeEach(() => {
        dispatcher = TestBed.inject(Dispatcher);
      });

      it('should call function when form state is changed', () => {
        const fn1 = vi.fn((state: FormState<any>) => state);

        const State = signalStore({ providedIn: 'root' }, withFormReducer(withOnStateChange(fn1)), withState({ ['form']: FORM_GROUP }));
        TestBed.inject(State);

        dispatcher.dispatch(setValue({ controlId: `${FORM_GROUP_ID}.name`, value: 'John Doe' }));

        expect(fn1).toHaveBeenCalled();
      });

      it('should call functions according to their configured sequence when form state is changed', () => {
        const fn1 = vi.fn((state: FormState<any>) => state);
        const fn2 = vi.fn((state: FormState<any>) => state);

        const State = signalStore({ providedIn: 'root' }, withFormReducer(withOnStateChange(fn1), withOnStateChange(fn2)), withState({ ['form']: FORM_GROUP }));
        TestBed.inject(State);

        dispatcher.dispatch(setValue({ controlId: `${FORM_GROUP_ID}.name`, value: 'John Doe' }));

        expect(fn1).toHaveBeenCalled();
        expect(fn2).toHaveBeenCalledAfter(fn1);
      });

      it('should not call function when form state is unchanged', () => {
        const fn = vi.fn((state: FormState<any>) => state);

        const State = signalStore({ providedIn: 'root' }, withFormReducer(withOnStateChange(fn)), withState({ ['form']: FORM_GROUP }));
        TestBed.inject(State);

        dispatcher.dispatch(markAsPristine({ controlId: FORM_GROUP_ID }));

        expect(fn).not.toHaveBeenCalled();
      });
    });

    describe('withUpdate', () => {
      let dispatcher: Dispatcher;
      beforeEach(() => {
        dispatcher = TestBed.inject(Dispatcher);
      });

      it('should call function when form state is changed', () => {
        const fn1 = vi.fn((state: FormState<any>) => state);

        const State = signalStore({ providedIn: 'root' }, withFormReducer(withUpdate(fn1)), withState({ ['form']: FORM_GROUP }));
        TestBed.inject(State);

        dispatcher.dispatch(setValue({ controlId: `${FORM_GROUP_ID}.name`, value: 'John Doe' }));

        expect(fn1).toHaveBeenCalled();
      });

      it('should call functions according to their configured sequence when form state is changed', () => {
        const fn1 = vi.fn((state: FormState<any>) => state);
        const fn2 = vi.fn((state: FormState<any>) => state);

        const State = signalStore({ providedIn: 'root' }, withFormReducer(withUpdate(fn1), withUpdate(fn2)), withState({ ['form']: FORM_GROUP }));
        TestBed.inject(State);

        dispatcher.dispatch(setValue({ controlId: `${FORM_GROUP_ID}.name`, value: 'John Doe' }));

        expect(fn1).toHaveBeenCalled();
        expect(fn2).toHaveBeenCalledAfter(fn1);
      });

      it('should call function when form state is unchanged', () => {
        const fn = vi.fn((state: FormState<any>) => state);

        const State = signalStore({ providedIn: 'root' }, withFormReducer(withUpdate(fn)), withState({ ['form']: FORM_GROUP }));
        TestBed.inject(State);

        dispatcher.dispatch(markAsPristine({ controlId: FORM_GROUP_ID }));

        expect(fn).toHaveBeenCalled();
      });
    });
  });
});
