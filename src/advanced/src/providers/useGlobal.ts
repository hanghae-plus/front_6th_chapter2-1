import { useContext } from 'react';
import { StateContext, DispatchContext } from './GlobalProvider';
import type { Action } from './GlobalReducer';

export const useGlobalState = () => {
  const state = useContext(StateContext);
  if (!state) throw new Error();

  return state;
};

export const useGlobalDispatch = () => {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) throw new Error();

  return dispatch as React.Dispatch<Action>;
};
