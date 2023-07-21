import React, { useEffect, useState } from 'react';
import './App.css';
import {
  CurrentForm,
  CurrentWordList,
  MetricsContainer,
  WordListNotes,
} from 'containers';
import { saveState, store } from 'store';
import { Tabs } from 'components';

function App() {
  useEffect(
    () =>
      store.subscribe(() => {
        const state = store.getState();
        Object.keys(state).forEach((key) => {
          const k = key as keyof typeof state;
          saveState(k, state[k]);
        });
      }),
    []
  );

  useEffect(() => {
    const updateTheme = () => {
      const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      document.documentElement.setAttribute('data-theme', theme);
    };

    updateTheme(); // Set initial theme
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', updateTheme); // Listen for changes

    // Cleanup
    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', updateTheme);
    };
  }, []);

  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    // <div className="App bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 min-h-screen min-w-full">
    <div className="App bg-base-300 min-h-screen min-w-full">
      <div className="flex flex-row">
        <div className="w-full lg:w-1/3 p-4">
          <Tabs
            className="pl-4"
            options={['Settings', 'Stats', 'Notes']}
            onSelected={setTabIndex}
            initialIndex={0}
          />
          {tabIndex === 0 && <CurrentForm />}
          {tabIndex === 1 && <MetricsContainer />}
          {tabIndex === 2 && <WordListNotes />}
        </div>
        <div className="w-full lg:w-2/3 p-4 overflow-y-auto flex flex-col">
          <CurrentWordList />
        </div>
      </div>
      <div className="fixed text-sm bottom-4 right-4 bg-opacity-50 bg-base-100 text-right py-2 px-4 rounded-full shadow">
        Made with <span className="text-red-500">❤️</span> by{' '}
        <a
          href="https://github.com/schie"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          @schie
        </a>
      </div>
    </div>
  );
}

export default App;
