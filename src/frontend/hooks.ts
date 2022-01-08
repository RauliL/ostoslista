import { partition } from 'lodash';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { getAllEntries } from './api';
import { Entry } from './types';

export const useAllEntries = (): {
  todoEntries: Entry[];
  doneEntries: Entry[];
  error: Error | undefined;
} => {
  const { data, error } = useSWR('entries', getAllEntries);
  const [todoEntries, setTodoEntries] = useState<Entry[]>([]);
  const [doneEntries, setDoneEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (data != null) {
      const [doneEntries, todoEntries] = partition(data, 'done');

      setTodoEntries(todoEntries);
      setDoneEntries(doneEntries);
    }
  }, [data]);

  return { todoEntries, doneEntries, error };
};

/**
 * React hook which attempts to determine whether the user prefers dark mode or
 * not.
 */
export const usePreferDarkMode = (): boolean => {
  const [darkMode, setDarkMode] = useState<boolean>(
    window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : undefined;
    let changeListener: () => void | undefined;

    if (mediaQueryList) {
      changeListener = () => {
        setDarkMode(mediaQueryList.matches);
      };
      mediaQueryList.addEventListener('change', changeListener);
    }

    return () => {
      if (mediaQueryList) {
        mediaQueryList.removeEventListener('change', changeListener);
      }
    };
  }, []);

  return darkMode;
};
