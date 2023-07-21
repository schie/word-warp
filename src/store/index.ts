import { configureStore, createSelector } from '@reduxjs/toolkit';

import { pipe, values, flatten, get, filter } from 'lodash/fp';

import formData from './_form-data-slice';
import wordList from './_word-list-slice';
import repoData from './_repo-data-slice';
import {
  SoundRepresentation,
  SoundType,
  WordScore,
  Sound,
  Score,
} from '_types';
import { loadState } from './__utils';

export { saveState } from './__utils';

export const store = configureStore({
  reducer: {
    formData,
    wordList,
    repoData,
  },
  preloadedState: {
    formData: loadState('formData'),
    wordList: loadState('wordList'),
    repoData: loadState('repoData'),
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectFormData = createSelector(
  (state: RootState) => state.formData,
  (fd) => fd
);

const selectFormDataSounds = createSelector(selectFormData, get('sounds'));

export const selectFormConsonants = createSelector(
  selectFormDataSounds,
  filter((sound) => sound.type === SoundType.Consonant)
);

export const selectFormVowels = createSelector(
  selectFormDataSounds,
  filter((sound) => sound.type === SoundType.Vowel)
);

export const selectFormDiphthongs = createSelector(
  selectFormDataSounds,
  filter((sound) => sound.type === SoundType.Diphthong)
);

const selectWords = (state: RootState) => state.wordList.words;
export const selectWordsCount = createSelector(
  [selectWords],
  (words) => words.length
);

export const selectCorrectCount = createSelector(
  [selectWords],
  (words) => words.filter((word) => word.score === WordScore.Correct).length
);
export const selectIncorrectCount = createSelector(
  [selectWords],
  (words) => words.filter((word) => word.score === WordScore.Incorrect).length
);
export const selectSkippedCount = createSelector(
  [selectWords],
  (words) => words.filter((word) => word.score === WordScore.Skipped).length
);

export const selectNotScoredCount = createSelector(
  [selectWords],
  (words) => words.filter((word) => word.score === WordScore.NotScored).length
);

export const selectSuccessOfAttemptedScore = createSelector(
  [selectCorrectCount, selectIncorrectCount],
  (corrects, incorrects) => {
    const total = corrects + incorrects;
    const percentage = +(total === 0 ? 0 : corrects / total).toFixed(2);

    return {
      percentage,
      fraction: `${corrects}/${total}`,
    } as Score;
  }
);

export const selectAttemptedScore = createSelector(
  [selectCorrectCount, selectIncorrectCount, selectWords],
  (corrects, incorrects, words) => {
    const total = corrects + incorrects;
    const percentage = +(words.length === 0 ? 0 : total / words.length).toFixed(
      2
    );

    return {
      percentage,
      fraction: `${total}/${words.length}`,
    } as Score;
  }
);

export const selectAllConsonants = createSelector(
  (state: RootState) => state.repoData.consonants,
  pipe(values, flatten)
);

export const selectAllVowels = createSelector(
  (state: RootState) => state.repoData.vowels,
  pipe(values, flatten)
);

export const selectAllDiphthongs = createSelector(
  (state: RootState) => state.repoData.diphthongs,
  (diphthongs) => diphthongs
);

export const selectRestrictions = createSelector(
  (state: RootState) => state.repoData.restrictions,
  (restrictions) => restrictions
);

const _selectRemainingSounds = (
  all: SoundRepresentation[],
  selected: Sound[]
) => {
  const formSet = new Set(selected.map((sound) => sound.sound));
  return all.filter((sound) => !formSet.has(sound.sound));
};

export const selectAllRemainingConsonants = createSelector(
  [selectAllConsonants, selectFormConsonants],
  _selectRemainingSounds
);

export const selectAllRemainingVowels = createSelector(
  [selectAllVowels, selectFormVowels],
  _selectRemainingSounds
);

export const selectAllRemainingDiphthongs = createSelector(
  [selectAllDiphthongs, selectFormDiphthongs],
  _selectRemainingSounds
);

export const selectAllRemainingSounds = createSelector(
  [selectAllConsonants, selectAllVowels, selectAllDiphthongs],
  (consonants, vowels, diphthongs) => {
    return [
      ...consonants.map((c) => ({ ...c, type: SoundType.Consonant } as Sound)),
      ...vowels.map((c) => ({ ...c, type: SoundType.Vowel } as Sound)),
      ...diphthongs.map((c) => ({ ...c, type: SoundType.Diphthong } as Sound)),
    ];
  }
);
