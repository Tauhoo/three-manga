#include <packing>

vec4 getTexel(sampler2D inTexture, vec2 position, vec2 resolution){
    vec2 uv = vec2(position.x / resolution.x, position.y / resolution.y);
    vec4 texel = texture(inTexture, uv);
    return texel;
}

float getDeptFromTexel(sampler2D inTexture, vec2 position, vec2 resolution){
    vec4 texel = getTexel(inTexture, position, resolution);
    return unpackRGBAToDepth(texel);
}

vec3 getNormalFromTexel(sampler2D inTexture, vec2 position, vec2 resolution){
    vec4 texel = getTexel(inTexture, position, resolution);
    return (texel.xyz - 0.5) * 2.0;
}


vec4 getDeptRGBA(float z){
    return packDepthToRGBA(z * 0.5 + 0.5);
}
