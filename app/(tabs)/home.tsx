import {
  ActivityIndicator,
  Image,
  Modal,
  View,
  Text,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { apiClient } from "../../context/AuthContext";
import {
  ThemedButton,
  ThemedText,
  ThemedView,
  Task,
  CreateEditTask,
  ProgressCircle,
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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tasksList, setTasksList] = useState<TaskType[] | []>([]);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isToDoFilter, setIsToDoFilter] = useState<boolean>(true);

  const { completedPercentage, flaggedPercentage, overduePercentage } =
    useMemo(() => {
      if (tasksList.length === 0) {
        return {
          completedPercentage: 0,
          flaggedPercentage: 0,
          overduePercentage: 0,
        };
      }

      const tasksTotalCnt = tasksList.length;
      const tasksCompleteCnt = tasksList.filter(
        (task) => task.is_complete
      ).length;
      const tasksFlaggedeCnt = tasksList.filter(
        (task) => task.is_flagged
      ).length;
      const tasksOverdueCnt = tasksList.filter((task) => {
        const now = Date.now();
        const then = new Date(task.due_at).getTime();
        if (then < now) return true;
        return false;
      }).length;
      

      return {
        completedPercentage: (tasksCompleteCnt / tasksTotalCnt) * 100,
        flaggedPercentage: (tasksFlaggedeCnt / tasksTotalCnt) * 100,
        overduePercentage: (tasksOverdueCnt / tasksTotalCnt) * 100
      };

    }, [tasksList]);


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

        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    const getTasksData = async () => {
      try {
        const { data }: { data: TasksResponse } =
          await apiClient.get<TasksResponse>("/api/tasks");

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
    try {
      const { data }: { data: TaskResponse } =
        await apiClient.post<TaskResponse>("/api/tasks", {
          description: newTask.description,
          due_at: newTask.due_at,
          is_flagged: newTask.is_flagged,
        });

      setTasksList((prevTasks) => {
        const newTasks = [...prevTasks, data.task];

        return newTasks.sort((a, b) => {
          if (!a.due_at) return 1;
          if (!b.due_at) return -1;
          return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
        });
      });

      setModalVisible(false);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const updateTask = async (updatedTask: TaskType) => {
    try {
      const { data }: { data: TaskResponse } =
        await apiClient.put<TaskResponse>(`/api/tasks/${updatedTask.id}`, {
          description: updatedTask.description,
          due_at: updatedTask.due_at,
          is_flagged: updatedTask.is_flagged,
        });

      setTasksList((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task.id === updatedTask.id ? data.task : task
        );

        return [...updatedTasks].sort((a, b) => {
          if (!a.due_at) return 1;
          if (!b.due_at) return -1;
          return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
        });
      });

      setModalVisible(false);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const updateTaskCompletion = async (taskId: string, isComplete: boolean) => {
    try {
      const { data }: { data: TaskResponse } =
        await apiClient.patch<TaskResponse>(`/api/tasks/${taskId}/complete`, {
          is_complete: isComplete,
        });

      setTasksList((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                is_complete: data.task.is_complete,
                completed_at: data.task.completed_at,
              }
            : task
        )
      );
    } catch (err) {
      console.error("Error updating task completion status:", err);
    }
  };

  const updateTaskFlagged = async (taskId: string, isFlagged: boolean) => {
    try {
      const { data }: { data: TaskResponse } =
        await apiClient.patch<TaskResponse>(`/api/tasks/${taskId}/flag`, {
          is_flagged: isFlagged,
        });

      setTasksList((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, is_flagged: isFlagged } : task
        )
      );
    } catch (err) {
      console.error("Error updating task flagged status:", err);
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      await apiClient.delete<TaskResponse>(`/api/tasks/${taskId}`);

      setTasksList((prevTasksList) =>
        prevTasksList.filter((task) => task.id !== taskId)
      );
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color={theme.text} style={{ flex: 1 }} />
    );
  }

  const handleLayout = () => {
    setIsLoading(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: theme.background,
        }}
        onLayout={handleLayout}
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
          {/* <View
            style={{
              borderStyle: "solid",
              borderColor: "black",
              borderWidth: 2,
              height: 100,
              width: 100,
              alignSelf: "center",
              borderRadius: "50%",
            }}
          ></View> */}
          <ProgressCircle
            segments={[
              { percentage: flaggedPercentage, color: "yellow" },
              { percentage: overduePercentage, color: "red" },
              { percentage: completedPercentage, color: "green" },
            ]}
            size={100}
            strokeWidth={8}
          ></ProgressCircle>
          <Text>{(`flaggedPercentage: ${flaggedPercentage}`)}</Text>
          <Text>{(`overduePercentage: ${overduePercentage}`)}</Text>
          <Text>{(`completedPercentage: ${completedPercentage}`)}</Text>
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
              setIsEditMode(false);
              setModalVisible(true);
            }}
            customContainerStyles={{
              paddingVertical: 4,
              paddingHorizontal: 8,
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

        <View style={{ flexDirection: "row" }}>
          <ThemedButton
            title="To Do"
            handlePress={() => {
              setIsToDoFilter(true);
            }}
            customContainerStyles={{
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 0,
              height: 35,
              flex: 1,
              backgroundColor: isToDoFilter
                ? theme.backgroundSubtle
                : theme.background,
              borderWidth: 0,
            }}
            customTextStyles={{
              fontSize: 14,
              color: isToDoFilter ? theme.text : theme.textSubtle,
              fontFamily: "Poppins",
            }}
          ></ThemedButton>
          <ThemedButton
            title="Completed"
            handlePress={() => {
              setIsToDoFilter(false);
            }}
            customContainerStyles={{
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 0,
              height: 35,
              flex: 1,
              backgroundColor: isToDoFilter
                ? theme.background
                : theme.backgroundSubtle,
              borderWidth: 0,
            }}
            customTextStyles={{
              fontSize: 14,
              color: isToDoFilter ? theme.textSubtle : theme.text,
              fontFamily: "Poppins",
            }}
          ></ThemedButton>
        </View>
        {!modalVisible && (
          <FlatList
            data={tasksList.filter(
              (task) => task.is_complete === !isToDoFilter
            )}
            keyExtractor={(task) => task.id}
            renderItem={({ item }) => (
              <Task
                task={item}
                updateTaskCompletion={updateTaskCompletion}
                updateTaskFlagged={updateTaskFlagged}
                removeTask={removeTask}
                handleSelection={(task) => {
                  setSelectedTask(task);
                  setIsEditMode(true);
                  setModalVisible(true);
                }}
              />
            )}
            contentContainerStyle={{ gap: 4 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 16 }}>
                {tasksList.filter((task) => task.is_complete).length == 0
                  ? "Complete your first task by swiping right on a To Do task."
                  : "Create your first task with the Add Task button."}
              </Text>
            }
          />
        )}

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            if (isEditMode) {
              setSelectedTask(null);
            }
            setModalVisible(false);
          }}
        >
          <CreateEditTask
            task={selectedTask}
            isEditMode={isEditMode}
            handleAddTask={createTask}
            handleEditTask={updateTask}
            handleClose={() => {
              if (isEditMode) {
                setSelectedTask(null);
              }
              setModalVisible(false);
            }}
          />
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
