import { FormConfig } from './config';
import { withUpdate } from './with-update';

describe('withUpdate', () => {
  it('should add update function', () => {
    const initial: FormConfig<number | null> = { name: 'form', stateChangeFnArray: [], updateFnArray: [] };

    const fn = vi.fn();
    const config = withUpdate<number | null>(fn)(initial);
    expect(config).not.toBe(initial);
    expect(config.stateChangeFnArray).toHaveLength(0);
    expect(config.updateFnArray).toEqual([fn]);
  });

  it('should add update function at the end of the array', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const fn3 = vi.fn();

    const initial: FormConfig<number | null> = { name: 'form', stateChangeFnArray: [], updateFnArray: [fn1, fn2] };

    const config = withUpdate<number | null>(fn3)(initial);
    expect(config).not.toBe(initial);
    expect(config.stateChangeFnArray).toHaveLength(0);
    expect(config.updateFnArray).toEqual([fn1, fn2, fn3]);
  });
});
