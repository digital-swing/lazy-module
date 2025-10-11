import { LazyModule } from '../index';
import '../__mocks__/intersectionObserverMock';

vi.mock('module', () => ({
  default: { name: 'MockedModule' },
}));

describe('LazyModule', () => {
  const mockLoader = vi.fn(() => import('module'));
  const mockCallback = vi.fn();

  beforeEach(() => {
    document.body.innerHTML =
      '<div id="app">' +
      '<div class="test">' +
      '<h1>Test test</h1>' +
      '</div>' +
      '</div>';

    vi.clearAllMocks();
  });

  const rootEl = document.body;

  it('should import module', async () => {
    new LazyModule({
      loader: mockLoader,
      callback: mockCallback,
      trigger: '.test',
      on: 'click',
    }).init();

    const el = document.querySelector<HTMLElement>('.test')!;
    expect(el).not.toBeNull();

    // Simule un clic sur l’élément déclencheur
    el.click();

    // On attend un peu que la promesse async du loader se résolve
    await Promise.resolve();

    // ✅ Vérifie que le loader a bien été appelé
    expect(mockLoader).toHaveBeenCalledTimes(1);

    // ✅ Vérifie que le callback a été appelé avec le module mocké
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      { default: { name: 'MockedModule' } }, // module importé
      el // élément déclencheur
    );
  });
});
