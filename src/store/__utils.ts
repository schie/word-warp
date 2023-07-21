type SliceName = 'formData' | 'wordList' | 'repoData';

export const loadState = (item: SliceName) => {
  try {
    const serializedState = localStorage.getItem(item);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = <T>(item: SliceName, state: T) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(item, serializedState);
  } catch {
    // Ignore write errors
  }
};
