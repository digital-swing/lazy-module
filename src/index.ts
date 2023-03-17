import 'intersection-observer';
import 'requestidlecallback-polyfill';

export type LazyModuleConfig = {
  /**
   * Function to execute after the module has been imported.
   *
   * @param    module - The imported module
   * @param    element - The element that triggered the module import
   *
   */
  callback?: (module: unknown, element?: HTMLElement) => Promise<void>;
  /**
   * LazyModules dependencies, in case one or many other modules must be loaded first.
   */
  dependsOn?: LazyModule | LazyModule[];

  /**
   * Should the module be loaded when the trigger enters the viewport, or deferred to when the browser is idle.
   */
  lazy?: boolean;

  /**
   * Function that loads the module, or the es module resolve path.
   *
   * @returns  The module that has been loaded. It can be anything: a class, a constant...
   */
  loader: () => Promise<unknown>;

  /**
   * Intersection Observer options
   */
  observerOptions?: IntersectionObserverInit;

  /**
   * What triggers the module loading.
   */
  when?: 'immediate' | 'interact' | 'idle';

  /**
   * What triggers the module loading in `interaction` mode.
   */
  on?: 'scroll' | 'click' | 'hover';

  /**
   * Element to watch
   */
  trigger?: string | NodeListOf<HTMLElement>;
};

export class LazyModule {
  trigger: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>('root');
  loader!: () => Promise<unknown>;
  callback!: Required<LazyModuleConfig>['callback'];
  lazy: Required<LazyModuleConfig>['lazy'] = true;
  when: Required<LazyModuleConfig>['when'] = 'interact';
  on: Required<LazyModuleConfig>['on'] = 'scroll';
  dependsOn: LazyModule[] = [];
  observerOptions: Required<LazyModuleConfig>['observerOptions'] = {
    root: document,
    rootMargin: '0px 0px 0px 0px',
    threshold: 0.0,
  };
  constructor(config: LazyModuleConfig) {
    Object.assign(this, config);
    this.trigger =
      typeof this.trigger === 'string'
        ? document.querySelectorAll(this.trigger)
        : this.trigger;
    this.dependsOn = Array.isArray(this.dependsOn)
      ? this.dependsOn
      : [this.dependsOn];
  }
  init = () => {
    // component found in page
    if (this.trigger) {
      switch (this.on) {
        case 'scroll':
          if ('requestIdleCallback' in window && !this.lazy) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            window.requestIdleCallback(this._loadModule);
          } else {
            const observer = new IntersectionObserver(
              this._handleIntersect,
              this.observerOptions
            );
            this.trigger.forEach((el: HTMLElement) => {
              observer.observe(el);
            });
          }
          break;
        case 'click':
          this.trigger.forEach((el: HTMLElement) => {
            el.addEventListener('click', this._handleClick, { once: true });
          });
          break;
        case 'hover':
          this.trigger.forEach((el: HTMLElement) => {
            el.addEventListener('mouseenter', this._loadModule);
          });
          break;
      }
    }
  };

  _loadModule = async () => {
    // wait for all dependencies to be loaded
    await Promise.all(
      this.dependsOn.map((module) => module._loadModule())
    ).then(async () => {
      await this.loader()
        .then(async (module) => {
          await Promise.all(
            Array.prototype.map.call(
              this.trigger,
              async (trig: HTMLElement) => {
                await this.callback(module, trig);
              }
            )
          );
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

  _handleClick = async (e: MouseEvent) => {
    await this._loadModule().then(() => {
      e.target?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  };
}
