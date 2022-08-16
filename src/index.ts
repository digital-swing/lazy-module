import 'intersection-observer';
import 'requestidlecallback-polyfill';

type LazyModuleConfig = {
  /**
   * Element to watch
   */
  trigger: string;
  /**
   * Module to load
   *
   * @return  {<unknown>}The module that has been loaded. It can be anything: a class, a constant...
   */
  loader: () => Promise<unknown>;
  /**
   * What should be executed after the module has been imported.
   *
   * @param   {unknown}      module   The imported module
   * @param   {HTMLElement}  element  The element that triggered the module import
   *
   * @return  {<module>}              [return description]
   */
  callback: (module: unknown, element?: HTMLElement) => unknown;

  /**
   * Should the module be loaded when the trigger enters the viewport, or deferred to when the browser is idle.
   */
  lazy: boolean;

  /**
   * Modules dependencies, in case one or many other modules must be loaded first.
   */
  dependsOn: LazyModule[];

  /**
   * Intersection Observer options
   */
  observerOptions: {
    /**
     * The element used as viewport
     */
    root: Element | Document | null;

    /**
     * The distance from the root where the trigger will load the module
     */
    rootMargin: string;

    /**
     * Percentage of trigger visibility inside root
     */
    thresholds: Array<number>;
  };
};

export class LazyModule {
  trigger = 'root';
  loader: () => Promise<unknown> = () => Promise.resolve();
  callback: (module: unknown, element?: Element) => unknown = () => {};
  lazy = true;
  dependsOn: LazyModule[] = [];
  observerOptions = {
    root: document,
    rootMargin: '0px 0px 0px 0px',
    thresholds: 0.0,
  };
  #targets: NodeListOf<Element>;
  constructor(config: Partial<LazyModuleConfig>) {
    Object.assign(this, config);
    this.#targets = document.querySelectorAll(this.trigger);
  }

  init = () => {
    //if component found on page
    if (this.#targets) {
      if ('requestIdleCallback' in window && !this.lazy) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        window.requestIdleCallback(this._loadModule);
      } else {
        const observer = new IntersectionObserver(
          this._handleIntersect,
          this.observerOptions
        );
        this.#targets.forEach((el) => {
          observer.observe(el);
        });
      }
    }
  };

  _loadModule = async () => {
    // wait for all dependencies to be loaded
    await Promise.all(
      Array.isArray(this.dependsOn)
        ? this.dependsOn.map((module) => module._loadModule())
        : [this.dependsOn]
    ).then(() => {
      this.loader()
        .then((module) => {
          this.#targets.forEach((element) => {
            this.callback(module, element);
          });
        })
        .catch((error: Error) => {
          console.error(error.message);
        });
    });
  };

  _handleIntersect = (
    domElements: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    domElements.forEach((el) => {
      if (el.isIntersecting) {
        this._loadModule().finally(() => observer.disconnect());
      }
    });
  };
}
