# lazy-module

<div align="center">

![Typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square) ![Gzip](https://img.shields.io/bundlephobia/minzip/@digital-swing/lazy-module?color=green&label=gzipped&style=flat-square) ![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/LucasDemea/47afa2dca4215d90df6248220a886a3e/raw/lazy-module__heads_main.json&style=flat-square)
[![CI Status](https://github.com/digital-swing/lazy-module/actions/workflows/test.yml/badge.svg)](https://github.com/digital-swing/lazy-module/actions/workflows/test.yml)

🚀 Reduce initial page load time by asynchronously loading modules, only when they are required. 🚀

</div>

## 📥 Installation

@digital-swing/lazy-module is available as a npm package.

### npm

```console
npm install @digital-swing/lazy-module
```

### yarn

```console
yarn add @digital-swing/lazy-module
```

Then import it as a esm package in your app :

```js
import  { LazyModule } from '@digital-swing/lazy-module';
```

## 🛠️ Usage

### Simple

```js
const moduleLoader = new moduleLoader({
  trigger: '.trigger',
  loader: 'my-module',
});

moduleLoader.init()
```

This will load the `my-module` module when it enters into view.

### With custom parameters

```js
const moduleLoader = new moduleLoader({
  trigger: '.swiper-button-next, .swiper-button-prev',
  loader: () => {
    import('swiper/css/navigation');
    return import('swiper' /* webpackChunkName: "swiper" */);
  },
  callback: (ImportedModule, el) => {
    ImportedModule.Swiper.use(ImportedModule.Navigation);
    el.closest('.swiper').swiper.update();
  },
  on: 'scroll',
  dependsOn: [swiper],
  observerOptions:{
    root: document.querySelector('body'),
    rootMargin: '200px',
    thresholds: 0.0,
    }
});

moduleLoader.init()
```

## 💬 Changelog

Please [see the CHANGELOG](https://github.com/digital-swing/ripple/blob/main/CHANGELOG.md) for more information about what has changed recently.

## 🐛 Testing

```console
npm test
```

[See the full API in the docs](https://digital-swing.github.io/lazy-module/types/types/LazyModuleConfig.html).

## 🌍 Contributing

Please [see CONTRIBUTING](https://github.com/digital-swing/lazy-module/blob/main/CONTRIBUTING.md) for details.

## 🔒 Security

If you discover any security related issues, please email lucas@digital-swing.com instead of using the issue tracker.

## 👥 Credits

[Lucas Demea](https://github.com/LucasDemea)

## 🗒 Roadmap

- Run callback in a service worker
