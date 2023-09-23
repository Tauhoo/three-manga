import * as THREE from 'three'
import { normalFragment, normalVertex } from './shader'

class NormalMaterial extends THREE.ShaderMaterial {
  readonly uniforms: { [uniform: string]: THREE.IUniform }
  readonly vertexShader: string
  readonly fragmentShader: string

  constructor() {
    super()
    this.type = 'MangaNormalMaterial'
    this.fragmentShader = normalFragment
    this.vertexShader = normalVertex
    this.glslVersion = THREE.GLSL3
  }
}

export { NormalMaterial }
