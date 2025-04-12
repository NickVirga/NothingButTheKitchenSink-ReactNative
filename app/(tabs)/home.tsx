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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tasksList, setTasksList] = useState<TaskType[] | []>([]);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isToDoFilter, setIsToDoFilter] = useState<boolean>(true);

  const {
    completedPercentage,
    flaggedPercentage,
    overduePercentage,
    tasksTotalCnt,
    tasksCompleteCnt,
    tasksFlaggedCnt,
    tasksOverdueCnt,
  } = useMemo(() => {
    if (tasksList.length === 0) {
      return {
        completedPercentage: 0,
        flaggedPercentage: 0,
        overduePercentage: 0,
        tasksTotalCnt: 0,
        tasksCompleteCnt: 0,
        tasksFlaggedCnt: 0,
        tasksFlaggedNotOverdueCnt: 0,
        tasksOverdueCnt: 0,
      };
    }

    let tasksCompleteCnt = 0;
    let tasksFlaggedCnt = 0;
    let tasksFlaggedNotOverdueCnt = 0;
    let tasksOverdueCnt = 0;
    const now = Date.now();

    for (const task of tasksList) {
      const dueTime = new Date(task.due_at).getTime();
      const isComplete = task.is_complete;
      const isFlagged = task.is_flagged;

      if (isComplete) {
        tasksCompleteCnt++;
      } else {
        if (dueTime < now) {
          tasksOverdueCnt++;
        }
        if (isFlagged) {
          tasksFlaggedCnt++;
          if (dueTime >= now) {
            tasksFlaggedNotOverdueCnt++;
          }
        }
      }
    }

    const tasksTotalCnt = tasksList.length;

    return {
      completedPercentage: (tasksCompleteCnt / tasksTotalCnt) * 100,
      flaggedPercentage: (tasksFlaggedNotOverdueCnt / tasksTotalCnt) * 100,
      overduePercentage: (tasksOverdueCnt / tasksTotalCnt) * 100,
      tasksTotalCnt,
      tasksCompleteCnt,
      tasksFlaggedCnt,
      tasksOverdueCnt,
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
          <ThemedView
            style={{ flex: 0, flexDirection: "row", alignItems: "center" }}
          >
            <ThemedView style={{ flex: 0, position: "absolute" }}>
              {tasksCompleteCnt > 0 && <ThemedText
                style={{ color: theme.completed }}
              >{`Completed: ${tasksCompleteCnt}`}</ThemedText>}
              {tasksOverdueCnt > 0 && <ThemedText
                style={{ color: theme.error }}
              >{`Overdue: ${tasksOverdueCnt}`}</ThemedText>}
              {tasksFlaggedCnt > 0 && <ThemedText
                style={{ color: theme.flagged }}
              >{`Flagged: ${tasksFlaggedCnt}`}</ThemedText>}
            </ThemedView>
            <ThemedView style={{ flex: 0, position: 'relative', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
              <ProgressCircle
                segments={[
                  // { percentage: flaggedPercentage, color: theme.flagged },
                  // { percentage: overduePercentage, color: theme.error },
                  { percentage: completedPercentage, color: theme.completed },
                ]}
                size={100}
                strokeWidth={14}
              ></ProgressCircle>
              <ThemedText
                style={{ position: "absolute", fontWeight: "bold"  }}
              >{`${tasksCompleteCnt}/${tasksTotalCnt}`}</ThemedText>
            </ThemedView>
          </ThemedView>
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
