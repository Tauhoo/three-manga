precision mediump float;

#include "lib/face_normal.glsl"
#include "lib/manga_mode.glsl"

struct LightInfo { 
    mat4 cameraP;
    mat4 cameraV;
    vec3 position;
    sampler2D deptMap;
};

uniform int uMode;
uniform LightInfo[MAX_LIGHT_SOURCES + 1] uLightInfos;
uniform sampler2D uNormalMap;
uniform vec2 uResolution;

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