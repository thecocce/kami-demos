#ifdef GL_ES
precision mediump float;
#endif

/**
 * This is a horribly unoptimized tech demo of some spotlight effects
 * in a fragment shader. :) 
 *
 * by mattdesl 
 */

uniform float time;
uniform vec2 mouse;

varying vec2 vTexCoord0;
varying vec4 vColor;

#define PI 3.1416

void main(void)
{
	vec2 p = vec2(vTexCoord0.x, 1.0-vTexCoord0.y);
	p.x += 0.58;
	p.y -= 0.61;
	vec2 center = vec2(0.5, 0.5);
	float d = distance(p, center);
		
	//bluish tint from top left
	vec3 color = vec3(1.0-d*0.75) * vec3(0.33, 0.35, 0.5);
	
	//add some green near centre
	color += (1.0-distance(p, vec2(1.0, 0.0))*1.)*0.5 * vec3(0.35, 0.65, 0.45);
	
	vec3 lightColor = vec3(0.3, 0.45, 0.65);
	
	for (int i=0; i<3; i++) {
		//direction of light
		float zr = sin(time*0.15*float(i))*0.5 - PI/3.0;

		vec3 dir = vec3(cos(zr), sin(zr), 0.0);

		dir.x += ((mouse.x*2.0-1.0)+1.0)*float(2-i);
		dir.y += ((mouse.y*2.0-1.0)-1.0)*float(2-i);
		
		p.x -= 0.02;
		
		//normalized spotlight vector
		vec3 SpotDir = normalize(dir);
		
		//
		vec3 attenuation = vec3(0.5, 7.0, 10.0);
		float shadow = 1.0 / (attenuation.x + (attenuation.y*d) + (attenuation.z*d*d));

		vec3 pos = vec3(p, 0.0);
		vec3 delta = normalize(pos - vec3(center, 0.0));
		
		float cosOuterCone = cos(radians(1.0));
		float cosInnerCone = cos(radians(15.0 + float(i*2)));
		float cosDirection = dot(delta, SpotDir);
		
		//light...
		color += smoothstep(cosInnerCone, cosOuterCone, cosDirection) * shadow * lightColor;
	}
	color += sin(time*0.5)*0.05;
	gl_FragColor = vec4(vec3(color), 1.0) * vColor;
}