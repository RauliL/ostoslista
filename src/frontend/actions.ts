import axios, { AxiosError } from 'axios';
import actionCreatorFactory from 'typescript-fsa';

import { Item } from '../common/types';

import { Dispatch } from './state';

const actionCreator = actionCreatorFactory();
const apiClient = axios.create({ baseURL: '/api' });

export const listAction = actionCreator.async<
  void,
  Item[],
  AxiosError
>('list');
export const createAction = actionCreator.async<
  string,
  Item,
  AxiosError
>('create');
export const updateAction = actionCreator.async<
  Item,
  Item,
  AxiosError
>('update');
export const deleteAction = actionCreator.async<
  Item,
  void,
  AxiosError
>('delete');

/**
 * Attempts to retrieve list of shopping list items from the API.
 */
export const listItems = () => (dispatch: Dispatch) => {
  dispatch(listAction.started());

  return apiClient.get('/')
    .then((response) => dispatch(listAction.done({
      result: response.data,
    })))
    .catch((error) => dispatch(listAction.failed({
      error,
    })));
};

/**
 * Attempts to create new shopping list item from the given text.
 */
export const createItem = (text: string) => (dispatch: Dispatch) => {
  // Do not allow creation of empty items.
  if (/^\s*$/.test(text)) {
    return;
  }

  dispatch(createAction.started(text));

  return apiClient.put('/', { text })
    .then((response) => dispatch(createAction.done({
      params: text,
      result: response.data,
    })))
    .catch((error) => dispatch(createAction.failed({
      params: text,
      error,
    })));
};

/**
 * Attempts to update given shopping list item which already exists in the API.
 */
export const updateItem = (item: Item) => (dispatch: Dispatch) => {
  dispatch(updateAction.started(item));

  return apiClient.patch(`/${item.id}`, item)
    .then((response) => dispatch(updateAction.done({
      params: item,
      result: response.data,
    })))
    .catch((error) => dispatch(updateAction.failed({
      params: item,
      error,
    })));
};

/**
 * Attempts to delete give shopping list item from the API.
 */
export const deleteItem = (item: Item) => (dispatch: Dispatch) => {
  dispatch(deleteAction.started(item));

  return apiClient.delete(`/${item.id}`)
    .then((response) => dispatch(deleteAction.done({
      params: item,
      result: response.data,
    })))
    .catch((error) => dispatch(deleteAction.failed({
      params: item,
      error,
    })));
};
