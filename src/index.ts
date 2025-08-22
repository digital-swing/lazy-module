type LoaderFn<T = unknown> = () => Promise<T>;
type LoaderType = LoaderFn<any> | readonly LoaderFn<any>[];

// Utilitaire pour extraire le type de chaque LoaderFn dans un tuple
type LoaderResults<T extends readonly LoaderFn<any>[]> = {
  [K in keyof T]: T[K] extends LoaderFn<infer R> ? R : never;
};

type LoaderResult<T extends LoaderType> =
  T extends LoaderFn<infer R>
    ? R
    : T extends readonly LoaderFn<any>[]
      ? LoaderResults<T>
      : never;

export type LazyModuleConfig<
  T extends LoaderType = LoaderType,
  E extends Element = Element,
> = {
  /**
   * Function to execute after the module has been imported.
   *
   * @param    module - The imported module (type derived from loader)
   * @param    element - The element that triggered the module import
   */
  callback?: (module: LoaderResult<T>, element: E) => void | Promise<void>;

  /**
   * LazyModules dependencies, in case one or many other modules must be loaded first.
   */
  dependsOn?: LazyModule<any> | LazyModule<any>[];

  /**
   * Should the module be loaded when the trigger enters the viewport, or deferred to when the browser is idle.
   */
  lazy?: boolean;

  /**
   * Function(s) that load(s) the module.
   *
   * @returns  The module that has been loaded. It can be anything: a class, a constant...
   */
  loader: T;

  /**
   * Intersection Observer options
   */
  observerOptions?: IntersectionObserverInit;

  /**
   * What triggers the module loading.
   */
  when?: 'immediate' | 'interact' | 'idle';

  /**
   * What triggers the module loading in `interact` mode.
   */
  on?: 'scroll' | 'click' | 'hover';

  /**
   * Element to watch
   */
  trigger?: string | NodeListOf<E>;
};

export class LazyModule<
  const T extends LoaderType = LoaderType,
  E extends Element = Element,
> {
  trigger: NodeListOf<E> = document.querySelectorAll<E>('root');
  loader!: T;
  callback?: (module: LoaderResult<T>, element: E) => void | Promise<void>;
  lazy: boolean = true;
  when: 'immediate' | 'interact' | 'idle' = 'interact';
  on: 'scroll' | 'click' | 'hover' = 'scroll';
  dependsOn: LazyModule<any>[] = [];
  observerOptions: IntersectionObserverInit = {
    root: document,
    rootMargin: '0px 0px 0px 0px',
    threshold: 0.0,
  };

  constructor(config: LazyModuleConfig<T, E>) {
    Object.assign(this, config);
    this.trigger =
      typeof this.trigger === 'string'
        ? document.querySelectorAll<E>(this.trigger)
        : this.trigger;
    this.dependsOn = Array.isArray(this.dependsOn)
      ? this.dependsOn
      : this.dependsOn
        ? [this.dependsOn]
        : [];
  }

  init = () => {
    if (this.trigger) {
      switch (this.on) {
        case 'scroll':
          if ('requestIdleCallback' in window && !this.lazy) {
            window.requestIdleCallback(this._loadModule);
          } else {
            const observer = new IntersectionObserver(
              this._handleIntersect,
              this.observerOptions
            );
            this.trigger.forEach((el: E) => {
              observer.observe(el);
            });
          }
          break;
        case 'click':
          this.trigger.forEach((el: E) => {
            el.addEventListener('click', (e) => this._handleClick(e), {
              once: true,
            });
          });
          break;
        case 'hover':
          this.trigger.forEach((el: E) => {
            el.addEventListener('mouseenter', () => this._loadModule());
          });
          break;
      }
    }
  };

  _loadModule = async () => {
    await Promise.all(
      this.dependsOn.map((module) => module._loadModule())
    ).then(async () => {
      let result: LoaderResult<T>;
      if (typeof this.loader === 'function') {
        result = (await (this.loader as LoaderFn)()) as LoaderResult<T>;
      } else if (
        Array.isArray(this.loader) &&
        this.loader.every((l) => typeof l === 'function')
      ) {
        result = (await Promise.all(
          (this.loader as LoaderFn[]).map((fn) => fn())
        )) as LoaderResult<T>;
      } else {
        throw new Error('Invalid loader type');
      }

      Array.prototype.forEach.call(this.trigger, (trig: E) => {
        this.callback && void this.callback(result, trig);
      });
    });
  };

  _handleIntersect = (
    domElements: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    domElements.forEach((el) => {
      if (el.isIntersecting) {
        void this._loadModule().finally(() => observer.disconnect());
      }
    });
  };

  _handleClick = async (e: Event) => {
    await this._loadModule().then(() => {
      e.target?.dispatchEvent(new Event('click', { bubbles: true }));
    });
  };
}
