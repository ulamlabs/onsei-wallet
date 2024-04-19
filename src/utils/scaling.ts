import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on iPhone 14, which was used as a simulator during development
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
