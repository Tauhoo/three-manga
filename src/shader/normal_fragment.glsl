precision mediump float;

#include "lib/face_normal.glsl"

in vec3 vGlobalPosition;

out vec4 fragColor;

void main()
{  
    fragColor = vec4(getFaceNormal(vGlobalPosition) * 0.5 + 0.5, 1);
}