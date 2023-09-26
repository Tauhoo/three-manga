precision mediump float;

#include "lib/shadow.glsl"
#include "lib/line.glsl"
#include "lib/util.glsl"

const int AVG_SHADOW_SIZE = 5;

uniform vec2 uResolution;

// use for render shadow
uniform sampler2D uShadowDepthMap;
uniform vec2 uShadowDepthMapResolution;
uniform float uShadowBias;
uniform LightInfo[MAX_LIGHT_SOURCES + 1] uLightInfos;
uniform LightTexturePortion[MAX_LIGHT_SOURCES + 1] uShadowDepthMapPortions;
uniform int uShadowPattern;

// use for render hatching shadow pattern
uniform float uHatchingVoronoiBaseCellSize; // user editable
uniform float uHatchingVoronoiCellWallPadding; // user editable

// user for render line
uniform sampler2D uNormalMap;
uniform sampler2D uDeptMap;
uniform float uOutlinePixelStep; // user editable
uniform float uOutlineThreshold; // user editable
uniform float uInlinePixelStep; // user editable
uniform float uInlineThreshold; // user editable

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
    float shadowScale = 0.;
    for(int index = 0; index < MAX_LIGHT_SOURCES; index++){
        float surfaceDept = (vShadowPerspectiveGlobalOriginPosition[index].z - vShadowPerspectiveGlobalPosition[index].z) * 0.8 * 0.5 + 0.5;
        vec2 shadowDeptMapUV = vShadowPerspectiveGlobalPosition[index].xy / vShadowPerspectiveGlobalPosition[index].w;

        vec2 portionResolution = uShadowDepthMapPortions[index].resolution;
        vec2 portionOffset = uShadowDepthMapPortions[index].offset;

        float avgShadowScale = 0.;
        for(int offsetX = -1 * AVG_SHADOW_SIZE / 2; offsetX < AVG_SHADOW_SIZE / 2 + 1; offsetX++){
            for(int offsetY = -1 * AVG_SHADOW_SIZE / 2; offsetY < AVG_SHADOW_SIZE / 2 + 1; offsetY++){
                float shadowDept = getDeptFromTexel(
                    uShadowDepthMap, 
                    portionOffset + portionResolution * (shadowDeptMapUV + 1.) / 2. + vec2(offsetX, offsetY),
                    uShadowDepthMapResolution
                );

                if(surfaceDept + uShadowBias > shadowDept){
                    avgShadowScale += 0.;
                }else{
                    avgShadowScale += 1. / float(AVG_SHADOW_SIZE * AVG_SHADOW_SIZE);
                }
            }
        }
        
        shadowScale += avgShadowScale / float(MAX_LIGHT_SOURCES);
    }

    if(uShadowPattern == BASIC_SHADOW_PATTERN){
        fragColor = vec4(vec3(1. - shadowScale), 1);
    }

    if(uShadowPattern == HATCHING_SHADOW_PATTERN){
        if(layeredHatching(gl_FragCoord.xy * (1. + 2. * gl_FragCoord.z), uHatchingVoronoiBaseCellSize, uHatchingVoronoiCellWallPadding, shadowScale) == 1.){
            fragColor = vec4(vec3(0),1);
            return;
        }
        fragColor = vec4(1);
    }
    

}