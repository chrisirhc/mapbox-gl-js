attribute vec2 a_pos;
attribute vec2 a_texCoord;

uniform mat4 u_matrix;

varying vec2 v_texCoord;

void main() {
   gl_Position = u_matrix * vec4(a_pos, 0, 1);
   v_texCoord = a_texCoord;
}