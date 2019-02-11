import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Item } from '../common/types';

export interface State {
  isLoadingItems: boolean;
  isUnableToLoadItems: boolean;
  items: Item[];
}

export type Dispatch = ThunkDispatch<State, void, AnyAction>;
