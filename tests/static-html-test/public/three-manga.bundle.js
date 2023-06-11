import * as THREE from 'three';

class MangaMaterial extends THREE.ShaderMaterial {
    constructor() {
        super();
        this.type = 'MangaMaterial';
        this.glslVersion = THREE.GLSL3;
    }
}

var faceNormalFragment = "precision mediump float;in vec3 vPosition;out vec4 fragColor;void main(){vec3 diffX=normalize(dFdx(vPosition));vec3 diffY=normalize(dFdy(vPosition));fragColor=vec4(normalize(cross(diffX,diffY))*0.5+0.5,1.0);}";

var faceNormalVertex = "out vec3 vPosition;void main(){gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.0);vPosition=position;}";

class FaceNormalMaterial extends THREE.ShaderMaterial {
    constructor() {
        super();
        this.type = 'FaceNormalMaterial';
        this.fragmentShader = faceNormalFragment;
        this.vertexShader = faceNormalVertex;
        this.glslVersion = THREE.GLSL3;
    }
}

export { FaceNormalMaterial, MangaMaterial };
