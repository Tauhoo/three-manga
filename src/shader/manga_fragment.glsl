#include "lib/face_normal.glsl"

precision mediump float;

in vec3 vPosition;
out vec4 fragColor;

void main()
{  
    // vec3 diffX = normalize(dFdx(vPosition));
    // vec3 diffY = normalize(dFdy(vPosition));

    // fragColor = vec4(normalize(cross(diffX, diffY)) * 0.5 + 0.5,1.0);

    fragColor = getFaceNormal(vPosition);
}