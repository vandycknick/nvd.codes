precision mediump float;
in vec2 fragCoord;

uniform float u_time;
uniform float u_opacities[10];
uniform vec3 u_colors[6];
uniform float u_total_size;
uniform float u_dot_size;
uniform vec2 u_resolution;
uniform int u_reverse;

out vec4 fragColor;

float PHI = 1.61803398874989484820459;

float random(vec2 xy) {
  return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  vec2 st = fragCoord.xy;
  st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));
  st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));

  float opacity = step(0.0, st.x);
  opacity *= step(0.0, st.y);

  vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

  float frequency = 5.0;
  float show_offset = random(st2); // Used for initial opacity random pick and color
  float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
  opacity *= u_opacities[int(rand * 10.0)];
  opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
  opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));


  vec3 color = u_colors[int(show_offset * 6.0)];

  // --- Animation Timing Logic ---
  float animation_speed_factor = 0.9; // Extract speed from shader string
  vec2 center_grid = u_resolution / 2.0 / u_total_size;
  float dist_from_center = distance(center_grid, st2);

  // Calculate timing offset for Intro (from center)
  float timing_offset_intro = dist_from_center * 0.05 + (random(st2) * 0.15);

  // Calculate timing offset for Outro (from edges)
  // Max distance from center to a corner of the grid
  float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
  float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);

  float current_timing_offset;
  if (u_reverse == 1) {
    current_timing_offset = timing_offset_outro;
    // Outro logic: opacity starts high, goes to 0 when time passes offset
    opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
    // Clamp for fade-out transition
    opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
  } else {
    current_timing_offset = timing_offset_intro;
    // Intro logic: opacity starts 0, goes to base opacity when time passes offset
    opacity *= step(current_timing_offset, u_time * animation_speed_factor);
    // Clamp for fade-in transition
    opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
  }

  fragColor = vec4(color, opacity);
  fragColor.rgb *= fragColor.a; // Premultiply alpha
}
