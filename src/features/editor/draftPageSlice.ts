import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page, Section } from '@/types';

interface DraftPageState {
  page: Page | null;
  isDirty: boolean;
  lastSaved: string | null;
}

const initialState: DraftPageState = {
  page: null,
  isDirty: false,
  lastSaved: null,
};

export const draftPageSlice = createSlice({
  name: 'draftPage',
  initialState,
  reducers: {
    loadPage: (state, action: PayloadAction<Page>) => {
      state.page = action.payload;
      state.isDirty = false;
    },
    restoreDraft: (state, action: PayloadAction<Page>) => {
      state.page = action.payload;
      state.isDirty = true;
    },
    addSection: (state, action: PayloadAction<Section>) => {
      if (state.page) {
        state.page.sections.push(action.payload);
        state.isDirty = true;
      }
    },
    removeSection: (state, action: PayloadAction<string>) => {
      if (state.page) {
        state.page.sections = state.page.sections.filter(s => s.id !== action.payload);
        state.isDirty = true;
      }
    },
    reorderSections: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (state.page) {
        const { fromIndex, toIndex } = action.payload;
        const result = Array.from(state.page.sections);
        const [removed] = result.splice(fromIndex, 1);
        result.splice(toIndex, 0, removed);
        state.page.sections = result;
        state.isDirty = true;
      }
    },
    updateSectionProps: (state, action: PayloadAction<{ id: string; props: Record<string, unknown> }>) => {
      if (state.page) {
        const index = state.page.sections.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.page.sections[index].props = {
            ...state.page.sections[index].props,
            ...action.payload.props,
          };
          state.isDirty = true;
        }
      }
    },
    saveDraft: (state) => {
      state.isDirty = false;
      state.lastSaved = new Date().toISOString();
    },
    resetDraft: () => initialState,
  },
});

export const {
  loadPage,
  restoreDraft,
  addSection,
  removeSection,
  reorderSections,
  updateSectionProps,
  saveDraft,
  resetDraft,
} = draftPageSlice.actions;

export default draftPageSlice.reducer;
