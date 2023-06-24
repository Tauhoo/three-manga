#include "texture.glsl"

float getOutlinePixelScale(sampler2D deptMap, vec2 position, vec2 resolution, float pixelStep){
    float xPixelSize = 100.0 / resolution.x;
    float yPixelSize = 100.0 / resolution.y;

    // vertical detection
    float verticalResult = 0.0;
    for(float index = 0.0; index < 3.0; index++){
        float offset = index - 1.0;
        float contrastScale = 2.0 - abs(offset);
        float from = getDeptFromTexel(deptMap, vec2(position.x + pixelStep * xPixelSize, position.y + offset * pixelStep * yPixelSize), resolution);
        float to = getDeptFromTexel(deptMap, vec2(position.x - pixelStep * xPixelSize, position.y + offset * pixelStep * yPixelSize), resolution);
        verticalResult += (to - from) * contrastScale;
    }
    float verticalOutlineScale = abs(verticalResult / 4.0);

    // horizontal detection
    float horizontalResult = 0.0;
    for(float index = 0.0; index < 3.0; index++){
        float offset = index - 1.0;
        float contrastScale = 2.0 - abs(offset);
        float from = getDeptFromTexel(deptMap, vec2(position.x + offset * pixelStep * xPixelSize, position.y - pixelStep * yPixelSize), resolution);
        float to = getDeptFromTexel(deptMap, vec2(position.x + offset * pixelStep * xPixelSize, position.y + pixelStep * yPixelSize), resolution);
        horizontalResult += (from - to) * contrastScale;
    }
    float horizontalOutlineScale = abs(horizontalResult / 4.0);

    return max(verticalOutlineScale, horizontalOutlineScale);
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