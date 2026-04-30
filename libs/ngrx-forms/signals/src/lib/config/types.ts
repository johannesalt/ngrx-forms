import { FormConfig } from './config';

/**
 * A function to configure the form state.
 */
export type FormConfigFn<Value, Name extends string = string> = (config: FormConfig<Value, Name>) => FormConfig<Value, Name>;
