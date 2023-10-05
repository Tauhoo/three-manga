import * as THREE from 'three'
import {
  MangaUniformData,
  MangaMaterial,
  LightInfoUniform,
  LightTexturePortionUniform,
  MaterialOptions,
} from './MangaMaterial'
import { MangaDirectionalLight, MangaLight } from './light'
import { DepthMaterial } from './DepthMaterial'
import { NormalMaterial } from './NormalMaterial'
import MangaLightManager from './light/MangaLightManager'

type MangaShaderManagerParams = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.Camera
  lightList: MangaLight[]
  resolution: THREE.Vector2
  shadowDepthTexturepixelsPerUnit?: number
  shadowBias?: number
}

const blackColor = new THREE.Color(0, 0, 0)

const emptyLight = new MangaDirectionalLight(-0.1, 0.1, 0.1, -0.1, 0.1, 0.2)

const depthMaterial = new DepthMaterial()
const normalMaterial = new NormalMaterial()

class MangaShaderManager {
  private uniformData: MangaUniformData
  private faceNormalRenderer: THREE.WebGLRenderTarget
  private deptRenderer: THREE.WebGLRenderTarget
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.Camera
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
      lightList: [...params.lightList, emptyLight], // add empty light to prevent the cast uniform array length is 0. it will always be at least 1
      scene: params.scene,
      renderer: params.renderer,
      shadowDepthTexturepixelsPerUnit: params.shadowDepthTexturepixelsPerUnit,
    })

    this.uniformData = {
      lightInfos: this.mangaLightManager.lightInfoList,
      shadowDepthMapPortions: this.mangaLightManager.lightDepthMapPortionList,
      shadowDepthMap: this.mangaLightManager.depthMapRenderTarget.texture,
      shadowDepthMapResolution: new THREE.Vector2(
        this.mangaLightManager.depthMapRenderTarget.width,
        this.mangaLightManager.depthMapRenderTarget.height
      ),
      normalMap: this.faceNormalRenderer.texture,
      deptMap: this.deptRenderer.texture,
      resolution: params.resolution,
      shadowBias: params.shadowBias || 0.001,
    }
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

    // render face normal map
    this.renderer.setRenderTarget(this.faceNormalRenderer)
    this.scene.overrideMaterial = normalMaterial
    this.renderer.render(this.scene, this.camera)

    // render dept map
    this.renderer.setRenderTarget(this.deptRenderer)
    this.scene.overrideMaterial = depthMaterial
    this.renderer.render(this.scene, this.camera)

    // render light dept map
    this.mangaLightManager.update()

    this.renderer.setRenderTarget(currentRenderTarget)
    this.renderer.setClearColor(currentClearColor)
    this.renderer.setClearAlpha(currentClearAlpha)
    this.scene.background = currentBackgroundColor
    this.scene.overrideMaterial = existOverrideMaterial
  }

  getMangaMaterial(options?: MaterialOptions) {
    return new MangaMaterial({
      uniformData: this.uniformData,
      maxLightSources: this.mangaLightManager.maxLightSource - 1, // prevent shader to process empty light which is at the end of array
      options: options ?? {},
    })
  }
}

export default MangaShaderManager
