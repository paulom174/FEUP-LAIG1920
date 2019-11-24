#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 size;
uniform float t;

void main() {


	vec4 texcolor = texture2D(uSampler, vTextureCoord);

	float stripes_pos = (vTextureCoord.y * 4.0);
	float speed = 0.05;
	vec3 white = vec3(1.0, 1.0, 1.0);
	float stripe = floor(fract(stripes_pos - t * speed) + 0.1);
	
	texcolor.rgb = mix(texcolor.rgb, white, stripe);

	vec2 origin = vec2(3.5, 0.5);
	vec2 cur_pos = (gl_FragCoord.xy / size) - origin;

	float len = length(cur_pos);
	float inner = 0.5;
	float outter = 0.7;
	float black_factor = 0.65;
	float tex_perc = smoothstep(outter, inner, len);

	texcolor.rgb = mix(texcolor.rgb, texcolor.rgb * tex_perc, black_factor);
	
	gl_FragColor = texcolor;
	
}


