import { AbstractControlState, box, unbox, validate } from 'ngrx-form-state';
import { lessThanOrEqualTo } from './less-than-or-equal-to';

describe(lessThanOrEqualTo.name, () => {
  it('should throw for null comparand parameter', () => {
    expect(() => lessThanOrEqualTo(null as any)).toThrow();
  });

  it('should throw for undefined comparand parameter', () => {
    expect(() => lessThanOrEqualTo(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(lessThanOrEqualTo(1)(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(lessThanOrEqualTo(1)(undefined)).toEqual({});
  });

  it('should not return an error for non-numeric value', () => {
    expect(lessThanOrEqualTo(1)('string' as any)).toEqual({});
  });

  it('should return an error if value is greater than comparand', () => {
    expect(lessThanOrEqualTo(1)(2)).not.toEqual({});
  });

  it('should not return an error if value is equal to comparand', () => {
    expect(lessThanOrEqualTo(1)(1)).toEqual({});
  });

  it('should not return an error if value is less than comparand', () => {
    expect(lessThanOrEqualTo(1)(0)).toEqual({});
  });

  it('should return errors with comparand and actual properties', () => {
    const comparand = 1;
    const actual = 2;
    expect(lessThanOrEqualTo(comparand)(actual)).toEqual({
      lessThanOrEqualTo: {
        comparand,
        actual,
      },
    });
  });

  it('should not return an error if boxed value is less than comparand', () => {
    expect(lessThanOrEqualTo(1)(box(0))).toEqual({});
  });

  it('should return errors with comparand and actual properties for boxed values', () => {
    const comparand = 1;
    const actual = box(2);
    expect(lessThanOrEqualTo(comparand)(actual)).toEqual({
      lessThanOrEqualTo: {
        comparand,
        actual: unbox(actual),
      },
    });
  });

  // this code is never meant to be executed, it should just pass the type checker
  test.skip('should properly infer value type when used with validate update function', () => {
    const state: AbstractControlState<number> = undefined!;
    const v = validate(state, lessThanOrEqualTo(2));
    const v2: number = v.value;
    console.log(v2);
  });
});
