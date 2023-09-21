precision mediump float;

#include "lib/shadow.glsl"
#include "lib/face_normal.glsl"
#include "lib/manga_mode.glsl"
#include "lib/line.glsl"

uniform int uMode;
uniform LightInfo[MAX_LIGHT_SOURCES] uLightInfos;
uniform sampler2D uNormalMap;
uniform sampler2D uDeptMap;
uniform vec2 uResolution;
uniform float uOutlinePixelStep;
uniform float uOutlineThreshold;
uniform float uInlinePixelStep;
uniform float uInlineThreshold;
uniform float uShadowBias;

in vec3 vGlobalPosition;
in vec3 vGlobalOriginPosition;
in vec3 vPosition;
in vec4 vShadowPerspectiveGlobalPosition;
in vec4 vShadowPerspectiveGlobalOriginPosition;

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
        // calculate line
        float outlinePixelScale = getOutlinePixelScale(uDeptMap, gl_FragCoord.xy, uResolution, uOutlinePixelStep);
        bool isHigherOutline = isHigherOutlinePixel(uDeptMap, gl_FragCoord.xy, uResolution, uOutlinePixelStep);
        if(abs(outlinePixelScale) >  uOutlineThreshold && isHigherOutline){
            fragColor = vec4(vec3(0), 1);
            return;
        }

        float inlinePixelScale = getInlinePixelScale(uNormalMap, gl_FragCoord.xy, uResolution, uInlinePixelStep);
        if(abs(inlinePixelScale) < uInlineThreshold){
            fragColor = vec4(vec3(0), 1);
            return;
        }

        // calculate shadow
        float surfaceDept = (vShadowPerspectiveGlobalOriginPosition.z - vShadowPerspectiveGlobalPosition.z) * 0.8 * 0.5 + 0.5;
        vec2 shadowDeptMapUV = vShadowPerspectiveGlobalPosition.xy / vShadowPerspectiveGlobalPosition.w;

        float shadowDept = getDeptFromTexel(uLightInfos[0].deptMap, (shadowDeptMapUV + 1.) / 2., vec2(1.));
        if(surfaceDept + uShadowBias <= shadowDept){
            fragColor = vec4(vec3(0), 1);
            return;
        }
        fragColor = vec4(1);
        return;
    }

    fragColor = vec4(0, 0, 0, 1);
}