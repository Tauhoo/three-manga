import * as THREE from 'three'
import { mangaFragment, mangaVertex, MangaShaderMode } from './shader'

type MangaUniform = {
  uMode: THREE.IUniform<MangaShaderMode>
}

class MangaMaterial extends THREE.ShaderMaterial {
  readonly uniforms: { [uniform: string]: THREE.IUniform }
  readonly vertexShader: string
  readonly fragmentShader: string

  constructor(uniforms: MangaUniform) {
    super()
    this.type = 'MangaMaterial'
    this.fragmentShader = mangaFragment
    this.vertexShader = mangaVertex
    this.glslVersion = THREE.GLSL3
    this.uniforms = uniforms
  }
}

export { MangaMaterial, MangaUniform, MangaShaderMode }
