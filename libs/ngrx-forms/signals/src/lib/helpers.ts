import { FormConfig, FormConfigFn } from './config';

/**
 * Applies all specified functions and return form configuration.
 * @param {FormConfigFn[]} configFnArray A list of functions to apply on configuration.
 * @returns {FormConfig} The form configuration.
 */
export function getConfig<Value, Name extends string>(configFnArray: FormConfigFn<Value, Name>[]): FormConfig<Value, Name> {
  return configFnArray.reduce((config, fn) => fn(config), <FormConfig<Value, Name>>{ name: 'form' as Name, stateChangeFnArray: [], updateFnArray: [] });
}
