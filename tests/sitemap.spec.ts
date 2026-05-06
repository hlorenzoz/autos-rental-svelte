import { test, expect } from '@playwright/test';
import vehiclesData from '../src/lib/data/vehicles.json' with { type: 'json' };

const vehicles = vehiclesData.vehicles;
const slugs = vehicles.map(v => v.slug);

// Define all expected URLs that MUST be in the sitemap
const expectedPaths = [
  '/',
  '/en/',
  '/es/',
  '/en/about/',
  '/es/sobre-nosotros/',
  '/en/contact/',
  '/es/contacto/',
  '/en/legal/cookies/',
  '/es/legal/cookies/',
  '/en/legal/privacy/',
  '/es/legal/privacidad/',
  '/en/legal/terms/',
  '/es/legal/terminos/',
  '/en/sitemap/',
  '/es/mapa-del-sitio/',
  '/en/vehicles/',
  '/es/vehiculos/',
  '/en/vehicles/for-rent/',
  '/es/vehiculos/en-alquiler/',
  '/en/vehicles/for-sell/',
  '/es/vehiculos/en-venta/',
  ...slugs.map(s => `/en/vehicles/${s}/`),
  ...slugs.map(s => `/es/vehiculos/${s}/`),
];

test.describe('Sitemap Integrity', () => {
  test('sitemap.xml should contain all expected URLs', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml');
    expect(response?.status()).toBe(200);
    
    const xml = await response?.text();
    if (!xml) throw new Error('Sitemap is empty');

    // Extract all <loc> entries
    const locs = xml.match(/<loc>(.*?)<\/loc>/g)?.map(l => l.replace(/<\/?loc>/g, '')) || [];
    
    // Convert full URLs to paths for comparison
    const sitemapPaths = locs.map(loc => {
      try {
        const url = new URL(loc);
        return url.pathname;
      } catch {
        return loc;
      }
    });

    const uniqueExpected = [...new Set(expectedPaths)];
    const missingPaths = uniqueExpected.filter(p => !sitemapPaths.includes(p));
    
    if (missingPaths.length > 0) {
      console.log(`Browser: ${test.info().project.name}`);
      console.log(`Total Expected: ${uniqueExpected.length}, Total Found: ${sitemapPaths.length}`);
      console.log('First 5 Sitemap Paths:', sitemapPaths.slice(0, 5));
      console.error('Missing paths in sitemap (first 10):', missingPaths.slice(0, 10));
    }

    expect(missingPaths).toHaveLength(0);
  });

  test('sitemap.xml should not contain technical English paths in Spanish locale', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml');
    const xml = await response?.text();
    if (!xml) throw new Error('Sitemap is empty');

    const locs = xml.match(/<loc>(.*?)<\/loc>/g)?.map(l => l.replace(/<\/?loc>/g, '')) || [];
    const alternates = xml.match(/href="(.*?)"/g)?.map(h => h.replace(/href="(.*?)"/, '$1')) || [];

    const allPaths = [...locs, ...alternates].map(link => {
      try {
        const url = new URL(link);
        return url.pathname;
      } catch {
        return link;
      }
    });
    
    const technicalEsPaths = [...new Set(allPaths.filter(p => 
      p.startsWith('/es/') && (
        p.includes('/vehicles/') || 
        p === '/es/contact/' || p === '/es/contact' ||
        p === '/es/about/' || p === '/es/about' ||
        p === '/es/sitemap/' || p === '/es/sitemap' ||
        p === '/es/legal/privacy/' || p === '/es/legal/privacy' ||
        p === '/es/legal/terms/' || p === '/es/legal/terms'
      )
    ))];

    if (technicalEsPaths.length > 0) {
      console.error('Technical ES paths found in sitemap:', technicalEsPaths);
    }

    expect(technicalEsPaths).toHaveLength(0);
  });
});
