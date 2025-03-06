import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { NewTaskType } from "../types/tasks";
import { close } from "../constants/icons";
import StaticIcon from "../components/StaticIcon";
import { useTheme } from "../context/ThemeContext";

type EditTasksProps = {
  handleEditTask: (newTask: NewTaskType) => void;
  handleClose: () => void;
};

const EditTask: React.FC<EditTasksProps> = ({
  handleEditTask,
  handleClose,
}) => {
  const [newTask, setNewTask] = useState<NewTaskType>({
    description: undefined,
    is_flagged: false,
    due_at: new Date().toISOString(),
  });

  const { theme } = useTheme();

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <StaticIcon
          size={32}
          icon={close}
          color={theme.icon}
          isTouchable={true}
          handlePressIcon={handleClose}
        />
        <Text style={styles.modalTitle}>Edit task</Text>
        <TextInput
          placeholder="Task Description"
          style={styles.input}
          value={newTask.description}
          onChangeText={(text) => setNewTask({ ...newTask, description: text })}
        />
        <TextInput
          placeholder="Due Time"
          style={styles.input}
          value={newTask.due_at}
          onChangeText={(text) => setNewTask({ ...newTask, due_at: text })}
        />
        <TouchableOpacity
          style={styles.flagButton}
          onPress={() =>
            setNewTask({ ...newTask, is_flagged: !newTask.is_flagged })
          }
        >
          <Text style={styles.flagButtonText}>
            Flagged: {newTask.is_flagged ? "Yes" : "No"}
          </Text>
        </TouchableOpacity>
        <Button
          title="Add Task"
          onPress={() => {
            handleEditTask(newTask);
          }}
        />
        <Button title="Cancel" onPress={handleClose} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  flagButton: {
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 12,
  },
  flagButtonText: {
    color: "#007bff",
  },
});

export default EditTask;
