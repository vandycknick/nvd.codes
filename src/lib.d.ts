declare module "normalize.css" {
  declare const styles: string
  export default styles
}

declare module "css-doodle" {}

declare namespace JSX {
  interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "css-doodle": any
  }
}
