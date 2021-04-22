import axios from 'axios';
import { values } from 'lodash';
import { v4 as uuid } from 'uuid';

import { Entry } from './types';

const client = axios.create({ baseURL: '/api' });

export const getAllEntries = (): Promise<Entry[]> =>
  client
    .get<Record<string, Entry>>('/')
    .then((response) => values(response.data));

export const createEntry = (text: string): Promise<Entry> => {
  const id = uuid(); // TODO: Let the API generate IDs instead.

  return client
    .post<Entry>(`/${id}`, { id, text, done: false })
    .then((response) => response.data);
};

export const patchEntry = (entry: Entry): Promise<Entry> =>
  client.patch<Entry>(`/${entry.id}`, entry).then((response) => response.data);

export const deleteEntry = (entry: Entry): Promise<Entry> =>
  client.delete(`/${entry.id}`);
