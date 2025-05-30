import { useEffect, useRef, useState } from "react"
// import { Canvas, useFrame, useThree } from "@react-three/fiber"
// import * as THREE from "three"
//
// import { cn } from "@/lib/utils"
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

// export const DotMatrixThemedAnimation = () => {
//   const [colors, setColors] = useState<[Color, Color]>(
//     window.localStorage.isDarkMode === "false" ? white : black,
//   )
//
//   useEffect(() => {
//     document.addEventListener("themeChanged", (({ detail }: CustomEvent) => {
//       setColors(detail === "dark" ? black : white)
//     }) as unknown as EventListener)
//   }, [])
//
//   return (
//     <DotMatrixAnimation
//       className="dark:bg-zinc-950"
//       colors={colors}
//       dotSize={6}
//       reverse={false}
//     />
//   )
// }
//
// export const DotMatrixAnimation = ({
//   opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
//   colors = [[0, 255, 255]],
//   className,
//   dotSize = 2,
//   totalSize = 20,
//   reverse = false,
// }: {
//   opacities?: Opacities
//   colors?: [Color, Color?, Color?]
//   className?: string
//   dotSize?: number
//   totalSize?: number
//   showGradient?: boolean
//   reverse?: boolean
// }) => {
//   return (
//     <div className={cn("relative h-full w-full", className)}>
//       <Canvas className="absolute inset-0  h-full w-full">
//         <DotMatrix
//           dotSize={dotSize}
//           totalSize={totalSize}
//           reverse={reverse}
//           opacities={opacities}
//           colors={colors}
//         />
//       </Canvas>
//     </div>
//   )
// }
//
type DotMatrixProps = {
  colors: [Color, Color?, Color?]
  dotSize: number
  reverse: boolean
  opacities: Opacities
  totalSize: number
}
//
// const DotMatrix = ({
//   colors,
//   dotSize,
//   reverse,
//   opacities,
//   totalSize,
// }: DotMatrixProps) => {
//   const { size } = useThree()
//   const explodeColors = () => {
//     if (colors.length === 1) {
//       return [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]]
//     }
//     if (colors.length === 2) {
//       return [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]]
//     } else {
//       return [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]
//     }
//   }
//
//   const material = useMemo(
//     () =>
//       new THREE.ShaderMaterial({
//         vertexShader,
//         fragmentShader,
//         uniforms: {
//           u_time: { value: 0 },
//           u_opacities: {
//             value: opacities,
//           },
//           u_colors: {
//             value: explodeColors()
//               .filter((c) => c != undefined)
//               .map((color) =>
//                 new THREE.Vector3().fromArray([
//                   color[0] / 255,
//                   color[1] / 255,
//                   color[2] / 255,
//                 ]),
//               ),
//           },
//           u_total_size: { value: totalSize },
//           u_dot_size: { value: dotSize },
//           u_resolution: {
//             value: new THREE.Vector2(size.width * 2, size.height * 2),
//           },
//           u_reverse: { value: reverse },
//         },
//         glslVersion: THREE.GLSL3,
//         blending: THREE.CustomBlending,
//         blendSrc: THREE.SrcAlphaFactor,
//         blendDst: THREE.OneFactor,
//       }),
//     [size.width, size.height, colors, reverse],
//   )
//
//   useFrame(({ clock }) => {
//     const timestamp = clock.getElapsedTime()
//     material.uniforms.u_time.value = timestamp
//   })
//
//   return (
//     <mesh>
//       <planeGeometry args={[2, 2]} />
//       <primitive object={material} attach="material" />
//     </mesh>
//   )
// }

export const DotMatrixThemedWebGLAnimation = () => {
  const [colors, setColors] = useState<[Color, Color]>(
    window.localStorage.isDarkMode === "false" ? white : black,
  )

  useEffect(() => {
    document.addEventListener("themeChanged", (({ detail }: CustomEvent) => {
      setColors(detail === "dark" ? black : white)
    }) as unknown as EventListener)
  }, [])

  return (
    <DotMatrixWebGLCanvas
      // className="dark:bg-zinc-950"
      opacities={[0.1, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 0.8, 0.9, 1.0]}
      colors={colors}
      dotSize={3}
      reverse={false}
      totalSize={10}
    />
  )
}

let hasRendered = false

export const DotMatrixWebGLCanvas = ({
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  className,
  dotSize = 2,
  totalSize = 20,
  reverse = false,
}: DotMatrixProps & { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2")
    if (!gl) return

    // Compile shader
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (shader == null) return
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compile error")
      }
      return shader
    }

    const vs = compile(gl.VERTEX_SHADER, vertexShader)
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShader)

    // Create program
    const program = gl.createProgram()
    if (program == null || vs == null || fs == null) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Program link error")
    }
    gl.useProgram(program)

    // Fullscreen quad
    const quad = new Float32Array([
      -1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0,
    ])

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)

    // Set uniforms
    const uTime = gl.getUniformLocation(program, "u_time")
    const uDotSize = gl.getUniformLocation(program, "u_dot_size")
    const uTotalSize = gl.getUniformLocation(program, "u_total_size")
    const uReverse = gl.getUniformLocation(program, "u_reverse")
    const uResolution = gl.getUniformLocation(program, "u_resolution")
    const uOpacities = gl.getUniformLocation(program, "u_opacities")
    const uColors = gl.getUniformLocation(program, "u_colors")

    // const explodeColors = () => {
    //   if (colors.length === 1) return Array(6).fill(colors[0])
    //   if (colors.length === 2)
    //     return [...Array(3).fill(colors[0]), ...Array(3).fill(colors[1])]
    //   return [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]
    // }

    const explodeColors = () => {
      if (colors.length === 1) {
        return [
          colors[0],
          colors[0],
          colors[0],
          colors[0],
          colors[0],
          colors[0],
        ]
      }
      if (colors.length === 2) {
        return [
          colors[0],
          colors[0],
          colors[0],
          colors[1],
          colors[1],
          colors[1],
        ]
      } else {
        return [
          colors[0],
          colors[0],
          colors[1],
          colors[1],
          colors[2],
          colors[2],
        ]
      }
    }

    const colorVec = explodeColors()
      .filter((c) => c !== undefined)
      .flatMap(([r, g, b]) => [r / 255, g / 255, b / 255])

    gl.uniform1fv(uOpacities, new Float32Array(opacities))
    gl.uniform3fv(uColors, new Float32Array(colorVec))
    gl.uniform1f(uDotSize, dotSize)
    gl.uniform1f(uTotalSize, totalSize)
    gl.uniform1i(uReverse, reverse ? 1 : 0)

    // function fitCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    //   const dpr = window.devicePixelRatio || 1
    //   const width = canvas.clientWidth * dpr
    //   const height = canvas.clientHeight * dpr
    //   if (canvas.width !== width || canvas.height !== height) {
    //     canvas.width = width
    //     canvas.height = height
    //     return true
    //   }
    //   return false
    // }

    const resize = () => {
      // if (fitCanvasToDisplaySize(canvas)) {
      //   gl.viewport(0, 0, canvas.width, canvas.height)
      //   gl.uniform2f(uResolution, canvas.width, canvas.height)
      // }
      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener("resize", resize)

    // gl.clearColor(0, 0, 0, 1)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const start = hasRendered ? performance.now() - 10000 : performance.now()
    let cancelled = false
    // const start = performance.now()
    const render = (time: number) => {
      if (cancelled) return

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(uTime, (time - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      hasRendered = true

      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
    return () => {
      cancelled = true
      window.removeEventListener("resize", resize)
    }
  }, [colors, opacities, dotSize, totalSize, reverse])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  )
}
