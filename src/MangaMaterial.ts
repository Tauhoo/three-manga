import * as THREE from 'three'
// import mangaFragment from './shader/manga_fragment.glsl'
// import mangaVertex from './shader/manga_vertex.glsl'
import shader from './shader'

class MangaMaterial extends THREE.ShaderMaterial {
  constructor() {
    super()
    this.type = 'MangaMaterial'
    this.fragmentShader = shader.mangaFragment
    this.vertexShader = shader.mangaVertex
    this.glslVersion = THREE.GLSL3
  }
}

export default MangaMaterial
