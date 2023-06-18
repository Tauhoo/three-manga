import * as THREE from 'three'
// shaders
import mangaFragment from './manga_fragment.glsl'
import mangaVertex from './manga_vertex.glsl'

class MangaShaderMode {
  static readonly FACE_NORMAL_MODE = 0
  static readonly MANGA_MODE = 1
}

export { mangaFragment, mangaVertex, MangaShaderMode }
