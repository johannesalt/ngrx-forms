import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { box, isArrayState, isFormState, isGroupState } from 'ngrx-form-state';
import { withFormState } from './state';
import { withName } from './config';

describe('withFormState', () => {
  describe('form array', () => {
    describe(() => {
      const State = signalStore({ providedIn: 'root' }, withFormState('array', [1, 2, 3, 4, 5]));

      it('should create array state', () => {
        const store = TestBed.inject(State);

        const form = store.form();
        expect(isArrayState(form)).toBe(true);
      });
    });

    describe('withName', () => {
      const State = signalStore({ providedIn: 'root' }, withFormState('array', [1, 2, 3, 4, 5], withName('test')));

      it('should create array state', () => {
        const store = TestBed.inject(State);

        const form = store.test();
        expect(isArrayState(form)).toBe(true);
      });
    });
  });

  describe('form control', () => {
    describe(() => {
      const State = signalStore({ providedIn: 'root' }, withFormState('control', 4));

      it('should create control state', () => {
        const store = TestBed.inject(State);

        const form = store.form();
        expect(isArrayState(form)).toBe(false);
        expect(isGroupState(form)).toBe(false);
        expect(isFormState(form)).toBe(true);
      });
    });

    describe('boxed', () => {
      const State = signalStore({ providedIn: 'root' }, withFormState('control', box([1, 2, 3])));

      it('should create control state', () => {
        const store = TestBed.inject(State);

        const form = store.form();
        expect(isArrayState(form)).toBe(false);
        expect(isGroupState(form)).toBe(false);
        expect(isFormState(form)).toBe(true);
      });
    });

    describe('withName', () => {
      const State = signalStore({ providedIn: 'root' }, withFormState('control', 4, withName('test')));

      it('should create control state', () => {
        const store = TestBed.inject(State);

        const form = store.test();
        expect(isArrayState(form)).toBe(false);
        expect(isGroupState(form)).toBe(false);
        expect(isFormState(form)).toBe(true);
      });
    });
  });

  describe('form group', () => {
    describe(() => {
      const State = signalStore({ providedIn: 'root' }, withFormState('group', { id: 1, name: 'John Doe' }));

      it('should create group state', () => {
        const store = TestBed.inject(State);

        const form = store.form();
        expect(isGroupState(form)).toBe(true);
      });
    });

    describe('withName', () => {
      const State = signalStore({ providedIn: 'root' }, withFormState('group', { id: 1, name: 'John Doe' }, withName('test')));

      it('should create group state', () => {
        const store = TestBed.inject(State);

        const form = store.test();
        expect(isGroupState(form)).toBe(true);
      });
    });
  });
});
