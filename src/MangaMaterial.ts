import * as THREE from 'three'
import { mangaFragment, mangaVertex, MangaShaderMode } from './shader'

type LightInfo = {
  cameraP: THREE.Matrix4
  cameraV: THREE.Matrix4
  position: THREE.Vector2
  deptMap: THREE.Texture
}
type MangaUniform = {
  uMode: THREE.IUniform<MangaShaderMode>
  uLightInfos: THREE.IUniform<LightInfo[]>
  uNormalMap?: THREE.IUniform<THREE.Texture>
  uResolution: THREE.IUniform<THREE.Vector2>
}

type MangaMaterialParams = {
  uniforms: MangaUniform
  maxLightSources: number
}

class MangaMaterial extends THREE.ShaderMaterial {
  readonly uniforms: { [uniform: string]: THREE.IUniform }
  readonly vertexShader: string
  readonly fragmentShader: string

  constructor(params: MangaMaterialParams) {
    super()
    this.type = 'MangaMaterial'
    this.fragmentShader = mangaFragment
    this.vertexShader = mangaVertex
    this.glslVersion = THREE.GLSL3
    this.uniforms = params.uniforms
    this.defines = { MAX_LIGHT_SOURCES: params.maxLightSources }
  }
}

export { MangaMaterial, MangaUniform, MangaShaderMode, LightInfo }
