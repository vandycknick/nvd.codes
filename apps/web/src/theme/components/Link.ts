import { mode } from "@chakra-ui/theme-tools"
import { ComponentSingleStyleConfig } from "@chakra-ui/react"

const Link: ComponentSingleStyleConfig = {
  variants: {
    // you can name it whatever you want
    primary: (props) => {
      const { colorScheme } = props
      if (colorScheme == null) {
        return {}
      }

      return {
        color: mode(`${colorScheme}.600`, `${colorScheme}.300`)(props),
        _hover: {
          color: mode(`${colorScheme}.300`, `${colorScheme}.600`)(props),
        },
      }
    },
  },
  defaultProps: {
    variant: "primary",
  },
}

export default Link
