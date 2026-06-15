import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PublishStatus = 'idle' | 'diffing' | 'publishing' | 'success' | 'error';

interface PublishState {
  status: PublishStatus;
  lastPublishedVersion: string | null;
  changelog: string[];
  error: string | null;
}

const initialState: PublishState = {
  status: 'idle',
  lastPublishedVersion: null,
  changelog: [],
  error: null,
};

export const publishSlice = createSlice({
  name: 'publish',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<PublishStatus>) => {
      state.status = action.payload;
    },
    setPublishResult: (state, action: PayloadAction<{ version: string; changelog: string[] }>) => {
      state.status = 'success';
      state.lastPublishedVersion = action.payload.version;
      state.changelog = action.payload.changelog;
      state.error = null;
    },
    setPublishError: (state, action: PayloadAction<string>) => {
      state.status = 'error';
      state.error = action.payload;
    },
    resetPublish: () => initialState,
  },
});

export const {
  setStatus,
  setPublishResult,
  setPublishError,
  resetPublish,
} = publishSlice.actions;

export default publishSlice.reducer;
