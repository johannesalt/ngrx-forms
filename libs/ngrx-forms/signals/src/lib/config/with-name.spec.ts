import { FormConfig } from './config';
import { withName } from './with-name';

describe('withName', () => {
  it('should set the name', () => {
    type Name = 'signalForm';

    const initial: FormConfig<number, Name> = { name: 'form' as Name, stateChangeFnArray: [], updateFnArray: [] };

    const config = withName<number, Name>('signalForm')(initial);
    expect(config).not.toBe(initial);
    expect(config.name).toBe('signalForm');
  });
});
