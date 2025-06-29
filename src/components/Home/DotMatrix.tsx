import { useCallback, useEffect, useRef, useState } from "react"
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
      opacities={[0.1, 0.1, 0.2, 0.2, 0.3, 0.5, 0.5, 0.8, 0.8, 1]}
      colors={colors}
      dotSize={3}
      reverse={false}
      totalSize={10}
    />
  )
}

const createShader = (GL: WebGL2RenderingContext) => {
  const compile = (type: number, source: string) => {
    const shader = GL.createShader(type)
    if (shader == null) return
    GL.shaderSource(shader, source)
    GL.compileShader(shader)
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      throw new Error(GL.getShaderInfoLog(shader) || "Shader compile error")
    }
    return shader
  }
  const vs = compile(GL.VERTEX_SHADER, vertexShader)
  const fs = compile(GL.FRAGMENT_SHADER, fragmentShader)

  const program = GL.createProgram()
  if (program == null || vs == null || fs == null) return
  GL.attachShader(program, vs)
  GL.attachShader(program, fs)
  GL.linkProgram(program)
  if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
    throw new Error(GL.getProgramInfoLog(program) || "Program link error")
  }
  GL.useProgram(program)

  const quad = new Float32Array([
    -1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0,
  ])

  const buffer = GL.createBuffer()
  GL.bindBuffer(GL.ARRAY_BUFFER, buffer)
  GL.bufferData(GL.ARRAY_BUFFER, quad, GL.STATIC_DRAW)

  const posLoc = GL.getAttribLocation(program, "position")
  GL.enableVertexAttribArray(posLoc)
  GL.vertexAttribPointer(posLoc, 3, GL.FLOAT, false, 0, 0)

  const uTime = GL.getUniformLocation(program, "u_time")
  const uDotSize = GL.getUniformLocation(program, "u_dot_size")
  const uTotalSize = GL.getUniformLocation(program, "u_total_size")
  const uReverse = GL.getUniformLocation(program, "u_reverse")
  const uResolution = GL.getUniformLocation(program, "u_resolution")
  const uOpacities = GL.getUniformLocation(program, "u_opacities")
  const uColors = GL.getUniformLocation(program, "u_colors")

  let elapsed = 0
  return {
    use() {
      GL.useProgram(program)
      GL.bindBuffer(GL.ARRAY_BUFFER, buffer)
      GL.bufferData(GL.ARRAY_BUFFER, quad, GL.STATIC_DRAW)
    },
    setOpacities(o: Opacities) {
      GL.uniform1fv(uOpacities, new Float32Array(o))
    },
    setColors(c: number[]) {
      GL.uniform3fv(uColors, new Float32Array(c))
    },
    setDotsize(d: number) {
      GL.uniform1f(uDotSize, d)
    },
    setTotalsize(s: number) {
      GL.uniform1f(uTotalSize, s)
    },
    setReverse(r: boolean) {
      GL.uniform1i(uReverse, r ? 1 : 0)
    },
    incrementTime(t: number) {
      elapsed = elapsed + t
      GL.uniform1f(uTime, elapsed / 1000)
    },
    setResolution(width: number, height: number) {
      GL.uniform2f(uResolution, width, height)
    },
  }
}

const useAnimationFrame = (callback: (time: number) => void) => {
  const requestRef = useRef<number | undefined>(undefined)
  const previousTimeRef = useRef<number>(performance.now())

  const animate = (time: number) => {
    const deltaTime = time - previousTimeRef.current
    callback(deltaTime)
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current == undefined) return
      cancelAnimationFrame(requestRef.current)
    }
  }, [])
}

let skipIntro = false

type DotMatrixProps = {
  colors: [Color, Color?, Color?]
  dotSize: number
  reverse: boolean
  opacities: Opacities
  totalSize: number
}

export const DotMatrixWebGLCanvas = ({
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  className,
  dotSize = 2,
  totalSize = 20,

  reverse = false,
}: DotMatrixProps & { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const glRef = useRef<WebGL2RenderingContext | undefined>(undefined)
  const shaderRef = useRef<ReturnType<typeof createShader> | undefined>(
    undefined,
  )

  const explodeColors = useCallback(() => {
    if (colors.length === 1) {
      return [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]]
    }
    if (colors.length === 2) {
      return [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]]
    } else {
      return [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]
    }
  }, [colors])

  useEffect(() => {
    const { current: canvas } = canvasRef
    if (canvas == undefined) return

    const GL = canvas.getContext("webgl2")
    if (!GL) return

    glRef.current = GL

    const shader = createShader(GL)
    if (!shader) return

    shaderRef.current = shader

    const colorVec = explodeColors()
      .filter((c) => c !== undefined)
      .flatMap(([r, g, b]) => [r / 255, g / 255, b / 255])

    shader.setOpacities(opacities)
    shader.setColors(colorVec)
    shader.setDotsize(dotSize)
    shader.setTotalsize(totalSize)
    shader.setReverse(reverse)

    if (skipIntro) {
      shader.incrementTime(10000)
    }
    skipIntro = true

    const resize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        GL.viewport(0, 0, width, height)
        shader.setResolution(width, height)
      }
    }

    resize()
    window.addEventListener("resize", resize)
    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [])

  useEffect(() => {
    const { current: shader } = shaderRef

    if (shader == undefined) return

    const colorVec = explodeColors()
      .filter((c) => c !== undefined)
      .flatMap(([r, g, b]) => [r / 255, g / 255, b / 255])

    shader.setOpacities(opacities)
    shader.setColors(colorVec)
    shader.setDotsize(dotSize)
    shader.setTotalsize(totalSize)
    shader.setReverse(reverse)
  }, [colors, opacities, dotSize, totalSize, reverse, explodeColors])

  useAnimationFrame((time) => {
    const { current: GL } = glRef
    const { current: shader } = shaderRef

    if (GL == undefined) return
    if (shader == undefined) return

    shader.use()

    GL.clearColor(0, 0, 0, 0)
    GL.clear(GL.COLOR_BUFFER_BIT)

    shader.incrementTime(time)
    GL.drawArrays(GL.TRIANGLES, 0, 6)
  })

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  )
}
