import * as THREE from 'three'
class MangaMaterial extends THREE.ShaderMaterial {
  constructor() {
    super()
    this.type = 'MangaMaterial'
    this.glslVersion = THREE.GLSL3
  }
}

export default MangaMaterial
