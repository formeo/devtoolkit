export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://devtoolkit.dev/sitemap.xml', // CHANGE to your domain
  };
}
