precision mediump float;

#include "lib/face_normal.glsl"
#include "lib/manga_mode.glsl"

uniform int uMode;

in vec3 vPosition;

out vec4 fragColor;

void main()
{  
    if(uMode == FACE_NORMAL_MODE){
        fragColor = vec4(faceNormal(vPosition), 1);
    }else if(uMode == MANGA_MODE){
        fragColor = vec4(faceNormal(vPosition), 1);
    }else{
        fragColor = vec4(0, 0, 0, 1);
    }
}