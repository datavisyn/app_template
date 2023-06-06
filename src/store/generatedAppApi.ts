import { emptySplitApi as api } from './appBaseApi';
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    autocompleteApiAppAutocompleteGet: build.query<AutocompleteApiAppAutocompleteGetApiResponse, AutocompleteApiAppAutocompleteGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/autocomplete`, params: { search: queryArg.search, limit: queryArg.limit } }),
    }),
    graphApiAppGraphGet: build.query<GraphApiAppGraphGetApiResponse, GraphApiAppGraphGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/graph`, params: { gene: queryArg.gene, limit: queryArg.limit } }),
    }),
    disease2GenesApiAppDisease2GenesGet: build.query<Disease2GenesApiAppDisease2GenesGetApiResponse, Disease2GenesApiAppDisease2GenesGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/disease2genes`, params: { disease: queryArg.disease, limit: queryArg.limit } }),
    }),
    drug2GenesApiAppDrug2GenesGet: build.query<Drug2GenesApiAppDrug2GenesGetApiResponse, Drug2GenesApiAppDrug2GenesGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/drug2genes`, params: { drug: queryArg.drug, limit: queryArg.limit } }),
    }),
    gene2DrugsApiAppGene2DrugsGet: build.query<Gene2DrugsApiAppGene2DrugsGetApiResponse, Gene2DrugsApiAppGene2DrugsGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/gene2drugs`, params: { gene: queryArg.gene, limit: queryArg.limit } }),
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
export type Disease2GenesApiAppDisease2GenesGetApiResponse = /** status 200 Successful Response */ GeneResponse[];
export type Disease2GenesApiAppDisease2GenesGetApiArg = {
  disease?: string;
  limit?: number;
};
export type Drug2GenesApiAppDrug2GenesGetApiResponse = /** status 200 Successful Response */ GeneResponse[];
export type Drug2GenesApiAppDrug2GenesGetApiArg = {
  drug?: string;
  limit?: number;
};
export type Gene2DrugsApiAppGene2DrugsGetApiResponse = /** status 200 Successful Response */ DiseaseResponse[];
export type Gene2DrugsApiAppGene2DrugsGetApiArg = {
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
export type GeneResponse = {
  gene: string;
  padj: number;
  disease: string;
};
export type DiseaseResponse = {
  gene: string;
  padj: number;
  disease: string;
};
export const {
  useAutocompleteApiAppAutocompleteGetQuery,
  useLazyAutocompleteApiAppAutocompleteGetQuery,
  useGraphApiAppGraphGetQuery,
  useLazyGraphApiAppGraphGetQuery,
  useDisease2GenesApiAppDisease2GenesGetQuery,
  useLazyDisease2GenesApiAppDisease2GenesGetQuery,
  useDrug2GenesApiAppDrug2GenesGetQuery,
  useLazyDrug2GenesApiAppDrug2GenesGetQuery,
  useGene2DrugsApiAppGene2DrugsGetQuery,
  useLazyGene2DrugsApiAppGene2DrugsGetQuery,
} = injectedRtkApi;
