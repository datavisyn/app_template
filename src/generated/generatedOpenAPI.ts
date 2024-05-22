import { baseApi as api } from './baseApi';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLoginApiLoginGet: build.query<GetLoginApiLoginGetApiResponse, GetLoginApiLoginGetApiArg>({
      query: () => ({ url: `/api/login` }),
    }),
    postLoginApiLoginPost: build.mutation<PostLoginApiLoginPostApiResponse, PostLoginApiLoginPostApiArg>({
      query: (queryArg) => ({ url: `/api/login`, method: 'POST', body: queryArg.bodyPostLoginApiLoginPost }),
    }),
    logoutApiLogoutPost: build.mutation<LogoutApiLogoutPostApiResponse, LogoutApiLogoutPostApiArg>({
      query: () => ({ url: `/api/logout`, method: 'POST' }),
    }),
    loggedinasApiLoggedinasGet: build.query<LoggedinasApiLoggedinasGetApiResponse, LoggedinasApiLoggedinasGetApiArg>({
      query: () => ({ url: `/api/loggedinas` }),
    }),
    loggedinasApiLoggedinasPost: build.mutation<LoggedinasApiLoggedinasPostApiResponse, LoggedinasApiLoggedinasPostApiArg>({
      query: () => ({ url: `/api/loggedinas`, method: 'POST' }),
    }),
    storesApiSecurityStoresGet: build.query<StoresApiSecurityStoresGetApiResponse, StoresApiSecurityStoresGetApiArg>({
      query: () => ({ url: `/api/security/stores` }),
    }),
    listIdtypesApiIdtypeGet: build.query<ListIdtypesApiIdtypeGetApiResponse, ListIdtypesApiIdtypeGetApiArg>({
      query: () => ({ url: `/api/idtype/` }),
    }),
    mapsToApiIdtypeIdtypeGet: build.query<MapsToApiIdtypeIdtypeGetApiResponse, MapsToApiIdtypeIdtypeGetApiArg>({
      query: (queryArg) => ({ url: `/api/idtype/${queryArg.idtype}/` }),
    }),
    mappingToApiIdtypeIdtypeToIdtypeGet: build.query<MappingToApiIdtypeIdtypeToIdtypeGetApiResponse, MappingToApiIdtypeIdtypeToIdtypeGetApiArg>({
      query: (queryArg) => ({ url: `/api/idtype/${queryArg.idtype}/${queryArg.toIdtype}/`, body: queryArg.idTypeMappingRequest }),
    }),
    mappingToApiIdtypeIdtypeToIdtypePost: build.mutation<MappingToApiIdtypeIdtypeToIdtypePostApiResponse, MappingToApiIdtypeIdtypeToIdtypePostApiArg>({
      query: (queryArg) => ({ url: `/api/idtype/${queryArg.idtype}/${queryArg.toIdtype}/`, method: 'POST', body: queryArg.idTypeMappingRequest }),
    }),
    mappingToSearchApiIdtypeIdtypeToIdtypeSearchGet: build.query<
      MappingToSearchApiIdtypeIdtypeToIdtypeSearchGetApiResponse,
      MappingToSearchApiIdtypeIdtypeToIdtypeSearchGetApiArg
    >({
      query: (queryArg) => ({ url: `/api/idtype/${queryArg.idtype}/${queryArg.toIdtype}/search/`, body: queryArg.idTypeMappingSearchRequest }),
    }),
    getPluginsApiTdpPluginGet: build.query<GetPluginsApiTdpPluginGetApiResponse, GetPluginsApiTdpPluginGetApiArg>({
      query: () => ({ url: `/api/tdp/plugin` }),
    }),
    xlsx2JsonApiXlsxToJsonPost: build.mutation<Xlsx2JsonApiXlsxToJsonPostApiResponse, Xlsx2JsonApiXlsxToJsonPostApiArg>({
      query: (queryArg) => ({ url: `/api/xlsx/to_json/`, method: 'POST', body: queryArg.bodyXlsx2JsonApiXlsxToJsonPost }),
    }),
    xlsx2JsonArrayApiXlsxToJsonArrayPost: build.mutation<Xlsx2JsonArrayApiXlsxToJsonArrayPostApiResponse, Xlsx2JsonArrayApiXlsxToJsonArrayPostApiArg>({
      query: (queryArg) => ({ url: `/api/xlsx/to_json_array/`, method: 'POST', body: queryArg.bodyXlsx2JsonArrayApiXlsxToJsonArrayPost }),
    }),
    json2XlsxApiXlsxFromJsonPost: build.mutation<Json2XlsxApiXlsxFromJsonPostApiResponse, Json2XlsxApiXlsxFromJsonPostApiArg>({
      query: (queryArg) => ({ url: `/api/xlsx/from_json/`, method: 'POST', body: queryArg.tableData }),
    }),
    jsonArray2XlsxApiXlsxFromJsonArrayPost: build.mutation<JsonArray2XlsxApiXlsxFromJsonArrayPostApiResponse, JsonArray2XlsxApiXlsxFromJsonArrayPostApiArg>({
      query: (queryArg) => ({ url: `/api/xlsx/from_json_array/`, method: 'POST', body: queryArg.data }),
    }),
    healthApiHealthGet: build.query<HealthApiHealthGetApiResponse, HealthApiHealthGetApiArg>({
      query: () => ({ url: `/api/health` }),
    }),
    healthApiHealthHead: build.mutation<HealthApiHealthHeadApiResponse, HealthApiHealthHeadApiArg>({
      query: () => ({ url: `/api/health`, method: 'HEAD' }),
    }),
    getExampleApiAppExampleGet: build.query<GetExampleApiAppExampleGetApiResponse, GetExampleApiAppExampleGetApiArg>({
      query: () => ({ url: `/api/app/example` }),
    }),
    getConfigPathApiTdpConfigPathGet: build.query<GetConfigPathApiTdpConfigPathGetApiResponse, GetConfigPathApiTdpConfigPathGetApiArg>({
      query: (queryArg) => ({ url: `/api/tdp/config/${queryArg.path}` }),
    }),
    getClientConfigApiV1VisynClientConfigGet: build.query<GetClientConfigApiV1VisynClientConfigGetApiResponse, GetClientConfigApiV1VisynClientConfigGetApiArg>({
      query: () => ({ url: `/api/v1/visyn/clientConfig` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedOpenAPI };
export type GetLoginApiLoginGetApiResponse = unknown;
export type GetLoginApiLoginGetApiArg = void;
export type PostLoginApiLoginPostApiResponse = /** status 200 Successful Response */ Token;
export type PostLoginApiLoginPostApiArg = {
  bodyPostLoginApiLoginPost: BodyPostLoginApiLoginPost;
};
export type LogoutApiLogoutPostApiResponse = /** status 200 Successful Response */ any;
export type LogoutApiLogoutPostApiArg = void;
export type LoggedinasApiLoggedinasGetApiResponse = /** status 200 Successful Response */ any;
export type LoggedinasApiLoggedinasGetApiArg = void;
export type LoggedinasApiLoggedinasPostApiResponse = /** status 200 Successful Response */ any;
export type LoggedinasApiLoggedinasPostApiArg = void;
export type StoresApiSecurityStoresGetApiResponse = /** status 200 Successful Response */ SecurityStoreResponse[];
export type StoresApiSecurityStoresGetApiArg = void;
export type ListIdtypesApiIdtypeGetApiResponse = /** status 200 Successful Response */ IdType[];
export type ListIdtypesApiIdtypeGetApiArg = void;
export type MapsToApiIdtypeIdtypeGetApiResponse = /** status 200 Successful Response */ IdType[];
export type MapsToApiIdtypeIdtypeGetApiArg = {
  idtype: string;
};
export type MappingToApiIdtypeIdtypeToIdtypeGetApiResponse = /** status 200 Successful Response */ string[];
export type MappingToApiIdtypeIdtypeToIdtypeGetApiArg = {
  idtype: string;
  toIdtype: string;
  idTypeMappingRequest: IdTypeMappingRequest;
};
export type MappingToApiIdtypeIdtypeToIdtypePostApiResponse = /** status 200 Successful Response */ string[];
export type MappingToApiIdtypeIdtypeToIdtypePostApiArg = {
  idtype: string;
  toIdtype: string;
  idTypeMappingRequest: IdTypeMappingRequest;
};
export type MappingToSearchApiIdtypeIdtypeToIdtypeSearchGetApiResponse = /** status 200 Successful Response */ IdTypeMappingSearchResponse[];
export type MappingToSearchApiIdtypeIdtypeToIdtypeSearchGetApiArg = {
  idtype: any;
  toIdtype: any;
  idTypeMappingSearchRequest: IdTypeMappingSearchRequest;
};
export type GetPluginsApiTdpPluginGetApiResponse = /** status 200 Successful Response */ any;
export type GetPluginsApiTdpPluginGetApiArg = void;
export type Xlsx2JsonApiXlsxToJsonPostApiResponse = /** status 200 Successful Response */ TableData;
export type Xlsx2JsonApiXlsxToJsonPostApiArg = {
  bodyXlsx2JsonApiXlsxToJsonPost: BodyXlsx2JsonApiXlsxToJsonPost;
};
export type Xlsx2JsonArrayApiXlsxToJsonArrayPostApiResponse = /** status 200 Successful Response */ any[][];
export type Xlsx2JsonArrayApiXlsxToJsonArrayPostApiArg = {
  bodyXlsx2JsonArrayApiXlsxToJsonArrayPost: BodyXlsx2JsonArrayApiXlsxToJsonArrayPost;
};
export type Json2XlsxApiXlsxFromJsonPostApiResponse = /** status 200 Successful Response */ any;
export type Json2XlsxApiXlsxFromJsonPostApiArg = {
  tableData: TableData;
};
export type JsonArray2XlsxApiXlsxFromJsonArrayPostApiResponse = /** status 200 Successful Response */ any;
export type JsonArray2XlsxApiXlsxFromJsonArrayPostApiArg = {
  data: any[][];
};
export type HealthApiHealthGetApiResponse = /** status 200 Successful Response */ any;
export type HealthApiHealthGetApiArg = void;
export type HealthApiHealthHeadApiResponse = /** status 200 Successful Response */ any;
export type HealthApiHealthHeadApiArg = void;
export type GetExampleApiAppExampleGetApiResponse = /** status 200 Successful Response */ ExampleResponse;
export type GetExampleApiAppExampleGetApiArg = void;
export type GetConfigPathApiTdpConfigPathGetApiResponse = /** status 200 Successful Response */ any;
export type GetConfigPathApiTdpConfigPathGetApiArg = {
  path: string;
};
export type GetClientConfigApiV1VisynClientConfigGetApiResponse = /** status 200 Successful Response */ AppConfigModel;
export type GetClientConfigApiV1VisynClientConfigGetApiArg = void;
export type Token = {
  access_token: string;
  token_type: string;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type BodyPostLoginApiLoginPost = {
  grant_type?: string;
  username: string;
  password: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
};
export type SecurityStoreResponse = {
  id: string;
  ui?: string;
  configuration?: object;
};
export type IdType = {
  id: string;
  name: string;
  names: string[];
};
export type IdTypeMappingRequest = {
  q: string[];
  mode?: 'all' | 'first';
};
export type IdTypeMappingSearchResponse = {
  match: string;
  to: string;
};
export type IdTypeMappingSearchRequest = {
  q: string;
  limit?: number;
};
export type TableColumn = {
  name: string;
  type: string;
};
export type TableSheet = {
  title: string;
  columns: TableColumn[];
  rows: object[];
};
export type TableData = {
  sheets: TableSheet[];
};
export type BodyXlsx2JsonApiXlsxToJsonPost = {
  file: Blob;
};
export type BodyXlsx2JsonArrayApiXlsxToJsonArrayPost = {
  file: Blob;
};
export type ExampleResponse = {
  message: string;
};
export type AppConfigModel = {
  env?: 'development' | 'production';
};
export const {
  useGetLoginApiLoginGetQuery,
  useLazyGetLoginApiLoginGetQuery,
  usePostLoginApiLoginPostMutation,
  useLogoutApiLogoutPostMutation,
  useLoggedinasApiLoggedinasGetQuery,
  useLazyLoggedinasApiLoggedinasGetQuery,
  useLoggedinasApiLoggedinasPostMutation,
  useStoresApiSecurityStoresGetQuery,
  useLazyStoresApiSecurityStoresGetQuery,
  useListIdtypesApiIdtypeGetQuery,
  useLazyListIdtypesApiIdtypeGetQuery,
  useMapsToApiIdtypeIdtypeGetQuery,
  useLazyMapsToApiIdtypeIdtypeGetQuery,
  useMappingToApiIdtypeIdtypeToIdtypeGetQuery,
  useLazyMappingToApiIdtypeIdtypeToIdtypeGetQuery,
  useMappingToApiIdtypeIdtypeToIdtypePostMutation,
  useMappingToSearchApiIdtypeIdtypeToIdtypeSearchGetQuery,
  useLazyMappingToSearchApiIdtypeIdtypeToIdtypeSearchGetQuery,
  useGetPluginsApiTdpPluginGetQuery,
  useLazyGetPluginsApiTdpPluginGetQuery,
  useXlsx2JsonApiXlsxToJsonPostMutation,
  useXlsx2JsonArrayApiXlsxToJsonArrayPostMutation,
  useJson2XlsxApiXlsxFromJsonPostMutation,
  useJsonArray2XlsxApiXlsxFromJsonArrayPostMutation,
  useHealthApiHealthGetQuery,
  useLazyHealthApiHealthGetQuery,
  useHealthApiHealthHeadMutation,
  useGetExampleApiAppExampleGetQuery,
  useLazyGetExampleApiAppExampleGetQuery,
  useGetConfigPathApiTdpConfigPathGetQuery,
  useLazyGetConfigPathApiTdpConfigPathGetQuery,
  useGetClientConfigApiV1VisynClientConfigGetQuery,
  useLazyGetClientConfigApiV1VisynClientConfigGetQuery,
} = injectedRtkApi;
