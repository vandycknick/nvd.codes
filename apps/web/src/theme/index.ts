import { extendTheme } from "@chakra-ui/react"
import styles from "./styles"

import Link from "./components/Link"

const config = {
  initialColorMode: "dark",

  useSystemColorMode: true,
}

const overrides = {
  config,

  styles,

  components: {
    Link,
  },
}

export default extendTheme(overrides)
