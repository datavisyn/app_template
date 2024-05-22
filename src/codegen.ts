import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: 'http://localhost:9000/api/openapi.json',
  apiFile: './generated/baseApi.ts',
  apiImport: 'baseApi',
  outputFile: './generated/generatedOpenAPI.ts',
  exportName: 'generatedOpenAPI',
  tag: false, // TODO: when true, his will refetch everything with every mutation as we only have one tag.
  filterEndpoints: (endpoint, definition) => definition?.path?.startsWith('/api/'),
  hooks: { queries: true, lazyQueries: true, mutations: true },
};

export default config;
