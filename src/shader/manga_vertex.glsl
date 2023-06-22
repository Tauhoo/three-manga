out vec3 vPosition;
out vec3 vGlobalPosition;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vPosition = position;
    vGlobalPosition = gl_Position.xyz;
}