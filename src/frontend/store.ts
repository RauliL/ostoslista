import { applyMiddleware, createStore } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';

import reducer from './reducer';
import { State } from './state';

export const store = createStore(
  reducer,
  applyMiddleware(thunk as ThunkMiddleware<State>)
);

export default store;
