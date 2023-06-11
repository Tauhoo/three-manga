import * as THREE from 'three'
import faceNormalFragment from './shader/face_normal_fragment.glsl'
import faceNormalVertex from './shader/face_normal_vertex.glsl'

class FaceNormalMaterial extends THREE.ShaderMaterial {
  constructor() {
    super()
    this.type = 'FaceNormalMaterial'
    this.fragmentShader = faceNormalFragment
    this.vertexShader = faceNormalVertex
  }
}

export default FaceNormalMaterial
