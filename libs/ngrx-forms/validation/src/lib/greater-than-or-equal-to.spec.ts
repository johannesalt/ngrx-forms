import { AbstractControlState, box, unbox, validate } from 'ngrx-form-state';
import { greaterThanOrEqualTo } from './greater-than-or-equal-to';

describe(greaterThanOrEqualTo.name, () => {
  it('should throw for null comparand parameter', () => {
    expect(() => greaterThanOrEqualTo(null as any)).toThrow();
  });

  it('should throw for undefined comparand parameter', () => {
    expect(() => greaterThanOrEqualTo(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(greaterThanOrEqualTo(1)(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(greaterThanOrEqualTo(1)(undefined)).toEqual({});
  });

  it('should not return an error for non-numeric value', () => {
    expect(greaterThanOrEqualTo(1)('string' as any)).toEqual({});
  });

  it('should not return an error if value is greater than comparand', () => {
    expect(greaterThanOrEqualTo(1)(2)).toEqual({});
  });

  it('should not return an error if value is equal to comparand', () => {
    expect(greaterThanOrEqualTo(1)(1)).toEqual({});
  });

  it('should return an error if value is less than comparand', () => {
    expect(greaterThanOrEqualTo(1)(0)).not.toEqual({});
  });

  it('should return errors with comparand and actual properties', () => {
    const comparand = 1;
    const actual = 0;
    expect(greaterThanOrEqualTo(comparand)(actual)).toEqual({
      greaterThanOrEqualTo: {
        comparand,
        actual,
      },
    });
  });

  it('should not return an error if boxed value is greater than comparand', () => {
    expect(greaterThanOrEqualTo(1)(box(2))).toEqual({});
  });

  it('should return errors with comparand and actual properties for boxed values', () => {
    const comparand = 1;
    const actual = box(0);
    expect(greaterThanOrEqualTo(comparand)(actual)).toEqual({
      greaterThanOrEqualTo: {
        comparand,
        actual: unbox(actual),
      },
    });
  });

  // this code is never meant to be executed, it should just pass the type checker
  test.skip('should properly infer value type when used with validate update function', () => {
    const state: AbstractControlState<number> = undefined!;
    const v = validate(state, greaterThanOrEqualTo(0));
    const v2: number = v.value;
    console.log(v2);
  });
});
