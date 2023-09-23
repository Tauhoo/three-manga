precision mediump float;

#include "lib/texture.glsl"

in vec3 vGlobalPosition;
in vec3 vGlobalOriginPosition;

out vec4 fragColor;

void main()
{  
    fragColor = getDeptRGBA((vGlobalOriginPosition.z - vGlobalPosition.z) * 0.8);
}