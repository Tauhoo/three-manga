import * as THREE from 'three'

class MangaDirectionalLight extends THREE.OrthographicCamera {
  constructor(
    left?: number,
    right?: number,
    top?: number,
    bottom?: number,
    near?: number,
    far?: number
  ) {
    super(left, right, top, bottom, near, far)
  }
}

export default MangaDirectionalLight
