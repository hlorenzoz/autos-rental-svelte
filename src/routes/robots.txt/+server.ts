import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
  const origin = url.origin;
  
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap.xml`
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
};
