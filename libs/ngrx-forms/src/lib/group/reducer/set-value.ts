import { Actions, SetValueAction } from '../../actions';
import { formStateReducer } from '../../reducer';
import { AbstractControlState, computeGroupState, createChildState, FormGroupControls, FormGroupState, KeyValue } from '../../state';
import { childReducer } from './util';

export function setValueReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== SetValueAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.value === action.value) {
    return state;
  }

  if (action.value instanceof Date) {
    throw new Error('Date values are not supported. Please used serialized strings instead.');
  }

  const value = action.value;

  const controls = Object.keys(value)
    .reduce((c, key) => {
      const control = state.controls[key] as AbstractControlState<unknown> | undefined;

      // tslint:disable-next-line:prefer-conditional-expression
      if (!control) {
        Object.assign(c, { [key]: createChildState<TValue[string]>(`${state.id}.${key}`, value[key]) });
      } else {
        Object.assign(c, { [key]: formStateReducer(control, new SetValueAction((control as AbstractControlState<unknown>).id, value[key])) });
      }
      return c;
    }, {} as FormGroupControls<TValue>);

  return computeGroupState(
    state.id,
    controls,
    value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
    {
      wasOrShouldBeDirty: state.isDirty,
      wasOrShouldBeEnabled: state.isEnabled,
      wasOrShouldBeTouched: state.isTouched,
      wasOrShouldBeSubmitted: state.isSubmitted,
    },
  );
}
