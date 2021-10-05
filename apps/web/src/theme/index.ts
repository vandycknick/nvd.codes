import { extendTheme, ColorMode } from "@chakra-ui/react"
import styles from "./styles"
import colors from "./colors"
import { fonts } from "./fonts"

import Link from "./components/Link"

const config = {
  initialColorMode: "dark" as ColorMode,

  useSystemColorMode: true,
}

const overrides = {
  config,

  colors,

  fonts,

  styles,

  components: {
    Link,
  },
}

export default extendTheme(overrides)
