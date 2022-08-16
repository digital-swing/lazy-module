declare type LazyModuleConfig = {
    trigger: string;
    loader: () => Promise<unknown>;
    callback: (module: unknown, element?: HTMLElement) => unknown;
    lazy: boolean;
    dependsOn: LazyModule[];
    observerOptions: {
        root: Element | Document | null;
        rootMargin: string;
        thresholds: Array<number>;
    };
};
declare class LazyModule {
    #private;
    trigger: string;
    loader: () => Promise<unknown>;
    callback: (module: unknown, element?: Element) => unknown;
    lazy: boolean;
    dependsOn: LazyModule[];
    observerOptions: {
        root: Document;
        rootMargin: string;
        thresholds: number;
    };
    constructor(config: Partial<LazyModuleConfig>);
    init: () => void;
    _loadModule: () => Promise<void>;
    _handleIntersect: (domElements: IntersectionObserverEntry[], observer: IntersectionObserver) => void;
}

export { LazyModule };
