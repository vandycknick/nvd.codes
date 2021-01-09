declare const global: unknown

declare module "service-worker-mock" {
  const makeServiceWorkerEnv: () => void
  export = makeServiceWorkerEnv
}
