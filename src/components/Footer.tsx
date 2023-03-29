import React from "react"

import { HeadingSix, Text } from "./Typography"

// const Footer = () => {
//   const bg = useColorModeValue("gray.50", "gray.900")
//   return (
//     <VStack bg={bg} pt="8" pb="4" as="footer">
//       <Text>
//         <strong>nvd.codes &nbsp;</strong>is handcrafted with ❤️&nbsp;
//         <Link
//           href="https://github.com/nickvdyck/nvd.codes"
//           isExternal
//           rel="noopener noreferrer"
//           display="inline-flex"
//         >
//           view source
//           <ExternalLinkIcon mx={1} mt="2px" />
//         </Link>
//       </Text>
//       <Text>all materials © Nick Van Dyck 2021</Text>
//     </VStack>
//   )
// }

const Footer = () => (
  <footer className="flex p-4 bg-nord-50 dark:bg-nord-600 transition-color transition duration-300">
    <div className="max-w-6xl w-full mx-auto px-4 md:px-0">
      <aside>
        <HeadingSix>nvd.codes</HeadingSix>
        <Text as="div" className="text-sm">
          all materials © Nick Van Dyck 2021
        </Text>
        <Text as="div" className="text-sm">
          Made with ❤️ in Belgium
        </Text>
      </aside>
    </div>
  </footer>
)

export { Footer }
