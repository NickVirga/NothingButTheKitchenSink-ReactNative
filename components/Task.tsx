import React, { useState } from "react";
import StaticIcon from "../components/StaticIcon";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { TaskType } from "../types/tasks";
import { flag, clock, trashcan, check, circle } from "../constants/icons";
import { useTheme } from "../context/ThemeContext";
import { apiClient } from "../context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import ThemedText from "./ThemedText";

interface TaskProps {
  task: TaskType;
  updateTaskCompletion: (taskId: string, newCompletionState: boolean) => void;
  updateTaskFlagged: (taskId: string, newFlaggedState: boolean) => void;
  removeTask: (taskId: string) => void;
  handleSelection: (task: TaskType) => void;
}

const Task: React.FC<TaskProps> = ({
  task,
  updateTaskCompletion,
  updateTaskFlagged,
  removeTask,
  handleSelection,
}) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const screenPadding = 20;
  const parentWidth = width - screenPadding * 2;

  const [isPressed, setIsPressed] = useState(false);

  const buildDueString = (diffMs: number): string => {
    const absDiffSec = Math.abs(Math.floor(diffMs / 1000));
    const absDiffMin = Math.abs(Math.floor(absDiffSec / 60));
    const absDiffHr = Math.abs(Math.floor(absDiffMin / 60));
    const absDiffDay = Math.abs(Math.floor(absDiffHr / 24));

    const duePrefix = () => {
      if (task.is_complete) {
        return "done"
      } else {
        if (diffMs > 0) {
          return "due in"
        } else {
          return "overdue"
        }
      }
    }

    const dueSuffix = task.is_complete ? "ago" : ""

    const getTimeUnit = () => {
      const pluralize = (value: number, unit: string) =>
        `${value} ${unit}${value > 1 ? "s" : ""}`;

      if (absDiffDay > 30) return ">30 days";
      if (absDiffDay > 0) return pluralize(absDiffDay, "day");
      if (absDiffHr > 0) return pluralize(absDiffHr, "hour");
      if (absDiffMin > 0) return pluralize(absDiffMin, "minute");
      return pluralize(absDiffSec, "second");
    };

    return `${duePrefix()} ${getTimeUnit()} ${dueSuffix}`;
  };

  const createTimeRemaining = (dueDatetime: string): JSX.Element => {
    const now = Date.now();

    let then: number;
    if (!task.is_complete) {
      then = new Date(task.due_at).getTime();
    } else {
      if (task.completed_at) {
        then = new Date(task.completed_at).getTime();
      } else {
        then = now
      }
    }

    const diff: number = then - now;

    return (
      <>
        <StaticIcon
          icon={clock}
          size={16}
          color={diff > 0 || task.is_complete ? theme.icon : theme.error}
        />
        <ThemedText
          style={[
            styles.timeText,
            { color: diff > 0 || task.is_complete ? theme.text : theme.error },
          ]}
        >
          {buildDueString(diff)}
        </ThemedText>
      </>
    );
  };

  const LeftAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value - parentWidth }],
      };
    });

    const labelPosition = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: 240 - drag.value }],
      };
    });

    return (
      <Reanimated.View
        style={[
          styleAnimation,
          styles.actionContainer,
          {
            backgroundColor: task.is_complete ? theme.restore : theme.completed,
          },
        ]}
      >
        <Reanimated.View style={[labelPosition, styles.actionLabel]}>
          <StaticIcon
            size={32}
            icon={task.is_complete ? circle : check}
            color={
              isPressed ? theme.backgroundSelected : theme.backgroundSubtle
            }
          />
          {!task.is_complete && (
            <Reanimated.Text
              style={[
                styles.actionText,
                {
                  color: isPressed
                    ? theme.backgroundSelected
                    : theme.backgroundSubtle,
                },
              ]}
            >
              Done
            </Reanimated.Text>
          )}
        </Reanimated.View>
      </Reanimated.View>
    );
  };

  const RightAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>
  ) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + parentWidth }],
      };
    });

    const labelPosition = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: -drag.value - 240 }],
      };
    });

    return (
      <Reanimated.View
        style={[
          styleAnimation,
          styles.actionContainer,
          { backgroundColor: theme.error },
        ]}
      >
        <Reanimated.View style={[labelPosition, styles.actionLabel]}>
          <StaticIcon
            size={32}
            icon={trashcan}
            color={
              isPressed ? theme.backgroundSelected : theme.backgroundSubtle
            }
          />
          <Reanimated.Text
            style={[
              styles.actionText,
              {
                color: isPressed
                  ? theme.backgroundSelected
                  : theme.backgroundSubtle,
              },
            ]}
          >
            Delete
          </Reanimated.Text>
        </Reanimated.View>
      </Reanimated.View>
    );
  };

  const handleSwipeableOpen = (direction: string) => {
    if (direction == "right") {
      removeTask(task.id);
    } else if (direction == "left") {
      updateTaskCompletion(task.id, !task.is_complete);
    }
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        containerStyle={[
          {
            backgroundColor: isPressed
              ? theme.backgroundSelected
              : theme.backgroundSubtle,
          },
          styles.swipeable,
        ]}
        friction={1}
        enableTrackpadTwoFingerGesture
        rightThreshold={80}
        renderRightActions={RightAction}
        overshootRight={false}
        leftThreshold={80}
        renderLeftActions={LeftAction}
        overshootLeft={false}
        onSwipeableOpen={(direction) => {
          handleSwipeableOpen(direction);
        }}
      >
        <Pressable
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleSelection(task);
          }}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
        >
          <View style={styles.taskContainer}>
            <ThemedText style={styles.taskDescription}>{task.description}</ThemedText>
            <View style={styles.iconContainer}>
              <StaticIcon
                icon={flag}
                size={32}
                color={task.is_flagged ? theme.flagged : theme.background}
                isTouchable={true}
                handlePressIcon={() => updateTaskFlagged(task.id, !task.is_flagged)}
              />
            </View>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.timeRemaining}>
              {createTimeRemaining(task.due_at)}
            </View>
          </View>
        </Pressable>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

export default Task;

const styles = StyleSheet.create({
  actionContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 9,
  },
  actionLabel: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  swipeable: {
    borderRadius: 5,
    flex: 1,
    padding: 8,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  taskContainerPressed: {
    backgroundColor: "#d3d3d3",
  },
  iconContainer: {
    justifyContent: "flex-start",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
  timeRemaining: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  taskDescription: {
    fontSize: 16,
    flex: 1,
    flexWrap: "wrap",
  },
  timeText: {
    fontSize: 10,
    lineHeight: 14,
  },
});
