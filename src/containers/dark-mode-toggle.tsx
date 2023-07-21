import { DarkModeToggle as Comp } from 'components';
import { useCallback, useEffect, useState } from 'react';

export const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for a user's manual preference first
    const userPreference = localStorage.getItem('isDarkMode');
    if (userPreference) {
      document.documentElement.classList[
        userPreference === 'dark' ? 'add' : 'remove'
      ]('dark');
      setIsDarkMode(userPreference === 'dark');
      return;
    }

    // If no manual preference, check for system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const onDarkModeSettingChange = useCallback(
    (isDarkMode: boolean) => {
      document.documentElement.classList.toggle('dark', isDarkMode);
      localStorage.setItem('isDarkMode', isDarkMode ? 'dark' : 'light');
      setIsDarkMode(isDarkMode);
    },
    [setIsDarkMode]
  );

  return (
    <Comp
      isDarkMode={isDarkMode}
      onDarkModeSettingChange={onDarkModeSettingChange}
    />
  );
};
