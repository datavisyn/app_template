import { configureStore } from '@reduxjs/toolkit';
import { generatedAppApi } from './generatedAppApi';

export const appApi = generatedAppApi.enhanceEndpoints({
  addTagTypes: [],
  endpoints: {
    // Use this to invalidate any tags
  },
});

export const { useGene2GenesApiAppGene2GenesGetQuery: useGene2Genes,
   useAutocompleteApiAppAutocompleteGetQuery: useAutocomplete,
   useGene2DrugsApiAppGene2DrugsGetQuery: useGene2Drugs
   } = appApi;

export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
