#version 300 es
precision mediump float;
uniform vec2 u_resolution;
in vec3 position;  // Declare position as input attribute
out vec2 fragCoord;

void main() {
  float x = position.x;
  float y = position.y;
  gl_Position = vec4(x, y, 0.0, 1.0);
  fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
  fragCoord.y = u_resolution.y - fragCoord.y;
}
