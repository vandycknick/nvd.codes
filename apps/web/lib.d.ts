interface IDisquss {
  reset(config: { reload: true }): void
}

declare const DISQUS: IDisquss
