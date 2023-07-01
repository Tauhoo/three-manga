import * as THREE from 'three';

var mangaFragment = "precision mediump float;\n\n#define getFaceNormal(positionVarying) vec3( \\\n    normalize( \\\n        cross( \\\n            normalize(dFdx(positionVarying)), \\\n            normalize(dFdy(positionVarying)) \\\n        ) \\\n    ))\n\nconst int FACE_NORMAL_MODE = 0;\nconst int DEPT_MODE = 1;\nconst int MANGA_MODE = 2;\n#include <packing>\n\nvec4 getTexel(sampler2D inTexture, vec2 position, vec2 resolution){\n    vec2 uv = vec2(position.x / resolution.x, position.y / resolution.y);\n    vec4 texel = texture(inTexture, uv);\n    return texel;\n}\n\nfloat getDeptFromTexel(sampler2D inTexture, vec2 position, vec2 resolution){\n    vec4 texel = getTexel(inTexture, position, resolution);\n    return unpackRGBAToDepth(texel);\n}\n\nvec3 getNormalFromTexel(sampler2D inTexture, vec2 position, vec2 resolution){\n    vec4 texel = getTexel(inTexture, position, resolution);\n    return (texel.xyz - 0.5) * 2.0;\n}\n\n\nvec4 getDeptRGBA(float z){\n    return packDepthToRGBA(z * 0.5 + 0.5);\n}\n\n\nbool isHigherOutlinePixel(sampler2D deptMap, vec2 position, vec2 resolution, float pixelStep){\n    float xPixelSize = 100.0 / resolution.x;\n    float yPixelSize = 100.0 / resolution.y;\n    float scale = 0.;\n    for(float i = 0.; i < 3.; i++){\n        float xOffset = i - 1.;\n        for(float j = 0.; j < 3.; j++){\n            float yOffset = j - 1.;\n            float dept = getDeptFromTexel(deptMap, vec2(position.x + xOffset * pixelStep * xPixelSize, position.y + yOffset * pixelStep * yPixelSize), resolution);\n            if(i == 1. && j == 1.){\n                scale += dept * 8.;\n            }else{\n                scale += dept * -1.;\n            }\n        }\n    }\n\n    return scale > 0.0;\n}\n\nfloat getOutlinePixelScale(sampler2D deptMap, vec2 position, vec2 resolution, float pixelStep){\n    float xPixelSize = 100.0 / resolution.x;\n    float yPixelSize = 100.0 / resolution.y;\n\n    // vertical detection\n    float verticalResult = 0.0;\n    for(float index = 0.0; index < 3.0; index++){\n        float offset = index - 1.0;\n        float contrastScale = 2.0 - abs(offset);\n        float from = getDeptFromTexel(deptMap, vec2(position.x + pixelStep * xPixelSize, position.y + offset * pixelStep * yPixelSize), resolution);\n        float to = getDeptFromTexel(deptMap, vec2(position.x - pixelStep * xPixelSize, position.y + offset * pixelStep * yPixelSize), resolution);\n        verticalResult += (to - from) * contrastScale;\n    }\n    float verticalOutlineScale = abs(verticalResult / 4.0);\n\n    // horizontal detection\n    float horizontalResult = 0.0;\n    for(float index = 0.0; index < 3.0; index++){\n        float offset = index - 1.0;\n        float contrastScale = 2.0 - abs(offset);\n        float from = getDeptFromTexel(deptMap, vec2(position.x + offset * pixelStep * xPixelSize, position.y - pixelStep * yPixelSize), resolution);\n        float to = getDeptFromTexel(deptMap, vec2(position.x + offset * pixelStep * xPixelSize, position.y + pixelStep * yPixelSize), resolution);\n        horizontalResult += (from - to) * contrastScale;\n    }\n    float horizontalOutlineScale = abs(horizontalResult / 4.0);\n\n    return max(verticalOutlineScale, horizontalOutlineScale);\n}\n\nfloat getInlinePixelScale(sampler2D normalMap, vec2 position, vec2 resolution, float pixelStep){\n\n    // vertical detection\n    float result = 0.0;\n    for(float index = 0.0; index < 3.0; index++){\n        float offset = index - 1.0;\n        vec3 from = getNormalFromTexel(normalMap, vec2(position.x + pixelStep, position.y + offset * pixelStep), resolution);\n        vec3 to = getNormalFromTexel(normalMap, vec2(position.x - pixelStep, position.y + offset * pixelStep), resolution);\n        result += dot(from, to);\n    }\n\n    // horizontal detection\n    for(float index = 0.0; index < 3.0; index++){\n        float offset = index - 1.0;\n        vec3 from = getNormalFromTexel(normalMap, vec2(position.x + offset * pixelStep, position.y + pixelStep), resolution);\n        vec3 to = getNormalFromTexel(normalMap, vec2(position.x - offset * pixelStep, position.y + pixelStep), resolution);\n        result += dot(from, to);\n    }\n\n    return result / 6.0;\n}\n\nstruct LightInfo { \n    mat4 cameraP;\n    mat4 cameraV;\n    vec3 position;\n    sampler2D deptMap;\n};\n\nuniform int uMode;\nuniform LightInfo[MAX_LIGHT_SOURCES + 1] uLightInfos;\nuniform sampler2D uNormalMap;\nuniform sampler2D uDeptMap;\nuniform vec2 uResolution;\nuniform float uOutlinePixelStep;\nuniform float uOutlineThreshold;\nuniform float uInlinePixelStep;\nuniform float uInlineThreshold;\n\nin vec3 vGlobalPosition;\nin vec3 vGlobalOriginPosition;\nin vec3 vPosition;\n\nout vec4 fragColor;\n\nvoid main()\n{  \n    if(uMode == FACE_NORMAL_MODE){\n        fragColor = vec4(getFaceNormal(vGlobalPosition) * 0.5 + 0.5, 1);\n        return;\n    }\n\n    if(uMode == DEPT_MODE){\n        fragColor = getDeptRGBA((vGlobalOriginPosition.z - vGlobalPosition.z) * 0.8);\n        return;\n    }\n    \n    if(uMode == MANGA_MODE){\n        float outlinePixelScale = getOutlinePixelScale(uDeptMap, gl_FragCoord.xy, uResolution, uOutlinePixelStep);\n        bool isHigherOutline = isHigherOutlinePixel(uDeptMap, gl_FragCoord.xy, uResolution, uOutlinePixelStep);\n        if(abs(outlinePixelScale) >  uOutlineThreshold && isHigherOutline){\n            fragColor = vec4(vec3(0), 1);\n            return;\n        }\n\n        float inlinePixelScale = getInlinePixelScale(uNormalMap, gl_FragCoord.xy, uResolution, uInlinePixelStep);\n        // if(abs(inlinePixelScale) > uInlineThreshold){\n        //     fragColor = vec4(0, 1, 0, 1);\n        //     return;\n        // }\n\n        \n        float dept = getDeptFromTexel(uDeptMap, gl_FragCoord.xy, uResolution);\n        fragColor = vec4(vec3(dept), 1);\n        // fragColor = vec4(vec3(vDistanceFromCamera), 1);\n        // fragColor = vec4(vec3(1), 1);\n        return;\n    }\n\n    fragColor = vec4(0, 0, 0, 1);\n}";

var mangaVertex = "out vec3 vGlobalPosition;\nout vec3 vGlobalOriginPosition;\nout vec3 vPosition;\n\n\nvoid main()\n{   \n    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);\n    vec4 originPosition = projectionMatrix * viewMatrix * modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);\n    \n    vGlobalPosition = gl_Position.xyz;\n    vGlobalOriginPosition = originPosition.xyz;\n    vPosition = position;\n}";

class MangaShaderMode {
}
MangaShaderMode.FACE_NORMAL_MODE = 0;
MangaShaderMode.DEPT_MODE = 1;
MangaShaderMode.MANGA_MODE = 2;

class MangaMaterial extends THREE.ShaderMaterial {
    constructor(params) {
        super();
        this.type = 'MangaMaterial';
        this.fragmentShader = mangaFragment;
        this.vertexShader = mangaVertex;
        this.glslVersion = THREE.GLSL3;
        this.uniforms = params.uniforms;
        this.defines = { MAX_LIGHT_SOURCES: params.maxLightSources };
    }
}

const blackColor = new THREE.Color(0, 0, 0);
class MangaShaderManager {
    constructor(params) {
        this.update = () => {
            // clear data
            let currentRenderTarget = this.renderer.getRenderTarget();
            let currentClearColor = this.renderer.getClearColor(new THREE.Color());
            let currentClearAlpha = this.renderer.getClearAlpha();
            let currentBackgroundColor = this.scene.background;
            this.renderer.setClearColor(blackColor, 0);
            this.renderer.setClearAlpha(0);
            this.scene.background = null;
            this.uniform.uDeptMap.value = null;
            this.uniform.uNormalMap.value = null;
            // render face normal map
            this.renderer.setRenderTarget(this.faceNormalRenderer);
            this.uniform.uMode.value = MangaShaderMode.FACE_NORMAL_MODE;
            this.renderer.render(this.scene, this.camera);
            // render dept map
            this.renderer.setRenderTarget(this.deptRenderer);
            this.uniform.uMode.value = MangaShaderMode.DEPT_MODE;
            this.renderer.render(this.scene, this.camera);
            // restore data
            this.uniform.uDeptMap.value = this.deptRenderer.texture;
            this.uniform.uNormalMap.value = this.faceNormalRenderer.texture;
            this.uniform.uMode.value = MangaShaderMode.MANGA_MODE;
            this.renderer.setRenderTarget(currentRenderTarget);
            this.renderer.setClearColor(currentClearColor);
            this.renderer.setClearAlpha(currentClearAlpha);
            this.scene.background = currentBackgroundColor;
        };
        this.renderer = params.renderer;
        this.scene = params.scene;
        this.camera = params.camera;
        this.faceNormalRenderer = new THREE.WebGLRenderTarget(params.resolution.x, params.resolution.y, { format: THREE.RGBAFormat });
        this.deptRenderer = new THREE.WebGLRenderTarget(params.resolution.x, params.resolution.y, { format: THREE.RGBAFormat });
        this.uniform = {
            uMode: { value: MangaShaderMode.MANGA_MODE },
            uLightInfos: { value: params.lightInfoList },
            uNormalMap: { value: null },
            uDeptMap: { value: null },
            uResolution: { value: params.resolution },
            uOutlinePixelStep: { value: params.outlinePixelStep || 2 },
            uOutlineThreshold: { value: params.outlineThreshold || 0.5 },
            uInlinePixelStep: { value: params.intlinePixelStep || 2 },
            uInlineThreshold: { value: params.inlineThreshold || 0.5 },
        };
        this.material = new MangaMaterial({
            uniforms: this.uniform,
            maxLightSources: params.lightInfoList.length,
        });
    }
}

export { MangaShaderManager };
