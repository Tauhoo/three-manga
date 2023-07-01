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
uniform float uOutlineThreshold;
uniform float uInlinePixelStep;
uniform float uInlineThreshold;

in vec3 vGlobalPosition;
in vec3 vGlobalOriginPosition;
in vec3 vPosition;

out vec4 fragColor;

void main()
{  
    if(uMode == FACE_NORMAL_MODE){
        fragColor = vec4(getFaceNormal(vGlobalPosition) * 0.5 + 0.5, 1);
        return;
    }

    if(uMode == DEPT_MODE){
        fragColor = getDeptRGBA((vGlobalOriginPosition.z - vGlobalPosition.z) * 0.8);
        return;
    }
    
    if(uMode == MANGA_MODE){
        float outlinePixelScale = getOutlinePixelScale(uDeptMap, gl_FragCoord.xy, uResolution, uOutlinePixelStep);
        bool isHigherOutline = isHigherOutlinePixel(uDeptMap, gl_FragCoord.xy, uResolution, uOutlinePixelStep);
        if(abs(outlinePixelScale) >  uOutlineThreshold && isHigherOutline){
            fragColor = vec4(vec3(0), 1);
            return;
        }

        float inlinePixelScale = getInlinePixelScale(uNormalMap, gl_FragCoord.xy, uResolution, uInlinePixelStep);
        // if(abs(inlinePixelScale) > uInlineThreshold){
        //     fragColor = vec4(0, 1, 0, 1);
        //     return;
        // }

        
        float dept = getDeptFromTexel(uDeptMap, gl_FragCoord.xy, uResolution);
        fragColor = vec4(vec3(dept), 1);
        // fragColor = vec4(vec3(vDistanceFromCamera), 1);
        // fragColor = vec4(vec3(1), 1);
        return;
    }

    fragColor = vec4(0, 0, 0, 1);
}