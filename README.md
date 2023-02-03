# lazy-module

Asynchronously load modules when they are required, thus reducing initial page load time.

This package is useful if your app is loading heavy modules that you want to load only at the specific time they are required.

## Installation

```console
npm install lazy-module
```

```console
yarn add lazy-module
```

## Usage

`import { moduleLoader } from 'lazy-module';`

```js
new moduleLoader({
  trigger: '.swiper-button-next, .swiper-button-prev',
  loader: () => {
    import('swiper/css/navigation');
    return import('swiper' /* webpackChunkName: "swiper" */);
  },
  callback: (ImportedModule, el) => {
    ImportedModule.Swiper.use(ImportedModule.Navigation);
    el.closest('.swiper').swiper.update();
  },
  dependsOn: [swiper],
  observerOptions:{
    root: document.querySelector('body'),
    rootMargin: '200px',
    thresholds: 0.0,
    }
}),
```

## Constructor parameters

The constructor accepts an object with the following properties:

```js
type ModuleLoaderConfig = {
  /**
   * Element to watch
   */
  trigger: string,

  /**
   * Module to load
   *
   * @return  {<unknown>}The module that has been loaded. It can be anything: a class, a constant...
   */
  loader: () => Promise<unknown>,

  /**
   * What should be executed after the module has been imported.
   *
   * @param   {unknown}      module   The imported module
   * @param   {HTMLElement}  element  The element that triggered the module import
   *
   * @return  {<module>}              [return description]
   */
  callback: (module: unknown, element?: HTMLElement) => unknown,

  /**
   * Should the module be loaded when the trigger enters the viewport, or deferred to when the browser is idle.
   */
  lazy: boolean,

  /**
   * Modules dependencies, in case one or many other modules must be loaded first.
   */
  dependsOn: moduleLoader[],

  /**
   * Intersection Observer options
   */
  observerOptions: {
    /**
     * The element used as viewport
     */
    root: Element | Document | null,

    /**
     * The distance from the root where the trigger will load the module
     */
    rootMargin: string,

    /**
     * Percentage of trigger visibility inside root
     */
    thresholds: Array<number>,
  },
};
```

## License

MIT
