struct LightInfo { 
    mat4 cameraP;
    mat4 cameraV;
    vec3 position;
    sampler2D deptMap;
};

struct LightTexturePortion {
    vec2 resolution;
    vec2 offset;
};

vec4 getShadowPerspectivePosition(
    mat4 cameraP,
    mat4 cameraV,
    mat4 modelMatrix,
    vec4 originPosition  
) {
    return cameraP * cameraV * modelMatrix * originPosition;
}

