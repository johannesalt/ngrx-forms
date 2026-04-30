import { FormConfig } from './config';
import { withOnStateChange } from './with-on-state-change';

describe('withOnStateChange', () => {
  it('should add onStateChange function', () => {
    const initial: FormConfig<number | null> = { name: 'form', stateChangeFnArray: [], updateFnArray: [] };

    const fn = vi.fn();
    const config = withOnStateChange<number | null>(fn)(initial);
    expect(config).not.toBe(initial);
    expect(config.stateChangeFnArray).toEqual([fn]);
    expect(config.updateFnArray).toHaveLength(0);
  });

  it('should add onStateChange function at the end of the array', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const fn3 = vi.fn();

    const initial: FormConfig<number | null> = { name: 'form', stateChangeFnArray: [fn1, fn2], updateFnArray: [] };

    const config = withOnStateChange<number | null>(fn3)(initial);
    expect(config).not.toBe(initial);
    expect(config.stateChangeFnArray).toEqual([fn1, fn2, fn3]);
    expect(config.updateFnArray).toHaveLength(0);
  });
});
