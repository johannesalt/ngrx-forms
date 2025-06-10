import { Boxed, unbox, ValidationErrors } from 'ngrx-form-state';

export interface RequiredValidationError<T> {
  actual: T | null | undefined;
}

declare module 'ngrx-form-state' {
  export interface ValidationErrors {
    required?: RequiredValidationError<any>;
  }
}

/**
 * A validation function that requires the value to be non-`undefined`, non-'null',
 * and non-empty.
 *
 * The validation error returned by this validation function has the following shape:
 *
```typescript
{
  required: {
    actual: T | null | undefined;
  };
}
```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
```typescript
updateGroup<MyFormValue>({
  name: validate(required),
})
```
 */
export function required<T>(value: T | Boxed<T> | null | undefined): ValidationErrors {
  value = unbox(value) as T | null | undefined;

  if (value !== undefined && value !== null && (value as any).length !== 0) {
    return {};
  }

  return {
    required: {
      actual: value,
    },
  };
}
