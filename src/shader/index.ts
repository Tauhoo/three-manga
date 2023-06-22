import mangaFragment from './manga_fragment.glsl'
import mangaVertex from './manga_vertex.glsl'

class MangaShaderMode {
  static readonly FACE_NORMAL_MODE = 0
  static readonly DEPT_MODE = 1
  static readonly MANGA_MODE = 2
}

export { mangaFragment, mangaVertex, MangaShaderMode }
