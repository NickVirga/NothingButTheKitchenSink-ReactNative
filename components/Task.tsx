import React, { useState } from "react";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import StaticIcon from "../components/StaticIcon";
import { StyleSheet, Text, View } from "react-native";
import { TaskType } from "../types/tasks";
import { flag, clock, trashcan, check, edit } from "../constants/icons";
import { useTheme } from "../context/ThemeContext";
import { apiClient } from "../context/AuthContext";
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface TaskProps {
  task: TaskType;
  updateTaskCompletion: (taskId: string, newCompletionState: boolean) => void;
  updateTaskFlagged: (taskId: string, newFlaggedState: boolean) => void;
  removeTask: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({
  task,
  updateTaskCompletion,
  updateTaskFlagged,
  removeTask
}) => {
  const { theme } = useTheme();
  const [parentWidth, setParentWidth] = useState(0);

  const buildDueString = (diffMs: number): string => {
    const absDiffSec = Math.abs(Math.floor(diffMs / 1000));
    const absDiffMin = Math.abs(Math.floor(absDiffSec / 60));
    const absDiffHr = Math.abs(Math.floor(absDiffMin / 60));
    const absDiffDay = Math.abs(Math.floor(absDiffHr / 24));

    const duePrefix = diffMs > 0 ? "due in" : "overdue";

    const getTimeUnit = () => {
      const pluralize = (value: number, unit: string) =>
        `${value} ${unit}${value > 1 ? "s" : ""}`;

      if (absDiffDay > 30) return ">30 days";
      if (absDiffDay > 0) return pluralize(absDiffDay, "day");
      if (absDiffHr > 0) return pluralize(absDiffHr, "hour");
      if (absDiffMin > 0) return pluralize(absDiffMin, "minute");
      return pluralize(absDiffSec, "second");
    };

    return `${duePrefix} ${getTimeUnit()}`;
  };

  const createTimeRemaining = (dueDatetime: string): JSX.Element => {
    const now = Date.now();
    const then = new Date(dueDatetime).getTime();
    const diff = then - now;

    return (
      <>
        <StaticIcon
          icon={clock}
          size={16}
          color={diff > 0 ? theme.icon : theme.error}
        />
        <Text
          style={[
            styles.timeText,
            { color: diff > 0 ? theme.text : theme.error },
          ]}
        >
          {buildDueString(diff)}
        </Text>
      </>
    );
  };

  const setTaskFlag = async (newflaggedState: boolean) => {
    try {
      const response = await apiClient.patch(`/api/tasks/${task.id}/flag`, {
        is_flagged: newflaggedState,
      });

      if (response.status === 200) {
        updateTaskFlagged(task.id, newflaggedState);
      }
    } catch (err) {
      console.error("Error setting task flag:", err);
    }
  };

  const setTaskCompletion = async (newCompletionState: boolean) => {
    try {
      const response = await apiClient.patch(`/api/tasks/${task.id}/complete`, {
        is_complete: newCompletionState,
      });

      if (response.status === 200) {
        updateTaskCompletion(task.id, newCompletionState);
      }
    } catch (err) {
      console.error("Error setting task completion status:", err);
    }
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
          { backgroundColor: theme.completed },
        ]}
      >
        <Reanimated.View
          style={[
            labelPosition,
            styles.actionLabel,
          ]}
        >
          <StaticIcon size={32} icon={check} color={theme.backgroundSubtle} />
          <Reanimated.Text
            style={[styles.actionText, { color: theme.backgroundSubtle }]}
          >
            Done
          </Reanimated.Text>
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
        onLayout={(event) => setParentWidth(event.nativeEvent.layout.width)}
      >
        <Reanimated.View
          style={[
            labelPosition,
            styles.actionLabel,
          ]}
        >
          <StaticIcon
            size={32}
            icon={trashcan}
            color={theme.backgroundSubtle}
          />
          <Reanimated.Text
            style={[styles.actionText, { color: theme.backgroundSubtle }]}
          >
            Delete
          </Reanimated.Text>
        </Reanimated.View>
      </Reanimated.View>
    );
  };

  const handleSwipeableOpen = (direction: string) => {
    console.log("direction:", direction)

    if (direction == "right") {


    }  else if (direction == "left") {


    }
    console.log("remove task")
    removeTask(task.id)


  }

  const openEditModal = () => {
    
  }

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        containerStyle={[
          { backgroundColor: theme.backgroundSubtle },
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
        onSwipeableOpen={(direction)=>{handleSwipeableOpen(direction)}}

      >
        <TouchableWithoutFeedback onLongPress={() => console.log("edit task")}>
          <View style={styles.rowBetween}>
            <Text style={styles.taskDescription}>{task.description}</Text>
            <View style={styles.iconContainer}>
              <StaticIcon
                icon={flag}
                size={32}
                color={task.is_flagged ? theme.flagged : theme.background}
                isTouchable={true}
                handlePressIcon={() => setTaskFlag(!task.is_flagged)}
              />
            </View>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.timeRemaining}>
              {createTimeRemaining(task.due_at)}
            </View>

          </View>
        </TouchableWithoutFeedback>
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
    fontSize: 12,
    lineHeight: 14,
  },
});
