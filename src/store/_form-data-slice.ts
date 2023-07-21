import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FormState } from '_types';

const initialState: FormState = {
  sounds: [],
  pattern: [],
  quantity: 0,
};

export const formDataSlice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<FormState>) => {
      state.sounds = action.payload.sounds;
      state.pattern = action.payload.pattern;
      state.quantity = +action.payload.quantity;
    },
    setSounds: (state, action: PayloadAction<FormState['sounds']>) => {
      state.sounds = action.payload;
    },
    addSound: (state, action: PayloadAction<FormState['sounds'][number]>) => {
      state.sounds = [...state.sounds, action.payload];
    },
    removeSound: (
      state,
      action: PayloadAction<FormState['sounds'][number]>
    ) => {
      state.sounds = state.sounds.filter(
        (sound) => sound.sound !== action.payload.sound
      );
    },
    setPattern: (state, action: PayloadAction<FormState['pattern']>) => {
      state.pattern = action.payload;
    },
    setQuantity: (state, action: PayloadAction<FormState['quantity']>) => {
      state.quantity = action.payload;
    },
  },
});

export const formDataActions = formDataSlice.actions;
export default formDataSlice.reducer;

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('formData');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: FormState) => {};
