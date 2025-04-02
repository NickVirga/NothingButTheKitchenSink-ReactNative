import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';

import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import ReanimatedSwipeable, {
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

function LeftAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {

    return {
      transform: [{ translateX: drag.value - 400 }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <Text style={styles.leftAction}>Text</Text>
    </Reanimated.View>
  );
}

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {

    return {
      transform: [{ translateX: drag.value + 400 }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <Text style={styles.rightAction}>Text</Text>
    </Reanimated.View>
  );
}

export default function Example() {
  const [parentWidth, setParentWidth] = useState(0);

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        containerStyle={styles.swipeable}
        friction={2}
        leftThreshold={80}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderLeftActions={LeftAction}
        renderRightActions={RightAction}>
        <Text>[Reanimated] Swipe me!</Text>
      </ReanimatedSwipeable>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  leftAction: { width: 400, height: 100, backgroundColor: 'crimson' },
  rightAction: { width: 400, height: 100, backgroundColor: 'purple' },
  separator: {
    width: '100%',
    borderTopWidth: 1,
  },
  swipeable: {
    height: 100,
    backgroundColor: 'papayawhip',
    alignItems: 'center',
  },
});