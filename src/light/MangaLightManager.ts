import { MangaLight } from '.'
import * as THREE from 'three'
import { DepthMaterial } from '../DepthMaterial'

export type LightInfo = {
  cameraP: THREE.Matrix4
  cameraV: THREE.Matrix4
  position: THREE.Vector3
}

export type LightTexturePortion = {
  resolution: THREE.Vec2
  offset: THREE.Vec2
}

type MangaLightManagerParams = {
  lightList: MangaLight[]
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  shadowDepthTexturepixelsPerUnit?: number
}

const depthMaterial = new DepthMaterial()

class MangaLightManager {
  lightList: MangaLight[]
  lightInfoList: LightInfo[] = []
  lightDepthMapPortionList: LightTexturePortion[] = []
  depthMapRenderTarget: THREE.WebGLRenderTarget
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene

  constructor(params: MangaLightManagerParams) {
    this.lightList = params.lightList
    this.scene = params.scene
    this.renderer = params.renderer

    // set up lightInfoList
    for (const light of params.lightList) {
      this.lightInfoList.push({
        cameraP: light.projectionMatrix,
        cameraV: light.matrixWorldInverse,
        position: light.position,
      })
    }

    // set up lightDepthMapPortionList
    let accWidth = 0
    let maxHeight = 0
    for (const light of params.lightList) {
      const width =
        (light.right - light.left) *
        (params.shadowDepthTexturepixelsPerUnit || 1024)
      const height =
        (light.top - light.bottom) *
        (params.shadowDepthTexturepixelsPerUnit || 1024)
      this.lightDepthMapPortionList.push({
        resolution: new THREE.Vector2(width, height),
        offset: new THREE.Vector2(accWidth, 0),
      })
      accWidth += width
      if (maxHeight < height) maxHeight = height
    }

    // set up depthMap
    this.depthMapRenderTarget = new THREE.WebGLRenderTarget(accWidth, maxHeight)
  }

  update() {
    const existOverideMaterial = this.scene.overrideMaterial
    const existRenderTarget = this.renderer.getRenderTarget()
    const existAutoClear = this.renderer.autoClear
    this.renderer.setRenderTarget(this.depthMapRenderTarget)
    this.renderer.autoClear = false
    this.renderer.clear()

    this.scene.overrideMaterial = depthMaterial
    for (let index = 0; index < this.lightList.length; index++) {
      const light = this.lightList[index]
      const portion = this.lightDepthMapPortionList[index]

      const viewPort = new THREE.Vector4()
      this.renderer.getViewport(viewPort)

      this.renderer.setViewport(
        portion.offset.x,
        portion.offset.y,
        portion.resolution.x,
        portion.resolution.y
      )
      this.renderer.render(this.scene, light)

      this.renderer.setViewport(viewPort)
    }

    this.renderer.setRenderTarget(existRenderTarget)
    this.renderer.autoClear = existAutoClear
    this.scene.overrideMaterial = existOverideMaterial
  }
}

export default MangaLightManager
