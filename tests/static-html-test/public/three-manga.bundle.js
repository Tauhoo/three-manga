import * as THREE from 'three';

var mangaFragment = "precision mediump float;\n\n#define getFaceNormal(positionVarying) vec3( \\\n    normalize( \\\n        cross( \\\n            normalize(dFdx(positionVarying)), \\\n            normalize(dFdy(positionVarying)) \\\n        ) \\\n    ))\n\nconst int FACE_NORMAL_MODE = 0;\nconst int DEPT_MODE = 1;\nconst int MANGA_MODE = 2;\n#include <packing>\n\nvec4 getTexel(sampler2D inTexture, vec2 position, vec2 resolution){\n    vec2 uv = vec2(position.x / resolution.x, position.y / resolution.y);\n    vec4 texel = texture(inTexture, uv);\n    return texel;\n}\n\nfloat getDeptFromTexel(sampler2D inTexture, vec2 position, vec2 resolution){\n    vec4 texel = getTexel(inTexture, position, resolution);\n    return unpackRGBAToDepth(texel);\n}\n\nvec3 getNormalFromTexel(sampler2D inTexture, vec2 position, vec2 resolution){\n    vec4 texel = getTexel(inTexture, position, resolution);\n    return (texel.xyz - 0.5) * 2.0;\n}\n\n\nvec4 getDeptRGBA(float v){\n    return packDepthToRGBA(v);\n}\n\n\nfloat getOutlinePixelScale(sampler2D deptMap, vec2 position, vec2 resolution, float pixelStep){\n\n    // vertical detection\n    float result = 0.0;\n    for(float index = 0.0; index < 3.0; index++){\n        float offset = index - 1.0;\n        float from = getDeptFromTexel(deptMap, vec2(position.x + pixelStep, position.y + offset * pixelStep), resolution);\n        float to = getDeptFromTexel(deptMap, vec2(position.x - pixelStep, position.y + offset * pixelStep), resolution);\n        result += abs(from - to);\n    }\n\n    // horizontal detection\n    for(float index = 0.0; index < 3.0; index++){\n        float offset = index - 1.0;\n        float from = getDeptFromTexel(deptMap, vec2(position.x + offset * pixelStep, position.y + pixelStep), resolution);\n        float to = getDeptFromTexel(deptMap, vec2(position.x - offset * pixelStep, position.y + pixelStep), resolution);\n        result += abs(from - to);\n    }\n\n    return result / 6.0;\n}\n\nfloat getInlinePixelScale(sampler2D normalMap, vec2 position, vec2 resolution, float pixelStep){\n\n    // vertical detection\n    float result = 0.0;\n    for(float index = 0.0; index < 3.0; index++){\n        float offset = index - 1.0;\n        vec3 from = getNormalFromTexel(normalMap, vec2(position.x + pixelStep, position.y + offset * pixelStep), resolution);\n        vec3 to = getNormalFromTexel(normalMap, vec2(position.x - pixelStep, position.y + offset * pixelStep), resolution);\n        result += dot(from, to);\n    }\n\n    // horizontal detection\n    for(float index = 0.0; index < 3.0; index++){\n        float offset = index - 1.0;\n        vec3 from = getNormalFromTexel(normalMap, vec2(position.x + offset * pixelStep, position.y + pixelStep), resolution);\n        vec3 to = getNormalFromTexel(normalMap, vec2(position.x - offset * pixelStep, position.y + pixelStep), resolution);\n        result += dot(from, to);\n    }\n\n    return result / 6.0;\n}\n\nstruct LightInfo { \n    mat4 cameraP;\n    mat4 cameraV;\n    vec3 position;\n    sampler2D deptMap;\n};\n\nuniform int uMode;\nuniform LightInfo[MAX_LIGHT_SOURCES + 1] uLightInfos;\nuniform sampler2D uNormalMap;\nuniform sampler2D uDeptMap;\nuniform vec2 uResolution;\nuniform float uOutlinePixelStep;\nuniform float uInlinePixelStep;\n\nin vec3 vPosition;\nin vec3 vGlobalPosition;\n\nout vec4 fragColor;\n\nvoid main()\n{  \n    if(uMode == FACE_NORMAL_MODE){\n        fragColor = vec4(getFaceNormal(vGlobalPosition) * 0.5 + 0.5, 1);\n        return;\n    }\n\n    if(uMode == DEPT_MODE){\n        fragColor = getDeptRGBA(vGlobalPosition.z);\n        return;\n    }\n    \n    if(uMode == MANGA_MODE){\n        // float outlinePixelScale = getOutlinePixelScale(uDeptMap, gl_FragCoord.xy, uResolution, uOutlinePixelStep);\n        // float inlinePixelScale = getInlinePixelScale(uNormalMap, gl_FragCoord.xy, uResolution, uInlinePixelStep);\n        // float mergePixelScale = max(outlinePixelScale, inlinePixelScale);\n        // fragColor = vec4(vec3(mergePixelScale), 1);\n        float dept = getDeptFromTexel(uDeptMap, gl_FragCoord.xy, uResolution);\n        // fragColor = vec4(normalize(gl_FragCoord.xyz), 1);\n        fragColor = vec4(vec3(dept), 1);\n        return;\n    }\n\n    fragColor = vec4(0, 0, 0, 1);\n}";

var mangaVertex = "out vec3 vPosition;\nout vec3 vGlobalPosition;\n\nvoid main()\n{\n    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);\n    vPosition = position;\n    vGlobalPosition = gl_Position.xyz;\n}";

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

class MangaShaderManager {
    constructor(params) {
        this.update = () => {
            this.uniform.uDeptMap.value = null;
            this.uniform.uNormalMap.value = null;
            let currentRenderTarget = this.renderer.getRenderTarget();
            this.renderer.setRenderTarget(this.faceNormalRenderer);
            this.uniform.uMode.value = MangaShaderMode.FACE_NORMAL_MODE;
            this.renderer.render(this.scene, this.camera);
            this.uniform.uNormalMap.value = this.faceNormalRenderer.texture;
            this.renderer.setRenderTarget(this.deptRenderer);
            this.uniform.uMode.value = MangaShaderMode.DEPT_MODE;
            this.renderer.render(this.scene, this.camera);
            this.renderer.setRenderTarget(currentRenderTarget);
            this.uniform.uMode.value = MangaShaderMode.MANGA_MODE;
            this.uniform.uDeptMap.value = this.deptRenderer.texture;
            this.uniform.uNormalMap.value = this.faceNormalRenderer.texture;
        };
        this.renderer = params.renderer;
        this.scene = params.scene;
        this.camera = params.camera;
        this.faceNormalRenderer = new THREE.WebGLRenderTarget(params.resolution.x, params.resolution.y);
        this.deptRenderer = new THREE.WebGLRenderTarget(params.resolution.x, params.resolution.y);
        this.uniform = {
            uMode: { value: MangaShaderMode.MANGA_MODE },
            uLightInfos: { value: params.lightInfoList },
            uNormalMap: { value: null },
            uDeptMap: { value: null },
            uResolution: { value: params.resolution },
            uOutlinePixelStep: { value: params.outlinePixelStep || 2 },
            uInlinePixelStep: { value: params.intlinePixelStep || 2 },
        };
        this.material = new MangaMaterial({
            uniforms: this.uniform,
            maxLightSources: params.lightInfoList.length,
        });
    }
}

export { MangaShaderManager };
