import { vi } from 'vitest';

const intersectionObserverMock = () => ({
  observe: () => null,
});
window.IntersectionObserver = vi
  .fn()
  .mockImplementation(intersectionObserverMock);
