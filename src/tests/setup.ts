import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('$app/environment', () => ({
  browser: false,
  building: false,
  dev: true,
  version: '0.0.1'
}));
