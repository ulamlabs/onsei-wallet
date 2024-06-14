import { FeeTier } from "@/components/FeeBox";

const multipliers = {
  Low: 1,
  Medium: 1.2,
  High: 1.3,
};

export function getSpeedMultiplier(speed: FeeTier) {
  return multipliers[speed];
}
