import { MangaUniform, MangaMaterial, MangaShaderMode } from './MangaMaterial'

class MangaShaderManager {
  readonly material: MangaMaterial
  private uniform: MangaUniform
  constructor() {
    this.uniform = {
      uMode: { value: MangaShaderMode.MANGA_MODE },
    }
    this.material = new MangaMaterial(this.uniform)
  }
}

export default MangaShaderManager
