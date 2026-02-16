const SITE_URL = 'https://www.devtoolkit.site';

export default function sitemap() {
  const tools = [
    'json-formatter',
    'yaml-json-converter',
    'base64-encoder',
    'jwt-decoder',
    'url-encoder',
    'hash-generator',
    'uuid-generator',
    'regex-tester',
    'timestamp-converter',
    'color-converter',
    'lorem-ipsum-generator',
    'diff-checker',
    'password-generator',
    'qr-code-generator',
    'sql-formatter',
    'cron-parser',
    'postgres-config',
    'json-tree-viewer',
    'http-status-codes',
  ];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...tools.map(tool => ({
      url: `${SITE_URL}/${tool}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
