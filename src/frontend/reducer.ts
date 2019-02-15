import { reducerWithInitialState } from 'typescript-fsa-reducers';

import {
  createAction,
  deleteAction,
  listAction,
  updateAction,
} from './actions';
import { State } from './state';

const initialState: State = {
  isLoadingItems: false,
  isUnableToLoadItems: false,
  items: [],
};

const reducer = reducerWithInitialState<State>(initialState)
  .case(listAction.started, (state) => ({
    ...state,
    isLoadingItems: true,
  }))
  .case(listAction.failed, (state) => ({
    ...state,
    isLoadingItems: false,
    isUnableToLoadItems: true,
  }))
  .caseWithAction(listAction.done, (state, action) => ({
    ...state,
    isLoadingItems: false,
    isUnableToLoadItems: false,
    items: action.payload.result,
  }))
  .caseWithAction(createAction.done, (state, action) => ({
    ...state,
    items: [...state.items, action.payload.result],
  }))
  .caseWithAction(updateAction.done, (state, action) => ({
    ...state,
    items: state.items.map((item) =>
      item.id === action.payload.params.id
        ? action.payload.result
        : item
    ),
  }))
  .caseWithAction(deleteAction.done, (state, action) => ({
    ...state,
    items: state.items.filter((item) => item.id !== action.payload.params.id),
  }));

export default reducer;
