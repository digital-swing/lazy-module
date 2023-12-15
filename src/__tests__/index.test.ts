import { LazyModule } from '../index';

jest.mock('module');
// const MockedModule = Effect as jest.Mocked<typeof Effect>;

beforeEach(() => {
  document.body.innerHTML =
    '<div id="app">' +
    '<div class="test">' +
    '<h1>Test test</h1>' +
    '</div>' +
    '</div>';

  new LazyModule({
    callback: (module, el) => {},
    loader: () => {
      return import('module');
    },
    trigger: '.test',
  }).init();
});

const rootEl = document.body;

describe('LazyModule', () => {
  it('should import module', async () => {});
});
