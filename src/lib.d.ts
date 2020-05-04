declare module "normalize.css" {
  declare const styles: string
  export default styles
}

declare namespace JSX {
  interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "css-doodle": any
  }
}
