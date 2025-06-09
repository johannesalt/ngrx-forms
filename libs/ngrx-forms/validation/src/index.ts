/**
 * ngrx-forms
 * Proper integration of forms in Angular applications using Ngrx
 * Written by Jonathan Ziller.
 * MIT license.
 * https://github.com/MrWolfZ/ngrx-forms
 */
export { email, EmailValidationError } from './lib/email';
export { equalTo, EqualToValidationError } from './lib/equal-to';
export { greaterThan, GreaterThanValidationError } from './lib/greater-than';
export { greaterThanOrEqualTo, GreaterThanOrEqualToValidationError } from './lib/greater-than-or-equal-to';
export { lessThan, LessThanValidationError } from './lib/less-than';
export { lessThanOrEqualTo, LessThanOrEqualToValidationError } from './lib/less-than-or-equal-to';
export { maxLength, MaxLengthValidationError } from './lib/max-length';
export { minLength, MinLengthValidationError } from './lib/min-length';
export { notEqualTo, NotEqualToValidationError } from './lib/not-equal-to';
export { pattern, PatternValidationError } from './lib/pattern';
export { required, RequiredValidationError } from './lib/required';
export { number, NumberValidationError } from './lib/number';
export { requiredFalse } from './lib/required-false';
export { requiredTrue } from './lib/required-true';
