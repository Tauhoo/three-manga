precision mediump float;

out vec3 vGlobalPosition;

void main()
{   
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vGlobalPosition = gl_Position.xyz;
}