import { describe, it, expect, vi } from 'vitest';
import { handle } from './hooks.server';

function makeEvent(pathname: string) {
  const url = new URL(`https://example.com${pathname}`);
  return {
    url,
    request: new Request(url),
    locals: {},
    cookies: {} as any,
    platform: {},
    route: { id: null },
    params: {},
    isDataRequest: false,
    isSubRequest: false,
    setHeaders: vi.fn(),
    getClientAddress: vi.fn(),
    fetch: vi.fn(),
  };
}

async function callHandle(pathname: string) {
  const event = makeEvent(pathname) as any;
  const resolve = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
  const result = await handle({ event, resolve });
  return { event, resolve, result };
}

describe('handle (i18n URL middleware)', () => {
  it('rewrites /es/vehiculos/ to /es/vehicles/', async () => {
    const { resolve, event } = await callHandle('/es/vehiculos/');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/es/vehicles/');
  });

  it('rewrites /es/vehiculos/en-alquiler/ to /es/vehicles/for-rent/', async () => {
    const { resolve, event } = await callHandle('/es/vehiculos/en-alquiler/');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/es/vehicles/for-rent/');
  });

  it('rewrites /es/vehiculos/en-venta/ to /es/vehicles/for-sell/', async () => {
    const { resolve, event } = await callHandle('/es/vehiculos/en-venta/');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/es/vehicles/for-sell/');
  });

  it('rewrites /es/sobre-nosotros/ to /es/about/', async () => {
    const { resolve, event } = await callHandle('/es/sobre-nosotros/');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/es/about/');
  });

  it('rewrites /es/contacto/ to /es/contact/', async () => {
    const { resolve, event } = await callHandle('/es/contacto/');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/es/contact/');
  });

  it('rewrites /es/mapa-del-sitio/ to /es/sitemap/', async () => {
    const { resolve, event } = await callHandle('/es/mapa-del-sitio/');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/es/sitemap/');
  });

  it('rewrites /es/legal/privacidad/ to /es/legal/privacy/', async () => {
    const { resolve, event } = await callHandle('/es/legal/privacidad/');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/es/legal/privacy/');
  });

  it('rewrites /es/legal/terminos/ to /es/legal/terms/', async () => {
    const { resolve, event } = await callHandle('/es/legal/terminos/');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/es/legal/terms/');
  });

  it('rewrites dynamic vehicle slug /es/vehiculos/byd-seal/ to /es/vehicles/byd-seal/', async () => {
    const { resolve, event } = await callHandle('/es/vehiculos/byd-seal/');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/es/vehicles/byd-seal/');
  });

  it('redirects /es/vehicles/ to /es/vehiculos/ with 301', async () => {
    const { result, resolve } = await callHandle('/es/vehicles/');
    expect(resolve).not.toHaveBeenCalled();
    expect(result.status).toBe(301);
    expect(result.headers.get('Location')).toBe('/es/vehiculos/');
  });

  it('redirects /es/vehicles/for-rent/ to /es/vehiculos/en-alquiler/ with 301', async () => {
    const { result, resolve } = await callHandle('/es/vehicles/for-rent/');
    expect(resolve).not.toHaveBeenCalled();
    expect(result.status).toBe(301);
    expect(result.headers.get('Location')).toBe('/es/vehiculos/en-alquiler/');
  });

  it('redirects /es/vehicles/for-sell/ to /es/vehiculos/en-venta/ with 301', async () => {
    const { result, resolve } = await callHandle('/es/vehicles/for-sell/');
    expect(resolve).not.toHaveBeenCalled();
    expect(result.status).toBe(301);
    expect(result.headers.get('Location')).toBe('/es/vehiculos/en-venta/');
  });

  it('redirects /es/about/ to /es/sobre-nosotros/ with 301', async () => {
    const { result, resolve } = await callHandle('/es/about/');
    expect(resolve).not.toHaveBeenCalled();
    expect(result.status).toBe(301);
    expect(result.headers.get('Location')).toBe('/es/sobre-nosotros/');
  });

  it('redirects /es/contact/ to /es/contacto/ with 301', async () => {
    const { result, resolve } = await callHandle('/es/contact/');
    expect(resolve).not.toHaveBeenCalled();
    expect(result.status).toBe(301);
    expect(result.headers.get('Location')).toBe('/es/contacto/');
  });

  it('does not rewrite English URLs', async () => {
    const { resolve, event } = await callHandle('/en/vehicles/for-sell/');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/en/vehicles/for-sell/');
  });

  it('does not rewrite unmapped Spanish paths', async () => {
    const { resolve, event } = await callHandle('/es/random-page');
    expect(resolve).toHaveBeenCalled();
    expect(event.url.pathname).toBe('/es/random-page');
  });
});
