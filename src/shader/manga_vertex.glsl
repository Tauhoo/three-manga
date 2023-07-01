out vec3 vGlobalPosition;
out vec3 vGlobalOriginPosition;
out vec3 vPosition;


void main()
{   
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vec4 originPosition = projectionMatrix * viewMatrix * modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    
    vGlobalPosition = gl_Position.xyz;
    vGlobalOriginPosition = originPosition.xyz;
    vPosition = position;
}