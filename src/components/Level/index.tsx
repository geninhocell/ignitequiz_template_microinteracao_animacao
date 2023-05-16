import { Text, PressableProps, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolateColor
} from 'react-native-reanimated';

import { THEME } from '../../styles/theme';
import { styles } from './styles';
import { useEffect } from 'react';

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

const TYPE_COLORS = {
  EASY: THEME.COLORS.BRAND_LIGHT,
  HARD: THEME.COLORS.DANGER_LIGHT,
  MEDIUM: THEME.COLORS.WARNING_LIGHT,
}

type Props = PressableProps & {
  title: string;
  isChecked?: boolean;
  type?: keyof typeof TYPE_COLORS;
}

export function Level({ title, type = 'EASY', isChecked = false, ...rest }: Props) {
  const scale = useSharedValue(1);
  const checked = useSharedValue(1);

  const COLOR = TYPE_COLORS[type];

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }], // tamanho do componente
      backgroundColor: interpolateColor( // transita de uma cor para outra 
        checked.value,
        [0, 1], // valores possíveis
        ['transparent', COLOR] // cores correspondentes aos tipos [0, 1]
      )
    }
  })

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        checked.value,
        [0, 1],
        [COLOR, THEME.COLORS.GREY_100]
      )
    }
  })

  // withSpring efeito mola
  // withTiming efeito linear
  // withTiming(1.1, {easing: Easing.bounce, duration: 700});
  // duration mili seconds
  // Easing.bounce efeito quicar

  function onPressIn() {
    scale.value = withTiming(1.1, {easing: Easing.bounce, duration: 700});
  }

  function onPressOut() {
    scale.value = withTiming(1);
  }

  useEffect(() => {
    checked.value = withTiming(isChecked ? 1 : 0);
  },[isChecked])

  return (
    <PressableAnimated style={
      [
        styles.container,
        { borderColor: COLOR },
        animatedContainerStyle
      ]
    } onPressIn={onPressIn} onPressOut={onPressOut} {...rest}>
        <Animated.Text style={
          [
            styles.title,
            animatedTextStyle
          ]}>
          {title}
        </Animated.Text>
    </PressableAnimated>
  );
}