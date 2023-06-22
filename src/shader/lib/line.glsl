#include "texture.glsl"

float getOutlinePixelScale(sampler2D deptMap, vec2 position, vec2 resolution, float pixelStep){

    // vertical detection
    float result = 0.0;
    for(float index = 0.0; index < 3.0; index++){
        float offset = index - 1.0;
        float from = getDeptFromTexel(deptMap, vec2(position.x + pixelStep, position.y + offset * pixelStep), resolution);
        float to = getDeptFromTexel(deptMap, vec2(position.x - pixelStep, position.y + offset * pixelStep), resolution);
        result += abs(from - to);
    }

    // horizontal detection
    for(float index = 0.0; index < 3.0; index++){
        float offset = index - 1.0;
        float from = getDeptFromTexel(deptMap, vec2(position.x + offset * pixelStep, position.y + pixelStep), resolution);
        float to = getDeptFromTexel(deptMap, vec2(position.x - offset * pixelStep, position.y + pixelStep), resolution);
        result += abs(from - to);
    }

    return result / 6.0;
}

float getInlinePixelScale(sampler2D normalMap, vec2 position, vec2 resolution, float pixelStep){

    // vertical detection
    float result = 0.0;
    for(float index = 0.0; index < 3.0; index++){
        float offset = index - 1.0;
        vec3 from = getNormalFromTexel(normalMap, vec2(position.x + pixelStep, position.y + offset * pixelStep), resolution);
        vec3 to = getNormalFromTexel(normalMap, vec2(position.x - pixelStep, position.y + offset * pixelStep), resolution);
        result += dot(from, to);
    }

    // horizontal detection
    for(float index = 0.0; index < 3.0; index++){
        float offset = index - 1.0;
        vec3 from = getNormalFromTexel(normalMap, vec2(position.x + offset * pixelStep, position.y + pixelStep), resolution);
        vec3 to = getNormalFromTexel(normalMap, vec2(position.x - offset * pixelStep, position.y + pixelStep), resolution);
        result += dot(from, to);
    }

    return result / 6.0;
}