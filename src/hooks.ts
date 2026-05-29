import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = ({ url }) => {
  const { pathname } = url;

  if (pathname.startsWith('/es/')) {
    // Localized URL rewrites (public ES paths → internal technical paths)
    if (pathname === '/es/vehiculos' || pathname === '/es/vehiculos/')
      return '/es/vehicles/';
    if (pathname === '/es/sobre-nosotros' || pathname === '/es/sobre-nosotros/')
      return '/es/about/';
    if (pathname === '/es/contacto' || pathname === '/es/contacto/')
      return '/es/contact/';
    if (pathname === '/es/mapa-del-sitio' || pathname === '/es/mapa-del-sitio/')
      return '/es/sitemap/';
    if (pathname === '/es/legal/privacidad' || pathname === '/es/legal/privacidad/')
      return '/es/legal/privacy/';
    if (pathname === '/es/legal/terminos' || pathname === '/es/legal/terminos/')
      return '/es/legal/terms/';

    // Dynamic vehicle slugs: /es/vehiculos/{slug}/ → /es/vehicles/{slug}/
    if (pathname.startsWith('/es/vehiculos/')) {
      const slug = pathname.replace('/es/vehiculos/', '').replace(/\/$/, '');
      if (slug) {
        return `/es/vehicles/${slug}/`;
      }
    }
  }

  return pathname;
};
