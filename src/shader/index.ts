import mangaFragment from './manga_fragment.glsl'
import mangaVertex from './manga_vertex.glsl'

import depthFragment from './depth_fragment.glsl'
import depthVertex from './depth_vertex.glsl'

import normalFragment from './normal_fragment.glsl'
import normalVertex from './normal_vertex.glsl'

enum SHADOW_PATTERN {
  BASIC = 0,
  HATCHING,
}

export {
  mangaFragment,
  mangaVertex,
  depthFragment,
  depthVertex,
  normalFragment,
  normalVertex,
  SHADOW_PATTERN,
}
