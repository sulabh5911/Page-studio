import { createClient } from 'contentful';

export function getContentfulClient(preview = false) {
  // We allow mock/empty values if env vars are missing so the build doesn't crash,
  // but it will fail at runtime if we actually try to fetch from Contentful without them.
  const space = process.env.CONTENTFUL_SPACE_ID || 'mock_space_id';
  
  if (preview) {
    return createClient({
      space,
      accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN || 'mock_preview_token',
      host: 'preview.contentful.com',
    });
  }

  return createClient({
    space,
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || 'mock_delivery_token',
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
  });
}
