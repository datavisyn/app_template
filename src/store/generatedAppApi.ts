import { emptySplitApi as api } from './appBaseApi';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    autocompleteApiAppAutocompleteGet: build.query<AutocompleteApiAppAutocompleteGetApiResponse, AutocompleteApiAppAutocompleteGetApiArg>({
      query: (queryArg) => ({ url: `/api/app/autocomplete`, params: { search: queryArg.search, limit: queryArg.limit } }),
    }),
    graphApiAppGraphGet: build.query<GraphApiAppGraphGetApiResponse, GraphApiAppGraphGetApiArg>({
      query: (queryArg) => ({ url: `/api/app/graph`, params: { gene: queryArg.gene, limit: queryArg.limit } }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedAppApi };
export type AutocompleteApiAppAutocompleteGetApiResponse = /** status 200 Successful Response */ string[];
export type AutocompleteApiAppAutocompleteGetApiArg = {
  search: string;
  limit?: number;
};
export type GraphApiAppGraphGetApiResponse = /** status 200 Successful Response */ GraphResponse[];
export type GraphApiAppGraphGetApiArg = {
  gene?: string;
  limit?: number;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type GraphResponse = {
  ENSG_A: string;
  ENSG_B: string;
  combined_score: number;
};
export const {
  useAutocompleteApiAppAutocompleteGetQuery,
  useLazyAutocompleteApiAppAutocompleteGetQuery,
  useGraphApiAppGraphGetQuery,
  useLazyGraphApiAppGraphGetQuery,
} = injectedRtkApi;
