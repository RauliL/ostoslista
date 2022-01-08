import axios from 'axios';

import { Entry, SavedEntry } from './types';

const client = axios.create({ baseURL: '/api' });

export const getAllEntries = (): Promise<SavedEntry[]> =>
  client
    .get<Record<string, Entry>>('/')
    .then((response) =>
      Object.entries(response.data).map(([id, entry]) => ({ ...entry, id }))
    );

export const createEntry = (text: string): Promise<string> =>
  client
    .post<{ key: string }>('/', { text, done: false })
    .then((response) => response.data.key);

export const patchEntry = (id: string, entry: Entry): Promise<Entry> =>
  client.patch<Entry>(`/${id}`, entry).then((response) => response.data);

export const deleteEntry = (id: string): Promise<Entry> =>
  client.delete<Entry>(`/${id}`).then((response) => response.data);
