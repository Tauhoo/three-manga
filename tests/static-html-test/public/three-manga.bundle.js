import * as THREE from 'three';

var mangaFragment = "precision mediump float;\n\n#define faceNormal(positionVarying) vec3( \\\n    normalize( \\\n        cross( \\\n            normalize(dFdx(positionVarying)), \\\n            normalize(dFdy(positionVarying)) \\\n        ) \\\n    ) * 0.5 + 0.5)\n\nconst int FACE_NORMAL_MODE = 0;\nconst int MANGA_MODE = 1;\n\nuniform int uMode;\n\nin vec3 vPosition;\n\nout vec4 fragColor;\n\nvoid main()\n{  \n    if(uMode == FACE_NORMAL_MODE){\n        fragColor = vec4(faceNormal(vPosition), 1);\n    }else if(uMode == MANGA_MODE){\n        fragColor = vec4(faceNormal(vPosition), 1);\n    }else{\n        fragColor = vec4(1, 1, 0, 1);\n    }\n}";

var mangaVertex = "out vec3 vPosition;\n\nvoid main()\n{\n    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);\n    vPosition = position;\n}";

// shaders
class MangaShaderMode {
}
MangaShaderMode.FACE_NORMAL_MODE = 0;
MangaShaderMode.MANGA_MODE = 1;

class MangaMaterial extends THREE.ShaderMaterial {
    constructor(uniforms) {
        super();
        this.type = 'MangaMaterial';
        this.fragmentShader = mangaFragment;
        this.vertexShader = mangaVertex;
        this.glslVersion = THREE.GLSL3;
        this.uniforms = uniforms;
    }
}

class MangaShaderManager {
    constructor() {
        this.uniform = {
            uMode: { value: MangaShaderMode.MANGA_MODE },
        };
        this.material = new MangaMaterial(this.uniform);
    }
}

export { MangaShaderManager };
