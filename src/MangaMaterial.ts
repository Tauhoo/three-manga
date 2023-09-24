import * as THREE from 'three'
import { mangaFragment, mangaVertex } from './shader'
import { LightInfo, LightTexturePortion } from './light/MangaLightManager'

type LightInfoUniform = LightInfo
type LightTexturePortionUniform = LightTexturePortion

type MangaUniform = {
  uResolution: THREE.IUniform<THREE.Vector2>
  // use for render shadow
  uLightInfos: THREE.IUniform<LightInfoUniform[]>
  uShadowDepthMapPortions: THREE.IUniform<LightTexturePortionUniform[] | null>
  uShadowDepthMap: THREE.IUniform<THREE.Texture | null>
  uShadowDepthMapResolution: THREE.IUniform<THREE.Vec2>
  uShadowBias: THREE.IUniform<number>
  // use for render line
  uNormalMap: THREE.IUniform<THREE.Texture | null>
  uDeptMap: THREE.IUniform<THREE.Texture | null>
  uOutlinePixelStep: THREE.IUniform<number>
  uOutlineThreshold: THREE.IUniform<number>
  uInlinePixelStep: THREE.IUniform<number>
  uInlineThreshold: THREE.IUniform<number>
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

export {
  MangaMaterial,
  MangaUniform,
  LightInfoUniform,
  LightTexturePortionUniform,
}
