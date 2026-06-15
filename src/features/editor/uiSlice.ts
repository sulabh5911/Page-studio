import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

interface UiState {
  selectedSectionId: string | null;
  isPanelOpen: boolean;
  isAddDialogOpen: boolean;
  previewMode: PreviewMode;
}

const initialState: UiState = {
  selectedSectionId: null,
  isPanelOpen: false,
  isAddDialogOpen: false,
  previewMode: 'desktop',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectSection: (state, action: PayloadAction<string | null>) => {
      state.selectedSectionId = action.payload;
      state.isPanelOpen = !!action.payload;
    },
    setPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.isPanelOpen = action.payload;
      if (!action.payload) {
        state.selectedSectionId = null;
      }
    },
    setAddDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddDialogOpen = action.payload;
    },
    setPreviewMode: (state, action: PayloadAction<PreviewMode>) => {
      state.previewMode = action.payload;
    },
  },
});

export const {
  selectSection,
  setPanelOpen,
  setAddDialogOpen,
  setPreviewMode,
} = uiSlice.actions;

export default uiSlice.reducer;
