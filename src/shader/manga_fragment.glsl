precision mediump float;

#include "lib/shadow.glsl"
#include "lib/line.glsl"

uniform vec2 uResolution;

// use for render shadow
uniform sampler2D uShadowDepthMap;
uniform vec2 uShadowDepthMapResolution;
uniform float uShadowBias;
uniform LightInfo[MAX_LIGHT_SOURCES + 1] uLightInfos;
uniform LightTexturePortion[MAX_LIGHT_SOURCES + 1] uShadowDepthMapPortions;

// user for render line
uniform sampler2D uNormalMap;
uniform sampler2D uDeptMap;
uniform float uOutlinePixelStep;
uniform float uOutlineThreshold;
uniform float uInlinePixelStep;
uniform float uInlineThreshold;

// use for render shadow
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

        vec2 portionResolution = uShadowDepthMapPortions[index].resolution;
        vec2 portionOffset = uShadowDepthMapPortions[index].offset;

        float shadowDept = getDeptFromTexel(
            uShadowDepthMap, 
            portionOffset + portionResolution * (shadowDeptMapUV + 1.) / 2.,
            uShadowDepthMapResolution
        );

        if(surfaceDept + uShadowBias <= shadowDept){
            fragColor = vec4(vec3(0), 1);
            return;
        }
    }

    // debug
    // vec4 texel = getTexel(uShadowDepthMap, gl_FragCoord.xy, uResolution);
    // fragColor = texel;

    fragColor = vec4(1);
}