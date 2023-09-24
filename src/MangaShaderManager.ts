import * as THREE from 'three'
import {
  MangaUniform,
  MangaMaterial,
  LightInfoUniform,
  LightTexturePortionUniform,
} from './MangaMaterial'
import { MangaLight } from './light'
import { DepthMaterial } from './DepthMaterial'
import { NormalMaterial } from './NormalMaterial'
import MangaLightManager from './light/MangaLightManager'

type MangaShaderManagerParams = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.Camera
  lightList: MangaLight[]
  resolution: THREE.Vector2
  outlinePixelStep?: number
  outlineThreshold?: number
  intlinePixelStep?: number
  inlineThreshold?: number
  shadowDepthTexturepixelsPerUnit?: number
  shadowBias?: number
}

type LightInfo = {
  light: MangaLight
  deptRenderTarget: THREE.WebGLRenderTarget
}

const blackColor = new THREE.Color(0, 0, 0)
const emptyLightInfoUniform: LightInfoUniform = {
  cameraP: new THREE.Matrix4(),
  cameraV: new THREE.Matrix4(),
  position: new THREE.Vector3(),
}

const emptyLightTexturePortionUniform: LightTexturePortionUniform = {
  resolution: new THREE.Vector2(),
  offset: new THREE.Vector2(),
}
const depthMaterial = new DepthMaterial()
const normalMaterial = new NormalMaterial()

class MangaShaderManager {
  readonly material: MangaMaterial
  private uniform: MangaUniform
  private faceNormalRenderer: THREE.WebGLRenderTarget
  private deptRenderer: THREE.WebGLRenderTarget
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.Camera
  private lightInfoList: LightInfo[]
  private mangaLightManager: MangaLightManager

  constructor(params: MangaShaderManagerParams) {
    this.renderer = params.renderer
    this.scene = params.scene
    this.camera = params.camera

    this.faceNormalRenderer = new THREE.WebGLRenderTarget(
      params.resolution.x,
      params.resolution.y,
      { format: THREE.RGBAFormat }
    )

    this.deptRenderer = new THREE.WebGLRenderTarget(
      params.resolution.x,
      params.resolution.y,
      { format: THREE.RGBAFormat }
    )

    this.mangaLightManager = new MangaLightManager({
      lightList: params.lightList,
      scene: params.scene,
      renderer: params.renderer,
      shadowDepthTexturepixelsPerUnit: params.shadowDepthTexturepixelsPerUnit,
    })

    this.uniform = {
      uLightInfos: {
        value: [...this.mangaLightManager.lightInfoList, emptyLightInfoUniform],
      },
      uShadowDepthMapPortions: {
        value: [
          ...this.mangaLightManager.lightDepthMapPortionList,
          emptyLightTexturePortionUniform,
        ],
      },
      uShadowDepthMap: {
        value: this.mangaLightManager.depthMapRenderTarget.texture,
      },
      uShadowDepthMapResolution: {
        value: new THREE.Vector2(
          this.mangaLightManager.depthMapRenderTarget.width,
          this.mangaLightManager.depthMapRenderTarget.height
        ),
      },
      uNormalMap: { value: null },
      uDeptMap: { value: null },
      uResolution: { value: params.resolution },
      uOutlinePixelStep: { value: params.outlinePixelStep || 2 },
      uOutlineThreshold: { value: params.outlineThreshold || 0.5 },
      uInlinePixelStep: { value: params.intlinePixelStep || 2 },
      uInlineThreshold: { value: params.inlineThreshold || 0.5 },
      uShadowBias: { value: params.shadowBias || 0.001 },
    }

    this.material = new MangaMaterial({
      uniforms: this.uniform,
      maxLightSources: params.lightList.length,
    })
  }

  update = () => {
    // clear data
    let currentRenderTarget = this.renderer.getRenderTarget()
    let currentClearColor = this.renderer.getClearColor(new THREE.Color())
    let currentClearAlpha = this.renderer.getClearAlpha()
    let currentBackgroundColor = this.scene.background
    const existOverrideMaterial = this.scene.overrideMaterial

    this.renderer.setClearColor(blackColor, 0)
    this.renderer.setClearAlpha(0)
    this.scene.background = null

    this.uniform.uDeptMap.value = null
    this.uniform.uNormalMap.value = null

    // render face normal map
    this.renderer.setRenderTarget(this.faceNormalRenderer)
    this.scene.overrideMaterial = normalMaterial
    this.renderer.render(this.scene, this.camera)

    // render dept map
    this.renderer.setRenderTarget(this.deptRenderer)
    this.scene.overrideMaterial = depthMaterial
    this.renderer.render(this.scene, this.camera)

    // render light dept map
    // const lightInfoUniforms = this.uniform.uLightInfos.value
    // for (const info of this.lightInfoList) {
    //   this.renderer.setRenderTarget(info.deptRenderTarget)
    //   this.scene.overrideMaterial = depthMaterial
    //   this.renderer.render(this.scene, info.light)
    // }
    // this.uniform.uLightInfos.value = lightInfoUniforms
    this.mangaLightManager.update()

    // restore data
    this.uniform.uDeptMap.value = this.deptRenderer.texture
    this.uniform.uNormalMap.value = this.faceNormalRenderer.texture

    this.renderer.setRenderTarget(currentRenderTarget)
    this.renderer.setClearColor(currentClearColor)
    this.renderer.setClearAlpha(currentClearAlpha)
    this.scene.background = currentBackgroundColor
    this.scene.overrideMaterial = existOverrideMaterial
  }
}

export default MangaShaderManager
