import { describe, it, expect } from 'vitest';
import { reroute } from './hooks';

describe('reroute hook (Localized URL to Technical Path)', () => {
  function callReroute(pathname: string) {
    const url = new URL(`https://example.com${pathname}`);
    return reroute({ url, fetch: () => Promise.resolve(new Response()) } as any);
  }

  it('rewrites /es/vehiculos/ to /es/vehicles/', () => {
    expect(callReroute('/es/vehiculos/')).toBe('/es/vehicles/');
  });

  it('rewrites /es/vehiculos/en-alquiler/ to /es/vehicles/for-rent/', () => {
    expect(callReroute('/es/vehiculos/en-alquiler/')).toBe('/es/vehicles/for-rent/');
  });

  it('rewrites /es/vehiculos/en-venta/ to /es/vehicles/for-sell/', () => {
    expect(callReroute('/es/vehiculos/en-venta/')).toBe('/es/vehicles/for-sell/');
  });

  it('rewrites /es/sobre-nosotros/ to /es/about/', () => {
    expect(callReroute('/es/sobre-nosotros/')).toBe('/es/about/');
  });

  it('rewrites /es/contacto/ to /es/contact/', () => {
    expect(callReroute('/es/contacto/')).toBe('/es/contact/');
  });

  it('rewrites /es/mapa-del-sitio/ to /es/sitemap/', () => {
    expect(callReroute('/es/mapa-del-sitio/')).toBe('/es/sitemap/');
  });

  it('rewrites /es/legal/privacidad/ to /es/legal/privacy/', () => {
    expect(callReroute('/es/legal/privacidad/')).toBe('/es/legal/privacy/');
  });

  it('rewrites /es/legal/terminos/ to /es/legal/terms/', () => {
    expect(callReroute('/es/legal/terminos/')).toBe('/es/legal/terms/');
  });

  it('rewrites dynamic vehicle slug /es/vehiculos/byd-seal/ to /es/vehicles/byd-seal/', () => {
    expect(callReroute('/es/vehiculos/byd-seal/')).toBe('/es/vehicles/byd-seal/');
  });

  it('does not rewrite English URLs', () => {
    expect(callReroute('/en/vehicles/for-sell/')).toBe('/en/vehicles/for-sell/');
  });

  it('does not rewrite unmapped Spanish paths', () => {
    expect(callReroute('/es/random-page')).toBe('/es/random-page');
  });
});
