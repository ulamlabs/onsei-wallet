import { Colors } from "@/styles";
import React, { useState, useRef } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

type TooltipProps = {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
};

export const Tooltip = ({ children, tooltipContent }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const touchableRef = useRef<TouchableOpacity>(null);

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const toggleTooltip = () => {
    if (!isVisible && touchableRef.current) {
      touchableRef.current.measure(
        (
          fx: number,
          fy: number,
          elementWidth: number,
          elementHeight: number,
          px: number,
          py: number,
        ) => {
          setPosition({ top: py + elementHeight, left: px });
          setIsVisible(true);
        },
      );
    } else {
      setIsVisible(false);
    }
  };

  const handleTooltipLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;

    let adjustedTop = position.top;
    let adjustedLeft = position.left;

    if (position.top + height > screenHeight) {
      adjustedTop = position.top - height - 10;
    }

    if (position.left + width > screenWidth) {
      adjustedLeft = screenWidth - width - 10;
    }

    if (adjustedLeft < 0) {
      adjustedLeft = 10;
    }

    setPosition({ top: adjustedTop, left: adjustedLeft });
  };

  return (
    <View>
      <TouchableOpacity ref={touchableRef} onPress={toggleTooltip}>
        {children}
      </TouchableOpacity>

      <Modal
        transparent
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsVisible(false)}
        >
          <View
            style={[
              styles.tooltipContainer,
              { top: position.top, left: position.left },
            ]}
            onLayout={handleTooltipLayout}
          >
            {tooltipContent}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.backgroundOpacity,
    justifyContent: "flex-start",
  },
  tooltipContainer: {
    position: "absolute",
    backgroundColor: Colors.transparent,
  },
  tooltipText: {
    color: Colors.text,
  },
});
