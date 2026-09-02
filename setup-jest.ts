import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

Object.defineProperty(window, 'scrollTo', {
  configurable: true,
  value: jest.fn()
});