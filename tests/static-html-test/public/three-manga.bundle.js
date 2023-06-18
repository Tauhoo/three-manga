import * as THREE from 'three';

var mangaFragment = "precision mediump float;\n\n#define faceNormal(positionVarying) vec3( \\\n    normalize( \\\n        cross( \\\n            normalize(dFdx(positionVarying)), \\\n            normalize(dFdy(positionVarying)) \\\n        ) \\\n    ) * 0.5 + 0.5)\n\nconst int FACE_NORMAL_MODE = 0;\nconst int MANGA_MODE = 1;\n\nstruct LightInfo { \n    mat4 cameraP;\n    mat4 cameraV;\n    vec3 position;\n    sampler2D deptMap;\n};\n\nuniform int uMode;\nuniform LightInfo[MAX_LIGHT_SOURCES + 1] uLightInfos;\nuniform sampler2D uNormalMap;\nuniform vec2 uResolution;\n\nin vec3 vPosition;\n\nout vec4 fragColor;\n\nvoid main()\n{  \n    if(uMode == FACE_NORMAL_MODE){\n        fragColor = vec4(faceNormal(vPosition), 1);\n    }else if(uMode == MANGA_MODE){\n        fragColor = vec4(faceNormal(vPosition), 1);\n    }else{\n        fragColor = vec4(0, 0, 0, 1);\n    }\n}";

var mangaVertex = "out vec3 vPosition;\n\nvoid main()\n{\n    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);\n    vPosition = position;\n}";

// shaders
class MangaShaderMode {
}
MangaShaderMode.FACE_NORMAL_MODE = 0;
MangaShaderMode.MANGA_MODE = 1;

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
            let currentRenderTarget = this.renderer.getRenderTarget();
            this.renderer.setRenderTarget(this.faceNormalRenderer);
            this.renderer.render(this.scene, this.camera);
            this.renderer.setRenderTarget(currentRenderTarget);
        };
        this.renderer = params.renderer;
        this.faceNormalRenderer = new THREE.WebGLRenderTarget(params.resolution.x, params.resolution.y);
        this.uniform = {
            uMode: { value: MangaShaderMode.MANGA_MODE },
            uLightInfos: { value: params.lightInfoList },
            uNormalMap: { value: this.faceNormalRenderer.texture },
            uResolution: { value: params.resolution },
        };
        this.material = new MangaMaterial({
            uniforms: this.uniform,
            maxLightSources: params.lightInfoList.length,
        });
    }
}

export { MangaShaderManager };
