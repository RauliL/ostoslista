import { useEffect, useState } from 'react';

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
