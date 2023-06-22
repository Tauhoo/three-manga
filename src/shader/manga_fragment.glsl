precision mediump float;

#include "lib/face_normal.glsl"
#include "lib/manga_mode.glsl"
#include "lib/line.glsl"

struct LightInfo { 
    mat4 cameraP;
    mat4 cameraV;
    vec3 position;
    sampler2D deptMap;
};

uniform int uMode;
uniform LightInfo[MAX_LIGHT_SOURCES + 1] uLightInfos;
uniform sampler2D uNormalMap;
uniform sampler2D uDeptMap;
uniform vec2 uResolution;
uniform float uOutlinePixelStep;
uniform float uInlinePixelStep;

in vec3 vPosition;
in vec3 vGlobalPosition;

out vec4 fragColor;

void main()
{  
    if(uMode == FACE_NORMAL_MODE){
        fragColor = vec4(getFaceNormal(vGlobalPosition) * 0.5 + 0.5, 1);
        return;
    }

    if(uMode == DEPT_MODE){
        fragColor = getDeptRGBA(vGlobalPosition.z);
        return;
    }
    
    if(uMode == MANGA_MODE){
        // float outlinePixelScale = getOutlinePixelScale(uDeptMap, gl_FragCoord.xy, uResolution, uOutlinePixelStep);
        // float inlinePixelScale = getInlinePixelScale(uNormalMap, gl_FragCoord.xy, uResolution, uInlinePixelStep);
        // float mergePixelScale = max(outlinePixelScale, inlinePixelScale);
        // fragColor = vec4(vec3(mergePixelScale), 1);
        float dept = getDeptFromTexel(uDeptMap, gl_FragCoord.xy, uResolution);
        // fragColor = vec4(normalize(gl_FragCoord.xyz), 1);
        fragColor = vec4(vec3(dept), 1);
        return;
    }

    fragColor = vec4(0, 0, 0, 1);
}