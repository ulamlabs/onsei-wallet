import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";

export default function DashboardAnimation() {
  return (
    <GLView
      style={{ width: "100%", height: 400 }}
      onContextCreate={(gl: ExpoWebGLRenderingContext) => {
        const renderer: THREE.WebGLRenderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          gl.drawingBufferWidth / gl.drawingBufferHeight,
          0.1,
          1000,
        );
        camera.position.z = 2;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            iTime: { value: 0 },
            iResolution: {
              value: new THREE.Vector2(
                gl.drawingBufferWidth,
                gl.drawingBufferHeight,
              ),
            },
          },
          vertexShader: `
              void main() {
                gl_Position = vec4( position, 1.0 );
              }
            `,
          fragmentShader: `
            uniform float iTime;
  uniform vec2 iResolution;
  
  #define S(a,b,t) smoothstep(a,b,t)
  
  vec3 rgb(float r, float g, float b) {
      return vec3(r / 255.0, g / 255.0, b / 255.0);
  }
  
  vec3 radialGradient(vec2 uv, vec2 center, float radius, vec3 color1, vec3 color2) {
      float dist = length(uv - center) / radius;
      return mix(color1, color2, dist);
  }
  
  float pathShape(vec2 uv, vec2 center, vec2 size, int shapeType) {
      // shapeType: 0, 1, 2 for different shapes
      return smoothstep(0.0, 1.0, 1.0 - length(uv - center) / size.x);
  }
  
  float applyBlur(vec2 uv, vec2 center, float sigma, int samples, vec2 size, int shapeType) {
      float total = 0.0;
      float colorSum = 0.0;
  
      for (int i = -samples; i <= samples; i++) {
          for (int j = -samples; j <= samples; j++) {
              vec2 offset = vec2(float(i), float(j)) * sigma;
              float weight = exp(-(dot(offset, offset)) / (2.0 * sigma * sigma));
              colorSum += pathShape(uv + offset, center, size, shapeType) * weight;
              total += weight;
          }
      }
      return clamp(colorSum / total, 0.0, 1.0);
  }
  
  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 uv = fragCoord.xy / iResolution.xy;
  
      // Animation parameters
      float time = iTime * 0.7; // Slow down the animation
      float offsetY = sin(time) * 0.15; // More pronounced vertical movement
  
      // Parameters for shape 0
      vec2 center0 = vec2(196.535 / 393.0, (377.0 - 2.4643) / 327.0) - vec2(0.0, offsetY * 1.);
      vec2 size0 = vec2(288.536 / 393.0, 288.536 / 377.0);
      float radius0 = 288.536 / 393.0;
      vec3 colorStart0 = rgb(224.0, 7.0, 102.0);
      vec3 colorEnd0 = rgb(224.0, 7.0, 102.0);
      float sigma0 = 95.22 / 393.0;
  
      // Parameters for shape 1
      vec2 center1 = vec2(196.529 / 393.0, (377.0 - 2.46552) / 327.0) - vec2(0.0, offsetY * 1.5);
      vec2 size1 = vec2(153.541 / 393.0, 3.57534 / 377.0);
      float radius1 = 103.541 / 393.0;
      vec3 colorStart1 = rgb(255.0, 175.0, 175.0);
      vec3 colorEnd1 = rgb(255.0, 39.0, 39.0);
      float sigma1 = 47.53 / 393.0;
  
      // Parameters for shape 2
      vec2 center2 = vec2(184.529 / 370.0, (158.0 - 2.46552) / 108.0) - vec2(0.0, offsetY * 2.6);
      vec2 size2 = vec2(103.541 / 370.0, 3.57534 / 158.0);
      float radius2 = 103.541 / 370.0;
      vec3 colorStart2 = rgb(255.0, 221.0, 202.0);
      vec3 colorEnd2 = rgb(255.0, 221.0, 202.0);
      float sigma2 = 60.0 / 370.0;
  
      // Background layer
      vec4 backgroundColor = vec4(rgb(18.0, 18.0, 18.0), 1.0);
  
      // Path 0 with radial gradient and blur
      vec3 color0 = radialGradient(uv, center0, radius0, colorStart0, colorEnd0) * 1.5; // Increase intensity
      float blur0 = applyBlur(uv, center0, sigma0, 5, size0, 0);
  
      // Path 1 with radial gradient and blur
      vec3 color1 = radialGradient(uv, center1, radius1, colorStart1, colorEnd1) * 1.5; // Increase intensity
      float blur1 = applyBlur(uv, center1, sigma1, 5, size1, 1);
  
      // Path 2 with radial gradient and blur
      vec3 color2 = radialGradient(uv, center2, radius2, colorStart2, colorEnd2) * 1.5; // Increase intensity
      float blur2 = applyBlur(uv, center2, sigma2, 5, size2, 2);
  
      // Combine the layers
      vec4 layer0 = vec4(color0, blur0);
      vec4 layer1 = vec4(color1, blur1);
      vec4 layer2 = vec4(color2, blur2);
  
      fragColor = mix(backgroundColor, layer0, layer0.a);
      fragColor = mix(fragColor, layer1, layer1.a);
      fragColor = mix(fragColor, layer2, layer2.a);
  }
  
  void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
  }
  
            `,
          transparent: true,
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        const animate = () => {
          requestAnimationFrame(animate);
          material.uniforms.iTime.value += 0.01;
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };

        animate();
      }}
    />
  );
}
