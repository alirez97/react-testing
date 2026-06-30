import '@testing-library/jest-dom/vitest';
import { PropsWithChildren } from 'react';
import { setLogger } from 'react-query';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn().mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
  }),
  Auth0Provider: ({ children }: PropsWithChildren) => children,
  withAuthenticationRequired: vi.fn(),
}));

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {}, // suppress errors in tests
});
