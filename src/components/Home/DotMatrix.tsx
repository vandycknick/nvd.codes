import { useEffect, useMemo, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

import { cn } from "@/lib/utils"
import fragmentShader from "./shaders/matrix.frag?raw"
import vertexShader from "./shaders/matrix.vert?raw"

type Opacities = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

type Color = [number, number, number]

const black: [Color, Color] = [
  [255, 255, 255],
  [255, 255, 255],
]
const white: [Color, Color] = [
  [0, 0, 0],
  [0, 0, 0],
]
const sleep = () => new Promise((res) => setTimeout(res, 5000))

export const DotMatrixThemedAnimation = () => {
  const [colors, setColors] = useState<[Color, Color]>(
    window.localStorage.isDarkMode === "false" ? white : black,
  )
  const [reverse, setReverse] = useState(false)
  console.log(reverse)

  useEffect(() => {
    // document.addEventListener("astro:before-preparation", (event) => {
    //   const originalLoader = event.loader
    //   setReverse(true)
    //
    //   event.loader = async function () {
    //     await sleep()
    //     await originalLoader()
    //     event.loader = originalLoader
    //   }
    // })

    document.addEventListener("themeChanged", ({ detail }: CustomEvent) => {
      console.log(detail, window.localStorage)
      setColors(detail === "dark" ? black : white)
    })
  }, [])

  return (
    <DotMatrixAnimation
      className="dark:bg-zinc-950"
      colors={colors}
      dotSize={6}
      reverse={reverse}
    />
  )
}

export const DotMatrixAnimation = ({
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  className,
  dotSize = 2,
  totalSize = 20,
  reverse = false,
}: {
  opacities?: Opacities
  colors?: [Color, Color?, Color?]
  className?: string
  dotSize?: number
  totalSize?: number
  showGradient?: boolean
  reverse?: boolean
}) => {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <Canvas className="absolute inset-0  h-full w-full">
        <DotMatrix
          dotSize={dotSize}
          totalSize={totalSize}
          reverse={reverse}
          opacities={opacities}
          colors={colors}
        />
      </Canvas>
    </div>
  )
}

type DotMatrixProps = {
  colors: [Color, Color?, Color?]
  dotSize: number
  reverse: boolean
  opacities: Opacities
  totalSize: number
}

const DotMatrix = ({
  colors,
  dotSize,
  reverse,
  opacities,
  totalSize,
}: DotMatrixProps) => {
  const { size } = useThree()
  const explodeColors = () => {
    if (colors.length === 1) {
      return [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]]
    }
    if (colors.length === 2) {
      return [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]]
    } else {
      return [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]
    }
  }

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          u_time: { value: 0 },
          u_opacities: {
            value: opacities,
          },
          u_colors: {
            value: explodeColors()
              .filter((c) => c != undefined)
              .map((color) =>
                new THREE.Vector3().fromArray([
                  color[0] / 255,
                  color[1] / 255,
                  color[2] / 255,
                ]),
              ),
          },
          u_total_size: { value: totalSize },
          u_dot_size: { value: dotSize },
          u_resolution: {
            value: new THREE.Vector2(size.width * 2, size.height * 2),
          },
          u_reverse: { value: reverse },
        },
        glslVersion: THREE.GLSL3,
        blending: THREE.CustomBlending,
        blendSrc: THREE.SrcAlphaFactor,
        blendDst: THREE.OneFactor,
      }),
    [size.width, size.height, colors, reverse],
  )

  useFrame(({ clock }) => {
    const timestamp = clock.getElapsedTime()
    material.uniforms.u_time.value = timestamp
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
