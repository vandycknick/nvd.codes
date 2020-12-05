import type { Config } from "@jest/types"

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: {
        resolveJsonModule: true,
        esModuleInterop: true,
      },
    },
  },
}
export default config
