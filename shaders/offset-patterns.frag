#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 brickTile(vec2 st, float zoom){
  st *= zoom;
  float xoffset = clamp(mod(u_time,2.),1.,2.); // horizontal movement vertical movement alternating
  float yoffset = clamp(mod(u_time,2.),0.,1.);
  
  st.x -= step(1., mod(st.y,2.)) * xoffset; // even numbered lines moving to the right
  st.x += (1.-step(1., mod(st.y,2.))) * xoffset; // odd numbered lines moving to the left
  st.y -= step(1., mod(st.x, 2.))* yoffset;
  st.y += (1.-step(1., mod(st.x, 2.)))* yoffset;
  return fract(st);
}


void main(void){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(0.0);
  
  st = brickTile(st,5.0);
  color = vec3(st,0.0);
  
  gl_FragColor = vec4(color,1.0);
}
