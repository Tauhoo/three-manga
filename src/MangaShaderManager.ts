import * as THREE from 'three'
import {
  MangaUniform,
  MangaMaterial,
  MangaShaderMode,
  LightInfo,
} from './MangaMaterial'

type MangaShaderManagerParams = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.Camera
  lightInfoList: LightInfo[]
  resolution: THREE.Vector2
  outlinePixelStep?: number
  outlineThreshold?: number
  intlinePixelStep?: number
  inlineThreshold?: number
}

class MangaShaderManager {
  readonly material: MangaMaterial
  private uniform: MangaUniform
  private faceNormalRenderer: THREE.WebGLRenderTarget
  private deptRenderer: THREE.WebGLRenderTarget
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.Camera

  constructor(params: MangaShaderManagerParams) {
    this.renderer = params.renderer
    this.scene = params.scene
    this.camera = params.camera

    this.faceNormalRenderer = new THREE.WebGLRenderTarget(
      params.resolution.x,
      params.resolution.y
    )

    this.deptRenderer = new THREE.WebGLRenderTarget(
      params.resolution.x,
      params.resolution.y
    )

    this.uniform = {
      uMode: { value: MangaShaderMode.MANGA_MODE },
      uLightInfos: { value: params.lightInfoList },
      uNormalMap: { value: null },
      uDeptMap: { value: null },
      uResolution: { value: params.resolution },
      uOutlinePixelStep: { value: params.outlinePixelStep || 2 },
      uOutlineThreshold: { value: params.outlineThreshold || 0.5 },
      uInlinePixelStep: { value: params.intlinePixelStep || 2 },
      uInlineThreshold: { value: params.inlineThreshold || 0.5 },
    }

    this.material = new MangaMaterial({
      uniforms: this.uniform,
      maxLightSources: params.lightInfoList.length,
    })
  }

  update = () => {
    // clear data
    let currentRenderTarget = this.renderer.getRenderTarget()
    let currentRenderBackground = this.scene.background
    this.uniform.uDeptMap.value = null
    this.uniform.uNormalMap.value = null
    this.scene.background = new THREE.Color(255, 255, 255)

    // render face normal map
    this.renderer.setRenderTarget(this.faceNormalRenderer)
    this.uniform.uMode.value = MangaShaderMode.FACE_NORMAL_MODE
    this.renderer.render(this.scene, this.camera)

    // render dept map
    this.renderer.setRenderTarget(this.deptRenderer)
    this.uniform.uMode.value = MangaShaderMode.DEPT_MODE
    this.renderer.render(this.scene, this.camera)

    // restore data
    this.uniform.uDeptMap.value = this.deptRenderer.texture
    this.uniform.uNormalMap.value = this.faceNormalRenderer.texture
    this.uniform.uMode.value = MangaShaderMode.MANGA_MODE
    this.renderer.setRenderTarget(currentRenderTarget)
    this.scene.background = currentRenderBackground
  }
}

export default MangaShaderManager
