import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: 'http://127.0.0.1:9000/api/openapi.json',
  apiFile: './store/appBaseApi.ts',
  apiImport: 'emptySplitApi',
  outputFile: './store/generatedAppApi.ts',
  exportName: 'generatedAppApi',
  tag: false, // TODO: when true, his will refetch everything with every mutation as we only have one tag.
  filterEndpoints: (endpoint, definition) => definition?.path?.startsWith('/api/app'),
  hooks: { queries: true, lazyQueries: true, mutations: true },
};

export default config;
