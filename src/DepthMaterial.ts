import * as THREE from 'three'
import { depthFragment, depthVertex } from './shader'

class DepthMaterial extends THREE.ShaderMaterial {
  readonly uniforms: { [uniform: string]: THREE.IUniform }
  readonly vertexShader: string
  readonly fragmentShader: string

  constructor() {
    super()
    this.type = 'MangaDepthMaterial'
    this.fragmentShader = depthFragment
    this.vertexShader = depthVertex
    this.glslVersion = THREE.GLSL3
  }
}

export { DepthMaterial }
