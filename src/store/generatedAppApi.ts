import { emptySplitApi as api } from './appBaseApi';
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    autocompleteApiAppAutocompleteGet: build.query<AutocompleteApiAppAutocompleteGetApiResponse, AutocompleteApiAppAutocompleteGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/autocomplete`, params: { search: queryArg.search, limit: queryArg.limit } }),
    }),
    expandApiAppExpandGet: build.query<ExpandApiAppExpandGetApiResponse, ExpandApiAppExpandGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/expand`, params: { geneIds: queryArg.geneIds, options: queryArg.options, limit: queryArg.limit } }),
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
export type ExpandApiAppExpandGetApiResponse = /** status 200 Successful Response */ Gene2AllResponse;
export type ExpandApiAppExpandGetApiArg = {
  geneIds: string[];
  options: boolean[];
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
export type PositionType = {
  x: number;
  y: number;
};
export type Node = {
  id: string;
  entrezId: string;
  name: string;
  summary: string;
  synonyms: string[];
  position?: PositionType;
  type: string;
};
export type Edge = {
  id: string;
  source: string;
  target: string;
};
export type Gene2AllResponse = {
  nodes: Node[];
  edges: Edge[];
};
export const {
  useAutocompleteApiAppAutocompleteGetQuery,
  useLazyAutocompleteApiAppAutocompleteGetQuery,
  useExpandApiAppExpandGetQuery,
  useLazyExpandApiAppExpandGetQuery,
} = injectedRtkApi;
