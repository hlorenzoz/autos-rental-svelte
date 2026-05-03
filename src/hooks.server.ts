import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  if (pathname.startsWith('/es/')) {
    const redirect = (to: string) =>
      new Response(null, { status: 301, headers: { Location: to } });
    const rewrite = async (to: string) => {
      event.url = new URL(to, event.url.origin);
      return resolve(event);
    };

    // Localized URL rewrites (public ES paths → internal technical paths)
    if (pathname === '/es/vehiculos' || pathname === '/es/vehiculos/')
      return rewrite('/es/vehicles/');
    if (pathname === '/es/vehiculos/en-alquiler' || pathname === '/es/vehiculos/en-alquiler/')
      return rewrite('/es/vehicles/for-rent/');
    if (pathname === '/es/vehiculos/en-venta' || pathname === '/es/vehiculos/en-venta/')
      return rewrite('/es/vehicles/for-sell/');
    if (pathname === '/es/sobre-nosotros' || pathname === '/es/sobre-nosotros/')
      return rewrite('/es/about/');
    if (pathname === '/es/contacto' || pathname === '/es/contacto/')
      return rewrite('/es/contact/');
    if (pathname === '/es/mapa-del-sitio' || pathname === '/es/mapa-del-sitio/')
      return rewrite('/es/sitemap/');
    if (pathname === '/es/legal/privacidad' || pathname === '/es/legal/privacidad/')
      return rewrite('/es/legal/privacy/');
    if (pathname === '/es/legal/terminos' || pathname === '/es/legal/terminos/')
      return rewrite('/es/legal/terms/');

    // Dynamic vehicle slugs: /es/vehiculos/{slug}/ → /es/vehicles/{slug}/
    if (pathname.startsWith('/es/vehiculos/')) {
      const slug = pathname.replace('/es/vehiculos/', '').replace(/\/$/, '');
      if (slug && slug !== 'en-alquiler' && slug !== 'en-venta')
        return rewrite(`/es/vehicles/${slug}/`);
    }

    // Block direct access to technical paths — redirect to localized
    if (pathname === '/es/vehicles' || pathname === '/es/vehicles/')
      return redirect('/es/vehiculos/');
    if (pathname === '/es/vehicles/for-rent' || pathname === '/es/vehicles/for-rent/')
      return redirect('/es/vehiculos/en-alquiler/');
    if (pathname === '/es/vehicles/for-sell' || pathname === '/es/vehicles/for-sell/')
      return redirect('/es/vehiculos/en-venta/');
    if (pathname === '/es/contact' || pathname === '/es/contact/')
      return redirect('/es/contacto/');
    if (pathname === '/es/about' || pathname === '/es/about/')
      return redirect('/es/sobre-nosotros/');
    if (pathname === '/es/sitemap' || pathname === '/es/sitemap/')
      return redirect('/es/mapa-del-sitio/');
    if (pathname === '/es/legal/privacy' || pathname === '/es/legal/privacy/')
      return redirect('/es/legal/privacidad/');
    if (pathname === '/es/legal/terms' || pathname === '/es/legal/terms/')
      return redirect('/es/legal/terminos/');

    // Dynamic vehicle detail redirects (technical → localized)
    if (pathname.startsWith('/es/vehicles/')) {
      const slug = pathname.replace('/es/vehicles/', '').replace(/\/$/, '');
      if (slug) return redirect(`/es/vehiculos/${slug}/`);
    }
  }

  return resolve(event);
};
