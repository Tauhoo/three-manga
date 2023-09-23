precision mediump float;

#include "lib/shadow.glsl"
#include "lib/line.glsl"

uniform LightInfo[MAX_LIGHT_SOURCES + 1] uLightInfos;
uniform sampler2D uNormalMap;
uniform sampler2D uDeptMap;
uniform vec2 uResolution;
uniform float uOutlinePixelStep;
uniform float uOutlineThreshold;
uniform float uInlinePixelStep;
uniform float uInlineThreshold;
uniform float uShadowBias;

in vec4[MAX_LIGHT_SOURCES + 1] vShadowPerspectiveGlobalPosition;
in vec4[MAX_LIGHT_SOURCES + 1] vShadowPerspectiveGlobalOriginPosition;

out vec4 fragColor;

void main()
{ 
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
    for(int index = 0; index < MAX_LIGHT_SOURCES; index++){
        float surfaceDept = (vShadowPerspectiveGlobalOriginPosition[index].z - vShadowPerspectiveGlobalPosition[index].z) * 0.8 * 0.5 + 0.5;
        vec2 shadowDeptMapUV = vShadowPerspectiveGlobalPosition[index].xy / vShadowPerspectiveGlobalPosition[index].w;
        float shadowDept = getDeptFromTexel(uLightInfos[0].deptMap, (shadowDeptMapUV + 1.) / 2., vec2(1.)); // TODO: access light info with index
        if(surfaceDept + uShadowBias <= shadowDept){
            fragColor = vec4(vec3(0), 1);
            return;
        }
    }

    fragColor = vec4(1);
}