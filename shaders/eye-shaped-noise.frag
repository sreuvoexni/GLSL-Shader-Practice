// Author:Ann X
// Title: Eye-shaped Noise Exercise
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = fract(sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453123);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453123);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453123);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453123);

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}


void main(void) {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    
    float wobble = fbm(uv * 5.0 + u_time) - 0.5;
    vec2 warpedUV = uv + (wobble * 0.07); 
    vec2 warpedUVslow = uv + (wobble *0.02);
    
    vec2 offset = vec2(0.0, 0.66 + 0.125 * sin(u_time));
    float radius = 0.75;
    
    float topLid = length(warpedUV - offset);
    float bottomLid = length(warpedUV + offset);
    float eyeDist = max(topLid, bottomLid);
    
    float eyesocket = smoothstep(radius, radius - 0.02, eyeDist);
    
    vec2 shake = vec2(sin(u_time * 60.0),cos(1.2 * u_time * 60.0)) * 0.0009;
    float iris = 1.0-smoothstep(0.16,0.2,length(warpedUVslow+shake));
    float pupil = 1.0-smoothstep(0.040,0.055,length(warpedUVslow+shake));
    float ring = 1.0-smoothstep(0.2,0.21,length(warpedUVslow+shake));
    
    gl_FragColor = vec4(vec3(eyesocket)-vec3(ring)+vec3(iris,0.0,0.0)-vec3(pupil),1.0);
    //gl_FragColor = vec4(vec3(1.0-eyesocket)+vec3(iris,0.0,0.0)-vec3(pupil,0.0,0.0), 1.0); //(older version) white background, black sclera
    //gl_FragColor = vec4((vec3(eyesocket)-vec3(0.0,iris,iris)-vec3(pupil,0.0,0.0)), 1.0); //(older version) black background, white sclera
}
