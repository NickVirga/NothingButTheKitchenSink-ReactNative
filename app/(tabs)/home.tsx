import {
  ActivityIndicator,
  Image,
  Modal,
  View,
  Text,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { apiClient } from "../../context/AuthContext";
import {
  ThemedButton,
  ThemedText,
  ThemedView,
  Task,
  CreateTask,
} from "../../components";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UserType, UserResponse } from "../../types/user";
import {
  TaskType,
  NewTaskType,
  TasksResponse,
  TaskResponse,
} from "../../types/tasks";
import { useTheme } from "../../context/ThemeContext";
import { add } from "../../constants/icons";
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const Home = () => {
  const { theme } = useTheme();
  const tasksListExample: TaskType[] = [
    {
      id: "1dd8b773-d265-4527-84b1-87ed6b30dea1",
      description:
        "Clean all dishes in sink 6. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore mollitia ratione rem nulla accusamus asperiores quod distinctio, expedita non minima, unde aut quaerat nostrum? Tempora consequatur voluptate accusantium sed quos!",
      is_flagged: false,
      is_complete: false,
      due_at: "2025-01-28T16:13:36.948089",
    },
    {
      id: "da752078-e2c8-4e05-8c3b-a610ea4e0e62",
      description: "Clean all dishes in sink 7.",
      is_flagged: true,
      is_complete: false,
      due_at: "2025-01-28T15:00:00",
    },
    // {
    //   id: "4ec9eff8-6499-4d70-be96-0b668c176a83",
    //   description: "Clean all dishes in sink 8.",
    //   is_flagged: true,
    //   is_complete: false,
    //   due_at: "2025-01-28T15:00:00",
    // },
    // {
    //   id: "1dd8b773-d265-4527-84b1-87ed6b30dea2",
    //   description: "Clean all dishes in sink 6.",
    //   is_flagged: false,
    //   is_complete: false,
    //   due_at: "2025-01-28T16:13:36.948089",
    // },
    // {
    //   id: "da752078-e2c8-4e05-8c3b-a610ea4e0e63",
    //   description: "Clean all dishes in sink 7.",
    //   is_flagged: true,
    //   is_complete: false,
    //   due_at: "2025-01-28T15:00:00",
    // },
    // {
    //   id: "4ec9eff8-6499-4d70-be96-0b668c176a84",
    //   description: "Clean all dishes in sink 8.",
    //   is_flagged: true,
    //   is_complete: false,
    //   due_at: "2025-01-28T15:00:00",
    // },
    // {
    //   id: "1dd8b773-d265-4527-84b1-87ed6b30dea5",
    //   description: "Clean all dishes in sink 6.",
    //   is_flagged: false,
    //   is_complete: false,
    //   due_at: "2025-01-28T16:13:36.948089",
    // },
    // {
    //   id: "da752078-e2c8-4e05-8c3b-a610ea4e0e66",
    //   description: "Clean all dishes in sink 7.",
    //   is_flagged: true,
    //   is_complete: false,
    //   due_at: "2025-01-28T15:00:00",
    // },
    // {
    //   id: "4ec9eff8-6499-4d70-be96-0b668c176a87",
    //   description: "Clean all dishes in sink 8.",
    //   is_flagged: true,
    //   is_complete: false,
    //   due_at: "2025-01-28T15:00:00",
    // },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tasksList, setTasksList] = useState<TaskType[] | []>([]);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data }: { data: UserResponse } =
          await apiClient.get<UserResponse>("/api/user");
        // console.log("user", data.user);
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    const getTasksData = async () => {
      try {
        const { data }: { data: TasksResponse } =
          await apiClient.get<TasksResponse>("/api/tasks");
        // console.log("tasks", data.tasks);
        setTasksList(data.tasks);
      } catch (err) {
        console.error("Error fetching tasks data:", err);
      }
    };
    const loadData = async () => {
      await Promise.all([getUserData(), getTasksData()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const createTask = async (newTask: NewTaskType) => {
    console.log(newTask);
    try {
      const { data }: { data: TaskResponse } =
        await apiClient.post<TaskResponse>("/api/tasks", {
          description: newTask.description,
          due_at: newTask.due_at,
          is_flagged: newTask.is_flagged,
        });
      console.log("tasks", data.task);
      setTasksList(tasksList);
      setTasksList([...tasksList, data.task]);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const updateTaskCompletion = (taskId: string, isComplete: boolean) => {
    setTasksList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, is_complete: isComplete } : task
      )
    );
  };

  const updateTaskFlagged = (taskId: string, isFlagged: boolean) => {
    setTasksList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, is_flagged: isFlagged } : task
      )
    );
  };

  const removeTask = (id: string) => {
    setTasksList((prevTasksList) =>
      prevTasksList.filter((task) => task.id !== id)
    );
  };

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
    );
  }

  return (
    <GestureHandlerRootView>
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: theme.background,
        }}
      >
        <ThemedView
          style={{
            flex: 0,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: 16,
          }}
        >
          <Image
            source={
              user
                ? {
                    uri: `https://api.dicebear.com/6.x/bottts/png?seed=${user.id}`,
                  }
                : undefined
            }
            style={{
              width: 32,
              height: 32,
              borderRadius: 50,
              backgroundColor: user ? "transparent" : theme.backgroundSubtle,
            }}
          />
          <ThemedText style={{ fontSize: 16 }}>{user?.name}</ThemedText>
        </ThemedView>
        <ThemedView
          style={{ flexDirection: "row", gap: 6, flex: 0, marginBottom: 16 }}
        >
          <ThemedText>{formatDate(new Date())}</ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            marginBottom: 16,
            flex: 0,
          }}
        >
          <ThemedText style={{ fontWeight: "bold" }}>Progress</ThemedText>
          <View
            style={{
              borderStyle: "solid",
              borderColor: "black",
              borderWidth: 2,
              height: 100,
              width: 100,
              alignSelf: "center",
              borderRadius: "50%",
            }}
          ></View>
        </ThemedView>
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flex: 0,
            marginBottom: 16,
          }}
        >
          <ThemedText style={{ fontWeight: "bold" }}>Tasks</ThemedText>
          <ThemedButton
            title={"Add Task"}
            handlePress={() => {
              setModalVisible(true);
            }}
            customContainerStyles={{
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 20,
              borderColor: theme.backgroundNotable,
              backgroundColor: theme.backgroundNotable,
            }}
            customTextStyles={{
              color: theme.buttonNotableText,
              paddingRight: 4,
            }}
            customIconStyles={{ tintColor: theme.buttonNotableText }}
            icon={add}
          ></ThemedButton>
        </ThemedView>
        <FlatList
          data={tasksList}
          keyExtractor={(task) => task.id}
          renderItem={({ item }) => (
            !modalVisible ? <Task
              task={item}
              updateTaskCompletion={updateTaskCompletion}
              updateTaskFlagged={updateTaskFlagged}
              removeTask={removeTask}
              // ListEmptyComponent={<Text style={{ textAlign: "center" }}>No tasks available</Text>}
            /> : <></>
          )}
          contentContainerStyle={{ gap: 4 }}
          showsVerticalScrollIndicator={false}
        />

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <CreateTask
            handleAddTask={createTask}
            handleClose={() => setModalVisible(false)}
          />
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Home;
