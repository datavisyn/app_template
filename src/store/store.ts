import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { generatedAppApi } from './generatedAppApi';

export const appApi = generatedAppApi.enhanceEndpoints({
  addTagTypes: ['Campaign'],
  endpoints: {
    // Use this to invalidate any tags
    getCampaignsApiV1AppCampaignsGet: {
      providesTags: ['Campaign'],
    },
    deleteCampaignApiV1AppCampaignCampaignIdDelete: {
      invalidatesTags: ['Campaign'],
    },
    createCampaignApiV1AppCampaignPost: {
      invalidatesTags: ['Campaign'],
    },
  },
});

export const {
  useGetCampaignsApiV1AppCampaignsGetQuery: useGetCampaigns,
  useCreateCampaignApiV1AppCampaignPostMutation: useCreateCampaign,
  useDeleteCampaignApiV1AppCampaignCampaignIdDeleteMutation: useDeleteCampaign,
} = appApi;

export const appSlice = createSlice({
  name: 'insight',
  initialState: {
    someState: false as boolean,
  },
  reducers: {
    setSomeState: (state, action: PayloadAction<boolean>) => {
      state.someState = action.payload;
    },
  },
});

export const { setSomeState } = appSlice.actions;

export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    [appSlice.name]: appSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
