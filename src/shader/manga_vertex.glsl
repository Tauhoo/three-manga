precision mediump float;

#include "lib/shadow.glsl"

uniform LightInfo[MAX_LIGHT_SOURCES + 1] uLightInfos;

out vec4[MAX_LIGHT_SOURCES + 1] vShadowPerspectiveGlobalPosition;
out vec4[MAX_LIGHT_SOURCES + 1] vShadowPerspectiveGlobalOriginPosition;

void main()
{   
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    for(int index = 0; index < MAX_LIGHT_SOURCES; index++){
        vShadowPerspectiveGlobalPosition[index] = getShadowPerspectivePosition(
            uLightInfos[index].cameraP,
            uLightInfos[index].cameraV,
            modelMatrix,
            vec4(position, 1.0)
        );

        vShadowPerspectiveGlobalOriginPosition[index] = getShadowPerspectivePosition(
            uLightInfos[index].cameraP,
            uLightInfos[index].cameraV,
            modelMatrix,
            vec4(0.0, 0.0, 0.0, 1.0)
        );
    }
}