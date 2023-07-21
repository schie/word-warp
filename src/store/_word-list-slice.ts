import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WordScore, Word, WordListItem, WordListState, CueScore } from '_types';

const initialState: WordListState = {
  notes: '',
  words: [],
};

export const wordListSlice = createSlice({
  name: 'wordList',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    initializeWords: (state, action: PayloadAction<Word[]>) => {
      state.words =
        action.payload.map(
          (word) =>
            ({
              ...word,
              score: WordScore.NotScored,
              cueScore: CueScore.NotScored,
              spellingIndexes: Array(word.sounds.length).fill(0),
              notes: '',
            } as WordListItem)
        ) ?? [];
    },
    addWord: (state, action: PayloadAction<Word>) => {
      state.words = [
        ...state.words,
        {
          ...action.payload,
          spellingIndexes: Array(action.payload.sounds.length).fill(0),
          score: WordScore.NotScored,
          cueScore: CueScore.NotScored,
          notes: '',
        } as WordListItem,
      ];
    },
    setWordCueScore: (
      state,
      action: PayloadAction<{ index: number; cueScore: CueScore }>
    ) => {
      state.words[action.payload.index].cueScore = action.payload.cueScore;
    },
    setWordScore: (
      state,
      action: PayloadAction<{ index: number; score: WordScore }>
    ) => {
      state.words[action.payload.index].score = action.payload.score;
    },
    setWordNotes: (
      state,
      action: PayloadAction<{ index: number; notes: string }>
    ) => {
      state.words[action.payload.index].notes = action.payload.notes;
    },
    setWordSpellingIndex: (
      state,
      action: PayloadAction<{
        wordIndex: number;
        soundIndex: number;
        spellingIndex: number;
      }>
    ) => {
      const letters =
        state.words[action.payload.wordIndex].sounds[action.payload.soundIndex]
          .letters;

      state.words[action.payload.wordIndex].spellingIndexes[
        action.payload.soundIndex
      ] = action.payload.spellingIndex % letters.length;
    },
    deleteWord: (state, action: PayloadAction<number>) => {
      state.words = state.words.splice(action.payload, 1);
    },
    resetWords: (state) => {
      state.words = [];
      state.notes = '';
    },
  },
});

export const wordListActions = wordListSlice.actions;
export default wordListSlice.reducer;
