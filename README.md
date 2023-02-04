# lazy-module

<div align="center">

![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/LucasDemea/47afa2dca4215d90df6248220a886a3e/raw/lazy-module__heads_main.json&style=flat-square)
[![CI Status](https://github.com/digital-swing/lazy-module/actions/workflows/test.yml/badge.svg)](https://github.com/digital-swing/lazy-module/actions/workflows/test.yml)

Reduce initial page load time by asynchronously loading modules, only when they are required.

</div>

## Installation

```console
npm install @digital-swing/lazy-module
```

```console
yarn add @digital-swing/lazy-module
```

## Usage example

`import { moduleLoader } from '@digital-swing/lazy-module';`

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

## Custom parameters

[See the full API in the docs](https://digital-swing.github.io/lazy-module/types/types/LazyModuleConfig.html).

## License

MIT
