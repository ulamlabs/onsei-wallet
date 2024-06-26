import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";

export default function SplashAnimation() {
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
  
  // Gradient colours
const vec3 COL1 = vec3(1.0, 0.867, 0.792); // #FFDDCA
const vec3 COL3 = vec3(1.0, 0.153, 0.153); // #FF2727
const vec3 COL2 = vec3(1.0, 0.686, 0.686); // #FFAFAF
const vec3 COL4 = vec3(0.878, 0.027, 0.4); // #E00766

// Edge smoothing
const float SMOOTHING = 128.0;

// Rotation and size parameters
const float PHASE1_DURATION = 1.0; // Duration for phase 1
const float PHASE2_DURATION = 1.0; // Duration for phase 2
const float PHASE3_DURATION = 1.0; // Duration for phase 3

const float TOTAL_DURATION = PHASE1_DURATION + PHASE2_DURATION + PHASE3_DURATION;

// Rotation angles
const float ROTATION_PHASE1 = radians(70.0); // 70 degrees
const float ROTATION_PHASE2 = radians(-50.0); // -50 degrees

// Wave parameters
const float WAVE_FREQUENCY = 10.0; // Controls the frequency of the waves
const float WAVE_AMPLITUDE = 0.05; // Controls the amplitude of the waves

// Ease-in-out cubic function
float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : (t - 1.0) * (2.0 * t - 2.0) * (2.0 * t - 2.0) + 1.0;
}

float Circle(vec2 pos, float radius)
{
    return length(pos) - radius;
}

vec3 getGradientColor(float t) {
    // Determine the color based on the distance t
    if (t < 0.1) {
        return mix(COL1, COL2, smoothstep(0.0, 0.1, t));
    } else if (t < 0.5) {
        return mix(COL2, COL3, smoothstep(0.1, 0.5, t));
    } else {
        return mix(COL3, COL4, smoothstep(0.5, 1.0, t));
    }
}

void mainImage(out vec4 fragColour, in vec2 fragCoord)
{
    // Background color
    vec3 backgroundColor = vec3(0.071, 0.071, 0.071); // #121212
    
    // Calculate aspect ratio
    float aspect = 1.0 / min(iResolution.x, iResolution.y);
    
    // Aspect ratio corrected UV coordinates
    vec2 uv = fragCoord * aspect;
    
    // Normalized position from -0.5 to 0.5
    vec2 pos = uv - 0.5 * aspect * iResolution.xy;

    float time = mod(iTime, TOTAL_DURATION);

    float rotationAngle;
    float sizeFactor;

    if (time < PHASE1_DURATION) {
        // Phase 1: Clockwise rotation and getting smaller
        float t = time / PHASE1_DURATION;
        float easedT = easeInOutCubic(t);
        rotationAngle = ROTATION_PHASE1 * easedT;
        sizeFactor = mix(1.0, 0.7, easedT);
    } else if (time < PHASE1_DURATION + PHASE2_DURATION) {
        // Phase 2: Counterclockwise rotation and getting bigger to 150%
        float t = (time - PHASE1_DURATION) / PHASE2_DURATION;
        float easedT = easeInOutCubic(t);
        rotationAngle = ROTATION_PHASE1 + ROTATION_PHASE2 * easedT;
        sizeFactor = mix(0.7, 1.5, easedT);
    } else {
        // Phase 3: Slowly getting bigger to 200% with wave interference
        float t = (time - PHASE1_DURATION - PHASE2_DURATION) / PHASE3_DURATION;
        rotationAngle = ROTATION_PHASE1 + ROTATION_PHASE2;
        sizeFactor = mix(1.5, 2.0, t);
    }

    // Apply rotation
    float cosT = cos(rotationAngle);
    float sinT = sin(rotationAngle);
    mat2 rotationMatrix = mat2(cosT, -sinT, sinT, cosT);
    pos = rotationMatrix * pos;

    float radius = 0.35 * sizeFactor;

    // Position for the first circle (top right)
    vec2 pos1 = pos - vec2(0.25 * iResolution.x, -0.25 * iResolution.y) * aspect;
    float c1 = Circle(pos1, radius);
    float s1 = SMOOTHING * aspect;
    float smoothedC1 = smoothstep(s1, -s1, c1);
    float dist1 = length(pos1) / radius;
    vec3 color1 = getGradientColor(dist1);

    // Position for the second circle (bottom left)
    vec2 pos2 = pos - vec2(-0.25 * iResolution.x, 0.25 * iResolution.y) * aspect;
    float c2 = Circle(pos2, radius);
    float s2 = SMOOTHING * aspect;
    float smoothedC2 = smoothstep(s2, -s2, c2);
    float dist2 = length(pos2) / radius;
    vec3 color2 = getGradientColor(dist2);
    
    // Combine both circles' colors and alpha values
    vec3 combinedColor = color1 * smoothedC1 + color2 * smoothedC2;
    float combinedAlpha = max(smoothedC1, smoothedC2);

    // Mix the combined color with the background color
    vec3 finalColor = mix(backgroundColor, combinedColor, combinedAlpha);

    // Add delicate wave interference pattern at the edges in Phase 3
    if (time > PHASE1_DURATION + PHASE2_DURATION) {
        float t = (time - PHASE1_DURATION - PHASE2_DURATION) / PHASE3_DURATION;
        float waveInterference = sin((pos.x + pos.y) * WAVE_FREQUENCY * 3.14159 + iTime * 2.0) * WAVE_AMPLITUDE;
        float edgeBlend = smoothstep(0.35 * sizeFactor, 0.35 * sizeFactor + WAVE_AMPLITUDE, abs(c1)) *
                          smoothstep(0.35 * sizeFactor, 0.35 * sizeFactor + WAVE_AMPLITUDE, abs(c2));
        finalColor = mix(finalColor, vec3(0.0), waveInterference * edgeBlend);
    }

    // Set the fragment color
    fragColour.rgb = finalColor;
    fragColour.a = 1.0; // Full opacity
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
