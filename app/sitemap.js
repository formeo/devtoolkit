const SITE_URL = 'https://devtoolkit.site';

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
  ];
}
