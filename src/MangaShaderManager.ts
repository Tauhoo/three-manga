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
}

class MangaShaderManager {
  readonly material: MangaMaterial
  private uniform: MangaUniform
  private faceNormalRenderer: THREE.WebGLRenderTarget
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.Camera

  constructor(params: MangaShaderManagerParams) {
    this.renderer = params.renderer

    this.faceNormalRenderer = new THREE.WebGLRenderTarget(
      params.resolution.x,
      params.resolution.y
    )

    this.uniform = {
      uMode: { value: MangaShaderMode.MANGA_MODE },
      uLightInfos: { value: params.lightInfoList },
      uNormalMap: { value: this.faceNormalRenderer.texture },
      uResolution: { value: params.resolution },
    }

    this.material = new MangaMaterial({
      uniforms: this.uniform,
      maxLightSources: params.lightInfoList.length,
    })
  }

  update = () => {
    let currentRenderTarget = this.renderer.getRenderTarget()
    this.renderer.setRenderTarget(this.faceNormalRenderer)
    this.renderer.render(this.scene, this.camera)
    this.renderer.setRenderTarget(currentRenderTarget)
  }
}

export default MangaShaderManager
