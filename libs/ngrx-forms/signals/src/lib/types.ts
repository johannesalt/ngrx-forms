import { FormActionDispatcher, FormState } from 'ngrx-form-state';

export type SignalFormState<Value, Key extends string> = {
  [K in string as `${Key}`]: FormState<Value>;
};

export type SignalFormMethods = FormActionDispatcher & Record<string, any>;

export type SignalFormProps = object;
