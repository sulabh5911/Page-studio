import { configureStore } from '@reduxjs/toolkit';
import draftPageReducer from '@/features/editor/draftPageSlice';
import uiReducer from '@/features/editor/uiSlice';
import publishReducer from '@/features/publish/publishSlice';

export const PERSIST_KEY = 'page_studio_draft';

const persistMiddleware = (store: { getState: () => { draftPage: { isDirty: boolean; page: unknown } } }) =>
  (next: (action: unknown) => unknown) =>
  (action: unknown) => {
    const result = next(action);
    const state = store.getState();

    if (state.draftPage?.isDirty && state.draftPage.page) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(PERSIST_KEY, JSON.stringify(state.draftPage.page));
        } catch (e) {
          console.error('Failed to save draft to localStorage', e);
        }
      }
    }

    return result;
  };

export function clearPersistedDraft() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PERSIST_KEY);
  } catch {
    // ignore
  }
}

export function loadPersistedDraft(slug: string) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return null;
    const page = JSON.parse(raw);
    return page?.slug === slug ? page : null;
  } catch {
    return null;
  }
}

export const makeStore = () => {
  return configureStore({
    reducer: {
      draftPage: draftPageReducer,
      ui: uiReducer,
      publish: publishReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistMiddleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
