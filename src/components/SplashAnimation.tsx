import { Colors } from "@/styles";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Image } from "react-native";

const blob = require("../../assets/blob.png");
const logo = require("../../assets/logo.png");

type Props = {
  onFinish: () => void;
};

export default function SplashAnimation({ onFinish }: Props) {
  const { width, height } = Dimensions.get("window");
  const rotation = useRef(new Animated.Value(0)).current;
  const scaleContainer = useRef(new Animated.Value(1)).current;
  const scaleBlobs = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    rotation.setValue(0);
    scaleContainer.setValue(1);
    scaleBlobs.setValue(1);
    opacity.setValue(1);
    Animated.sequence([
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.circle),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(scaleContainer, {
          toValue: 0.5,
          duration: 1000,
          easing: Easing.inOut(Easing.circle),
          useNativeDriver: true,
        }),
        Animated.timing(scaleBlobs, {
          toValue: 3.5,
          duration: 1000,
          easing: Easing.inOut(Easing.circle),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(rotation, {
          toValue: 0.1,
          duration: 1000,
          easing: Easing.inOut(Easing.circle),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.circle),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "60deg"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        backgroundColor: Colors.background,
        opacity: opacity,
        elevation: 2,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: [
            { rotate: rotationInterpolate },
            { scale: scaleContainer },
          ],
        }}
      >
        <Animated.Image
          style={{
            position: "absolute",
            top: height / 12,
            left: width / 5,
            width: width,
            transform: [
              { translateX: -(width + 50) / 2 },
              { translateY: -(width + 50) / 2 },
              { scale: scaleBlobs },
            ],
          }}
          source={blob}
          resizeMode="contain"
        />
        <Animated.Image
          style={{
            position: "absolute",
            bottom: height / 12,
            right: width / 5,
            width: width,
            transform: [
              { translateX: (width + 50) / 2 },
              { translateY: (width + 50) / 2 },
              { scale: scaleBlobs },
            ],
          }}
          source={blob}
          resizeMode="contain"
        />
      </Animated.View>
      <Image
        source={logo}
        resizeMode="contain"
        style={{
          position: "absolute",
          width: 164,
          height: 66,
          top: "50%",
          left: "50%",
          transform: [{ translateX: -82 }, { translateY: -33 }],
          zIndex: 1,
        }}
      />
    </Animated.View>
  );
}
