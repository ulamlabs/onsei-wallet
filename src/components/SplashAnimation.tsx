import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";
import { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function SplashAnimation({ style }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 4200);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Animated.View style={[{ width: "100%", height: "100%", opacity }, style]}>
      <GLView
        style={{ width: "100%", height: "100%" }}
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
            const float PHASE1_DURATION = 0.6; // Duration for phase 1
            const float PHASE2_DURATION = 0.6; // Duration for phase 2
            const float PHASE3_DURATION = 1.2; // Duration for phase 3
            const float PHASE4_DURATION = 0.6; // Duration for phase 4

            const float TOTAL_DURATION = PHASE1_DURATION + PHASE2_DURATION + PHASE3_DURATION + PHASE4_DURATION;

            // Rotation angles
            const float ROTATION_PHASE1 = radians(70.0); // 70 degrees
            const float ROTATION_PHASE2 = radians(-50.0); // -50 degrees
            const float ROTATION_PHASE4 = radians(40.0); // 40 degrees for phase 4

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
                if (t < 0.5) {
                    return mix(COL2, COL3, smoothstep(0., 0.5, t));
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
                    // Phase 2: Counterclockwise rotation and getting bigger
                    float t = (time - PHASE1_DURATION) / PHASE2_DURATION;
                    float easedT = easeInOutCubic(t);
                    rotationAngle = ROTATION_PHASE1 + ROTATION_PHASE2 * easedT;
                    sizeFactor = mix(0.7, 1.5, easedT);
                } else if (time < PHASE1_DURATION + PHASE2_DURATION + PHASE3_DURATION) {
                    // Phase 3: Slowly getting bigger
                    float t = (time - PHASE1_DURATION - PHASE2_DURATION) / PHASE3_DURATION;
                    rotationAngle = ROTATION_PHASE1 + ROTATION_PHASE2;
                    
                    // Breathing effect
                    float breathingCycles = 2.0;
                    float breathingT = sin(t * breathingCycles * 3.14159) * 0.15 + 1.65;
                    sizeFactor = mix(1.5, breathingT, t);
                } else {
                    // Phase 4: clockwise rotation and getting smaller
                    float t = (time - PHASE1_DURATION - PHASE2_DURATION - PHASE3_DURATION) / PHASE4_DURATION;
                    float easedT = easeInOutCubic(t);
                    
                    // The final size at the end of phase 3
                    float finalPhase3Size = sin(2.0 * 3.14159) * 0.15 + 1.65;
                    sizeFactor = mix(finalPhase3Size, 0.5, easedT);
                    
                    rotationAngle = ROTATION_PHASE1 + ROTATION_PHASE2 + ROTATION_PHASE4 * easedT;
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
    </Animated.View>
  );
}
