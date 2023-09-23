precision mediump float;

#include "lib/shadow.glsl"

uniform LightInfo[MAX_LIGHT_SOURCES] uLightInfos;

out vec4 vShadowPerspectiveGlobalPosition;
out vec4 vShadowPerspectiveGlobalOriginPosition;

void main()
{   
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    
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