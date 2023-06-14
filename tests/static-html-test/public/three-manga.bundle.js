import * as THREE from 'three';

var mangaFragment = "precision mediump float;in vec3 vPosition;out vec4 fragColor;void main(){vec3 diffX=normalize(dFdx(vPosition));vec3 diffY=normalize(dFdy(vPosition));fragColor=vec4(normalize(cross(diffX,diffY))*0.5+0.5,1.0);}";

var mangaVertex = "out vec3 vPosition;void main(){gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.0);vPosition=position;}";

class MangaMaterial extends THREE.ShaderMaterial {
    constructor() {
        super();
        this.type = 'MangaMaterial';
        this.fragmentShader = mangaFragment;
        this.vertexShader = mangaVertex;
        this.glslVersion = THREE.GLSL3;
    }
}

export { MangaMaterial };
