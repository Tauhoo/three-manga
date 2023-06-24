out vec3 vGlobalPosition;
out vec3 vPosition;
out float vDistanceFromCamera;


void main()
{   
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
    vec4 originPosition = projectionMatrix * viewMatrix * modelMatrix * vec4(vec3(0), 1);
    vDistanceFromCamera = (originPosition.z - gl_Position.z) * 0.8 * 0.5 + 0.5 ;
    vGlobalPosition = gl_Position.xyz;
    vPosition = position;
}