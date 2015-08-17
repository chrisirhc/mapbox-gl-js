uniform sampler2D u_image;

varying vec2 v_texCoord;

void main() {
   vec4 colorSum = texture2D(u_image, v_texCoord);
   gl_FragColor = vec4(colorSum.xyz, 1);
}