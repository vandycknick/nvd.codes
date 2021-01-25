import { extendTheme } from "@chakra-ui/react"
import styles from "./styles"
import colors from "./colors"

import Link from "./components/Link"

const config = {
  initialColorMode: "dark",

  useSystemColorMode: true,
}

const overrides = {
  config,

  colors,

  styles,

  components: {
    Link,
  },
}

export default extendTheme(overrides)
