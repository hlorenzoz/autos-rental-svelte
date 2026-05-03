import type { Locale } from '$lib/i18n/utils';
import type { Dictionary } from '$lib/i18n/en';

declare global {
  namespace App {
    interface Locals {
      locale: Locale;
    }
    interface PageData {
      locale: Locale;
      t: Dictionary;
    }
  }
}

export {};
