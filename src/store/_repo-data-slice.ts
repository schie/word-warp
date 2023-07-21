import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SoundRepoState } from '_types';
import EN_US from 'repos/en-us.json';

const initialState: SoundRepoState = EN_US;

export const repoDataSlice = createSlice({
  name: 'repoData',
  initialState,
  reducers: {
    setRepo: (state, action: PayloadAction<SoundRepoState>) => {
      state = action.payload;
    },
  },
});

export const repoDataActions = repoDataSlice.actions;
export default repoDataSlice.reducer;
