import { FontSizes } from "@/styles";

export const iconSize = 40;

export const placeholderFontSize = FontSizes.lg;
export const placeholderLineHeight = placeholderFontSize * 1.2;
export const chainFontSize = FontSizes.sm;
export const chainLineHeight = chainFontSize * 1.5;

export const labelsHeight = placeholderLineHeight + chainLineHeight;

export const selectorButtonHeight = Math.max(iconSize, labelsHeight);
