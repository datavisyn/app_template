import { emptySplitApi as api } from './appBaseApi';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCampaignsApiV1AppCampaignsGet: build.query<GetCampaignsApiV1AppCampaignsGetApiResponse, GetCampaignsApiV1AppCampaignsGetApiArg>({
      query: () => ({ url: `/api/v1/app/campaigns` }),
    }),
    createCampaignApiV1AppCampaignPost: build.mutation<CreateCampaignApiV1AppCampaignPostApiResponse, CreateCampaignApiV1AppCampaignPostApiArg>({
      query: (queryArg) => ({ url: `/api/v1/app/campaign`, method: 'POST', body: queryArg.campaignCreate }),
    }),
    deleteCampaignApiV1AppCampaignCampaignIdDelete: build.mutation<
      DeleteCampaignApiV1AppCampaignCampaignIdDeleteApiResponse,
      DeleteCampaignApiV1AppCampaignCampaignIdDeleteApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/app/campaign/${queryArg.campaignId}`, method: 'DELETE' }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedAppApi };
export type GetCampaignsApiV1AppCampaignsGetApiResponse = /** status 200 Successful Response */ CampaignRead[];
export type GetCampaignsApiV1AppCampaignsGetApiArg = void;
export type CreateCampaignApiV1AppCampaignPostApiResponse = /** status 200 Successful Response */ CampaignRead;
export type CreateCampaignApiV1AppCampaignPostApiArg = {
  campaignCreate: CampaignCreate;
};
export type DeleteCampaignApiV1AppCampaignCampaignIdDeleteApiResponse = /** status 200 Successful Response */ CampaignRead;
export type DeleteCampaignApiV1AppCampaignCampaignIdDeleteApiArg = {
  campaignId: string;
};
export type CampaignRead = {
  name: string;
  description?: string;
  id: string;
  creation_date: string;
  modification_date?: string;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type CampaignCreate = {
  name: string;
  description?: string;
};
export const {
  useGetCampaignsApiV1AppCampaignsGetQuery,
  useLazyGetCampaignsApiV1AppCampaignsGetQuery,
  useCreateCampaignApiV1AppCampaignPostMutation,
  useDeleteCampaignApiV1AppCampaignCampaignIdDeleteMutation,
} = injectedRtkApi;
