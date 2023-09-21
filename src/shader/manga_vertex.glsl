precision mediump float;

#include "lib/shadow.glsl"

uniform LightInfo[MAX_LIGHT_SOURCES] uLightInfos;

out vec3 vGlobalPosition;
out vec3 vGlobalOriginPosition;
out vec3 vPosition;
out vec4 vShadowPerspectiveGlobalPosition;
out vec4 vShadowPerspectiveGlobalOriginPosition;

void main()
{   
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vec4 originPosition = projectionMatrix * viewMatrix * modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    
    vGlobalPosition = gl_Position.xyz;
    vGlobalOriginPosition = originPosition.xyz;
    vPosition = position;
    vShadowPerspectiveGlobalPosition = getShadowPerspectivePosition(
        uLightInfos[0].cameraP,
        uLightInfos[0].cameraV,
        modelMatrix,
        vec4(position, 1.0)
    );

    vShadowPerspectiveGlobalOriginPosition = getShadowPerspectivePosition(
        uLightInfos[0].cameraP,
        uLightInfos[0].cameraV,
        modelMatrix,
        vec4(0.0, 0.0, 0.0, 1.0)
    );
}