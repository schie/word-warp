import { useCallback, useState } from 'react';
import {
  selectFormData,
  selectFormDiphthongs,
  selectFormConsonants,
  selectFormVowels,
  store,
  selectRestrictions,
} from 'store';

import { shuffle, countBy, sample } from 'lodash';
import { Sound } from '_types';
import { createSelector } from '@reduxjs/toolkit';
import {
  first,
  flatten,
  get,
  groupBy,
  map,
  mapValues,
  pipe,
  values,
} from 'lodash/fp';
import { useSelector } from 'react-redux';

interface Response {
  words: Sound[][];
  loading: boolean;
  called: boolean;
}

const initialResponse: Response = {
  loading: false,
  called: false,
  words: [],
};

const MAX_ATTEMPTS = 10; // Defining a max limit for attempts

const selectJazz = createSelector(
  [
    selectFormData,
    selectFormDiphthongs,
    selectFormConsonants,
    selectFormVowels,
  ],
  ({ pattern, quantity }, diphthongs, selectedConsonants, vowels) => {
    return {
      pattern,
      quantity,
      selectedConsonants,
      selectedVowels: [...vowels, ...diphthongs],
    };
  }
);

const _getUniqueIndices = pipe(
  (words: Sound[][]) =>
    words.map((word, idx) => ({
      word: word.map((sound) => sound.sound).join(''),
      idx,
    })),
  groupBy('word'),
  mapValues(pipe(map(get('idx')), first)),
  values,
  flatten,
  (x) => new Set<number>(x)
);

const getUniqueWords: (words: Sound[][]) => Sound[][] = (words) => {
  const uniqueIndices = _getUniqueIndices(words);
  return words.filter((_, idx) => uniqueIndices.has(idx));
};

export const useWordGenerator = () => {
  const [response, setResponse] = useState<Response>(initialResponse);

  const restrictions = useSelector(selectRestrictions);

  const isValidSound = useCallback(
    ({ previous, next }: { previous?: Sound; next: Sound }) => {
      const restrictedSounds = new Set(
        ...(restrictions?.[previous?.sound ?? ''] ?? [])
      );
      return !restrictedSounds.has(next.sound);
    },
    [restrictions]
  );

  const generateWords = useCallback(async () => {
    const response: Response = {
      words: [],
      loading: true,
      called: true,
    };
    setResponse(response);
    const { pattern, quantity, selectedConsonants, selectedVowels } =
      selectJazz(store.getState());

    return new Promise<Response>((resolve) => {
      if (
        quantity <= 0 ||
        pattern.length === 0 ||
        selectedConsonants.length === 0 ||
        selectedVowels.length === 0
      ) {
        setResponse((r) => ({ ...r, loading: true }));
        resolve(response);
      } else {
        const { C, V } = countBy(pattern, (x) => x);
        const selectedC = shuffle(selectedConsonants);
        const selectedV = shuffle(selectedVowels);

        while (C > selectedC.length) {
          selectedC.push(shuffle(selectedC)[0]);
        }
        while (V > selectedV.length) {
          selectedV.push(shuffle(selectedV)[0]);
        }

        let q = quantity;
        const words: Sound[][] = [];

        while (q > 0) {
          const word: Sound[] = [];
          const cs = shuffle(selectedC);
          const vs = shuffle(selectedV);
          let attempts = 0; // Counter for attempts
          for (let p of pattern) {
            if (p === 'C') {
              let consonant = cs.pop() ?? sample(selectedC);
              while (
                !isValidSound({
                  previous: word[word.length - 1],
                  next: consonant as Sound,
                }) &&
                attempts < MAX_ATTEMPTS
              ) {
                consonant = cs.pop() ?? sample(selectedC);
                attempts++;
              }
              if (attempts >= MAX_ATTEMPTS) {
                break;
              }
              word.push(consonant as Sound);
            } else if (p === 'V') {
              let vowel = vs.pop() ?? sample(selectedV);
              while (
                !isValidSound({
                  previous: word[word.length - 1],
                  next: vowel as Sound,
                }) &&
                attempts < MAX_ATTEMPTS
              ) {
                vowel = vs.pop() ?? sample(selectedV);
                attempts++;
              }
              if (attempts >= MAX_ATTEMPTS) {
                break; // Break out if max attempts reached
              }
              word.push(vowel as Sound);
            }
          }
          if (attempts < MAX_ATTEMPTS) {
            // Only add the word if it's valid
            words.push(word);
            q--;
          }
        }

        words.map((word, idx) => {
          return { word: word.map((sound) => sound.sound).join(''), idx };
        });

        response.words = getUniqueWords(words);
        response.loading = false;
        setResponse({ ...response });
        resolve(response);
      }
    });
  }, [setResponse, isValidSound]);

  return [generateWords, response] as [typeof generateWords, Response];
};
