import * as THREE from 'three'
import { mangaFragment, mangaVertex, SHADOW_PATTERN } from './shader'
import { LightInfo, LightTexturePortion } from './light/MangaLightManager'

type LightInfoUniform = LightInfo
type LightTexturePortionUniform = LightTexturePortion

type MangaUniformData = {
  resolution: THREE.Vector2
  lightInfos: LightInfoUniform[]
  shadowDepthMapPortions: LightTexturePortionUniform[]
  shadowDepthMap: THREE.Texture
  shadowDepthMapResolution: THREE.Vec2
  shadowBias: number
  normalMap: THREE.Texture
  deptMap: THREE.Texture
}

type MangaUniform = {
  uResolution: THREE.IUniform<THREE.Vector2>
  // use for render shadow
  uLightInfos: THREE.IUniform<LightInfoUniform[]>
  uShadowDepthMapPortions: THREE.IUniform<LightTexturePortionUniform[] | null>
  uShadowDepthMap: THREE.IUniform<THREE.Texture | null>
  uShadowDepthMapResolution: THREE.IUniform<THREE.Vec2>
  uShadowBias: THREE.IUniform<number>
  uShadowPattern: THREE.IUniform<SHADOW_PATTERN> // user editable
  // use for render line
  uNormalMap: THREE.IUniform<THREE.Texture | null>
  uDeptMap: THREE.IUniform<THREE.Texture | null>
  uOutlinePixelStep: THREE.IUniform<number> // user editable
  uOutlineThreshold: THREE.IUniform<number> // user editable
  uInlinePixelStep: THREE.IUniform<number> // user editable
  uInlineThreshold: THREE.IUniform<number> // user editable
  // use for render hatching shadow pattern
  uHatchingVoronoiBaseCellSize: THREE.IUniform<number> // user editable
  uHatchingVoronoiCellWallPadding: THREE.IUniform<number> // user editable
}

type MaterialOptions = {
  outlinePixelStep?: number
  outlineThreshold?: number
  inlinePixelStep?: number
  inlineThreshold?: number
  shadowPattern?: SHADOW_PATTERN
  hatchingVoronoiBaseCellSize?: number
  hatchingVoronoiCellWallPadding?: number
}

type MangaMaterialParams = {
  uniformData: MangaUniformData
  maxLightSources: number
  options: MaterialOptions
}

class MangaMaterial extends THREE.ShaderMaterial {
  readonly uniforms: MangaUniform
  readonly vertexShader: string
  readonly fragmentShader: string

  constructor(params: MangaMaterialParams) {
    super()
    this.type = 'MangaMaterial'
    this.fragmentShader = mangaFragment
    this.vertexShader = mangaVertex
    this.glslVersion = THREE.GLSL3
    this.uniforms = createUniform(params.uniformData, params.options)
    this.defines = { MAX_LIGHT_SOURCES: params.maxLightSources }
  }

  get outlinePixelStep() {
    return this.uniforms.uOutlinePixelStep.value
  }

  get outlineThreshold() {
    return this.uniforms.uOutlineThreshold.value
  }

  get inlinePixelStep() {
    return this.uniforms.uInlinePixelStep.value
  }

  get inlineThreshold() {
    return this.uniforms.uInlineThreshold.value
  }

  get shadowPattern() {
    return this.uniforms.uShadowPattern.value
  }

  get hatchingVoronoiBaseCellSize() {
    return this.uniforms.uHatchingVoronoiBaseCellSize.value
  }

  get hatchingVoronoiCellWallPadding() {
    return this.uniforms.uHatchingVoronoiCellWallPadding.value
  }

  set outlinePixelStep(value: number) {
    this.uniforms.uOutlinePixelStep.value = value
  }

  set outlineThreshold(value: number) {
    this.uniforms.uOutlineThreshold.value = value
  }

  set inlinePixelStep(value: number) {
    this.uniforms.uInlinePixelStep.value = value
  }

  set inlineThreshold(value: number) {
    this.uniforms.uInlineThreshold.value = value
  }

  set shadowPattern(value: number) {
    this.uniforms.uShadowPattern.value = value
  }

  set hatchingVoronoiBaseCellSize(value: number) {
    this.uniforms.uHatchingVoronoiBaseCellSize.value = value
  }

  set hatchingVoronoiCellWallPadding(value: number) {
    this.uniforms.uHatchingVoronoiCellWallPadding.value = value
  }
}

function createUniform(
  data: MangaUniformData,
  options: MaterialOptions
): MangaUniform {
  return {
    uResolution: { value: data.resolution },
    uLightInfos: { value: data.lightInfos },
    uShadowDepthMapPortions: { value: data.shadowDepthMapPortions },
    uShadowDepthMap: { value: data.shadowDepthMap },
    uShadowDepthMapResolution: { value: data.shadowDepthMapResolution },
    uShadowBias: { value: data.shadowBias },
    uNormalMap: { value: data.normalMap },
    uDeptMap: { value: data.deptMap },
    uOutlinePixelStep: { value: options.outlinePixelStep ?? 2 },
    uOutlineThreshold: { value: options.outlineThreshold ?? 0.5 },
    uInlinePixelStep: { value: options.inlinePixelStep ?? 2 },
    uInlineThreshold: { value: options.inlineThreshold ?? 0.5 },
    uHatchingVoronoiBaseCellSize: {
      value: options.hatchingVoronoiBaseCellSize ?? 100,
    },
    uHatchingVoronoiCellWallPadding: {
      value: options.hatchingVoronoiCellWallPadding ?? 10,
    },
    uShadowPattern: { value: options.shadowPattern ?? 0 },
  }
}

export {
  MangaMaterial,
  MangaUniform,
  LightInfoUniform,
  LightTexturePortionUniform,
  MangaUniformData,
  MaterialOptions,
  SHADOW_PATTERN,
}
