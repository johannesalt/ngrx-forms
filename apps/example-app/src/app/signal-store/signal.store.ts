import { computed, untracked } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { box, Boxed, disable, enable, updateGroup, validate } from 'ngrx-form-state';
import { withForm, withOnStateChange } from 'ngrx-form-state/signals';
import { equalTo, minLength, required, requiredTrue } from 'ngrx-form-state/validation';

export interface PasswordValue {
  password: string;
  confirmPassword: string;
}

export interface FormValue {
  userName: string;
  createAccount: boolean;
  password: PasswordValue;
  sex: string;
  favoriteColor: string;
  hobbies: Boxed<string[]>;
  dateOfBirth: string;
  agreeToTermsOfUse: boolean;
}

export const INITIAL_VALUE: FormValue = {
  agreeToTermsOfUse: false,
  createAccount: true,
  dateOfBirth: new Date(Date.UTC(1970, 0, 1)).toISOString(),
  favoriteColor: '',
  hobbies: box([]),
  password: {
    confirmPassword: '',
    password: '',
  },
  sex: '',
  userName: '',
};

const validateFn = updateGroup<FormValue>({
  agreeToTermsOfUse: validate(requiredTrue),
  password: (state, parentState) => {
    if (!parentState.value.createAccount) {
      return disable(state);
    }

    state = enable(state);
    return updateGroup<PasswordValue>(state, {
      password: validate(required, minLength(8)),
      confirmPassword: validate(equalTo(state.value.password)),
    });
  },
  userName: validate(required),
});

export const SignalFormState = signalStore(
  withState<{ submittedValue: FormValue | undefined }>({ submittedValue: undefined }),
  withForm('signalStore', INITIAL_VALUE, withOnStateChange(validateFn)),
  withComputed(({ form }) => ({
    resetDisabled: computed(() => {
      const f = form();
      return f.isPristine || f.isUntouched || f.isUnsubmitted;
    }),
    submitDisabled: computed(() => {
      const f = form();
      return f.isPristine || f.isInvalid || f.isSubmitted;
    }),
  })),
  withMethods((store) => {
    return {
      submit: () => {
        const { id } = untracked(store.form);

        store.markAsSubmitted(id);
        patchState(store, (state) => ({ submittedValue: state.form.value }));
      },
    };
  }),
);
