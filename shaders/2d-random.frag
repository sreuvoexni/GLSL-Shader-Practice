#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

float randomtime(float num){
    return fract(sin(num)*43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 mpos = u_mouse / u_resolution.xy;
    
    st.x *= 80.0; // scaling
    st.y *= 60.0;
    st.x -= u_time*randomtime(floor(st.y))*20.; // speed
    
    vec2 ipos = floor(st)/10.0; 
    
    // Mouse X acts as the threshold for the step function - left of screen -> more white, moving to right -> more cells
    vec3 color = vec3(step(mpos.x, random(ipos)));
    
    gl_FragColor = vec4(color,1.0);
}
