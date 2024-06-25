import {
  Column,
  CopyAddress,
  Headline,
  Loader,
  NoBackupIcon,
  Paragraph,
  Row,
  SafeLayout,
  SecondaryButton,
  Text,
} from "@/components";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import {
  useAccountsStore,
  useSettingsStore,
  useTokenRegistryStore,
  useTokensStore,
} from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { calculateTotalBalance } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";
import {
  ArrowDown,
  ArrowDown2,
  ArrowUp,
  InfoCircle,
  ScanBarcode,
  Setting2,
} from "iconsax-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { TokensList } from "../tokens";

type DashboardProps = NativeStackScreenProps<NavigatorParamsList, "Wallet">;

export default function Dashboard({ navigation }: DashboardProps) {
  const { activeAccount } = useAccountsStore();
  const { updateBalances, tokens } = useTokensStore();
  const { refreshRegistryCache } = useTokenRegistryStore();
  const {
    settings: { globalGasPrice },
    setSetting,
  } = useSettingsStore();
  const {
    settings: { node },
  } = useSettingsStore();

  function onReceive() {
    navigation.navigate("Your SEI address");
  }
  function onSend() {
    setSetting("localGasPrice", globalGasPrice);
    navigation.navigate("transferSelectAddress");
  }
  function onScan() {
    navigation.push("Connect Wallet");
  }
  async function onRefresh() {
    await refreshRegistryCache();
    updateBalances();
  }

  function render() {
    const hasTokensWithoutPrice = tokens.some((token) => !token.price);
    if (!activeAccount) {
      return <Loader />;
    }

    return (
      <>
        {node === "TestNet" && (
          <Row
            style={{
              backgroundColor: Colors.markerBackground,
              paddingVertical: 12,
              justifyContent: "center",
              width: "100%",
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: FontSizes.base,
                fontFamily: FontWeights.bold,
                color: Colors.markerText,
              }}
            >
              Testnet mode
            </Text>
          </Row>
        )}
        <Headline size="2xl" style={{ marginBottom: 0 }}>
          ${calculateTotalBalance(tokens)}
        </Headline>
        {hasTokensWithoutPrice && (
          <Row
            style={{
              gap: 6,
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: Colors.background100,
              borderRadius: 30,
            }}
          >
            <InfoCircle size={16} color={Colors.text100} />
            <Text style={{ color: Colors.text100 }}>
              Excludes unknown value assets
            </Text>
          </Row>
        )}
      </>
    );
  }

  function openSettings() {
    navigation.navigate("Settings");
  }

  return (
    <>
      <DashboardHeader style={{ backgroundColor: "transparent" }}>
        <TouchableOpacity onPress={openSettings}>
          <Setting2 size={22} color={Colors.text100} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Wallets")}
          style={{ flexDirection: "row", gap: 4 }}
        >
          <Row style={{ gap: 4 }}>
            {activeAccount?.passphraseSkipped && <NoBackupIcon />}
            <Paragraph
              style={{
                color: Colors.text,
                fontSize: 18,
                fontFamily: FontWeights.bold,
              }}
            >
              {activeAccount?.name}
            </Paragraph>
            <ArrowDown2 color={Colors.text} />
          </Row>
        </TouchableOpacity>
        <CopyAddress />
      </DashboardHeader>
      <SafeLayout
        style={{ paddingTop: 24, paddingBottom: 65 }}
        refreshFn={onRefresh}
        containerStyle={{ backgroundColor: "transparent" }}
      >
        <Column style={{ alignItems: "center" }}>{render()}</Column>
        <Row
          style={{
            justifyContent: "space-around",
            marginVertical: 30,
          }}
        >
          <SecondaryButton
            title="Send"
            style={{ paddingHorizontal: 20, flex: 1 }}
            onPress={onSend}
            icon={ArrowUp}
          />
          <SecondaryButton
            title="Receive"
            style={{ paddingHorizontal: 20, flex: 1 }}
            onPress={onReceive}
            icon={ArrowDown}
          />
          <SecondaryButton
            title="Scan"
            style={{ paddingHorizontal: 20, flex: 1 }}
            onPress={onScan}
            icon={ScanBarcode}
          />
        </Row>
        <TokensList />
      </SafeLayout>
      <View
        style={{
          position: "absolute",
          zIndex: -1,
          height: "100%",
          width: "100%",
          backgroundColor: Colors.background,
        }}
      >
        <CustomGLView />
      </View>
    </>
  );
}

const CustomGLView = () => {
  return (
    <GLView
      style={{ width: "100%", height: 250 }}
      onContextCreate={(gl: ExpoWebGLRenderingContext) => {
        const renderer = new Renderer({ gl });
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

            mat2 Rot(float a)
            {
                float s = sin(a);
                float c = cos(a);
                return mat2(c, -s, s, c);
            }

            vec2 hash( vec2 p )
            {
                p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
                return fract(sin(p)*43758.5453);
            }

            float noise( in vec2 p )
            {
                vec2 i = floor( p );
                vec2 f = fract( p );

                vec2 u = f*f*(3.0-2.0*f);

                float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                                    dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                               mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                                    dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
                return 0.5 + 0.5*n;
            }

            void mainImage( out vec4 fragColor, in vec2 fragCoord )
            {
                vec2 uv = fragCoord / iResolution.xy;
                float ratio = iResolution.x / iResolution.y;

                vec2 tuv = uv;
                tuv -= .5;

                // Blobs movement
                float degree1 = noise(vec2(iTime * 0.1, tuv.x * tuv.y));
                float degree2 = noise(vec2(iTime * 0.05, tuv.y * tuv.x + 10.0));
                float degree3 = noise(vec2(iTime * 0.07, tuv.x * tuv.y - 10.0));

                tuv.y *= 1. / ratio;
                tuv *= Rot(radians((degree1 - 0.5) * 360. + 180.));
                tuv.y *= ratio;

                vec2 tuv2 = tuv * Rot(radians((degree2 - 0.5) * 360. + 180.));
                vec2 tuv3 = tuv * Rot(radians((degree3 - 0.5) * 360. + 180.));

                float frequency = 2.0;
                float amplitude = 10.0;
                float speed = iTime;
                tuv.x += sin(tuv.y * frequency + speed) / amplitude;
                tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

                float frequency2 = 3.0;
                float amplitude2 = 15.0;
                float speed2 = iTime;
                tuv2.x += sin(tuv2.y * frequency2 + speed2) / amplitude2;
                tuv2.y += sin(tuv2.x * frequency2 * 1.2 + speed2) / (amplitude2 * 0.7);

                float frequency3 = 1.5;
                float amplitude3 = 12.0;
                float speed3 = iTime ;
                tuv3.x += sin(tuv3.y * frequency3 + speed3) / amplitude3;
                tuv3.y += sin(tuv3.x * frequency3 * 1.8 + speed3) / (amplitude3 * 0.6);

                // Color Layers
                vec3 color1 = vec3(224.0 / 255.0, 7.0 / 255.0, 66.0 / 255.0); // Darker red
                vec3 color2 = vec3(255.0 / 255.0, 165.0 / 255.0, 0.0 / 255.0); // Orange
                vec3 color3 = vec3(255.0 / 255.0, 87.0 / 255.0, 34.0 / 255.0); // Lighter red
                vec3 color4 = vec3(255.0 / 255.0, 140.0 / 255.0, 0.0 / 255.0); // Another orange

                vec3 layer1 = mix(color1, color2, S(-0.3, 0.2, (tuv * Rot(radians(-5.))).x));
                vec3 layer2 = mix(color3, color4, S(-0.3, 0.2, (tuv2 * Rot(radians(-5.))).x));
                vec3 layer3 = mix(color1, color3, S(-0.3, 0.2, (tuv3 * Rot(radians(-5.))).x));

                vec3 finalComp = mix(layer1, layer2, 0.5) + layer3 * 0.5;

                // Static radial gradient at the top
                vec2 center = vec2(0.5, 1.0);
                float radius = 0.5;
                float dist = length(uv - center) / radius;
                vec3 staticColor = mix(vec3(0.6, 0.0, 0.1), vec3(1.0, 0.5, 0.0), smoothstep(0.0, 1.0, dist));
                
                // Combine static gradient and animated blobs
                float blobAlpha = smoothstep(0.0, 0.5, uv.y);
                vec3 combinedColor = mix(staticColor, finalComp, blobAlpha);

                // Apply a vertical gradient to smooth out the bottom edge
                float fade = smoothstep(0.0, 0.5, uv.y);
                combinedColor *= fade;

                // Add transparency to the lower half
                float alpha = smoothstep(0.0, 0.5, uv.y);

                fragColor = vec4(combinedColor, alpha);
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
          material.uniforms.iTime.value += 0.01; // Slow down the animation speed
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };

        animate();
      }}
    />
  );
};
