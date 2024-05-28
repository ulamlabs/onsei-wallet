import { Colors } from "@/styles";
import { PropsWithChildren } from "react";
import { Row } from "./layout";

export default function Box({ children }: PropsWithChildren) {
  return (
    <Row
      style={{
        backgroundColor: Colors.background200,
        padding: 5,
        borderRadius: 22,
        alignItems: "center",
        paddingHorizontal: 22,
        paddingVertical: 16,
        gap: 15,
      }}
    >
      {children}
    </Row>
  );
}
