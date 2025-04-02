import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NewTaskType, TaskType } from "../types/tasks";
import { close, clock, calendar, error } from "../constants/icons";
import StaticIcon from "./StaticIcon";
import ThemedButton from "./ThemedButton";
import ThemedText from "./ThemedText";
import { useTheme } from "../context/ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";

type CreateEditTasksProps = {
  task?: TaskType | null;
  isEditMode: boolean;
  handleAddTask: (task: NewTaskType) => void;
  handleEditTask: (task: TaskType) => void;
  handleClose: () => void;
};

const CreateEditTask: React.FC<CreateEditTasksProps> = ({
  task,
  isEditMode,
  handleAddTask,
  handleEditTask,
  handleClose,
}) => {
  const [newTask, setNewTask] = useState<NewTaskType>({
    description: "",
    is_flagged: false,
    due_at: new Date(),
  });

  useEffect(() => {
    if (isEditMode && task) {
      setNewTask({
        description: task.description,
        is_flagged: task.is_flagged,
        due_at: new Date(task.due_at),
      });
    }
  }, [task]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [temporaryDate, setTemporaryDate] = useState<Date | undefined>(
    undefined
  );
  const [isError, setIsError] = useState<boolean>(false);
  const { theme } = useTheme();

  const onDateTimeChange = (
    event: any,
    selectedDate?: Date | undefined,
    isDate?: boolean
  ) => {
    if (Platform.OS === "ios") {
      setTemporaryDate(selectedDate);
    } else {
      setNewTask((prevTask) => ({ ...prevTask, due_at: selectedDate }));
      isDate ? setShowDatePicker(false) : setShowTimePicker(false);
    }
  };

  const handleDateTimePickerIosClose = (
    isAccepted: boolean,
    isDate: boolean
  ) => {
    if (isAccepted) {
      setNewTask((prevTask) => ({ ...prevTask, due_at: temporaryDate }));
    }
    isDate ? setShowDatePicker(false) : setShowTimePicker(false);
  };

  const fieldsAreInvalid = () => {
    if (!newTask.description || newTask.description.trim() === "") {
      setIsError(true);
      return true;
    }
    return false;
  };

  const checkAddEditTask = () => {
    if (fieldsAreInvalid()) {
      return;
    }

    if (isEditMode) {
      
      if (task && newTask.description && newTask.due_at)
        handleEditTask({
          id: task.id,
          description: newTask.description,
          due_at: newTask.due_at.toISOString(),
          is_flagged: newTask.is_flagged,
          is_complete: task.is_complete
        });
    } else {
      handleAddTask(newTask);
    }
  };

  const handleChangeText = (text: string) => {
    setIsError(false);
    setNewTask((prevTask) => ({ ...prevTask, description: text }));
  };

  return (
    <View style={styles.modalContainer}>
      <View
        style={[styles.modalContent, { backgroundColor: theme.background }]}
      >
        <StaticIcon
          size={32}
          icon={close}
          color={theme.icon}
          isTouchable={true}
          handlePressIcon={handleClose}
          containerStyle={{ alignSelf: "flex-end" }}
        />
        <ThemedText style={styles.modalTitle}>
          {isEditMode ? "Edit task" : "Create a new task"}
        </ThemedText>

        <View>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            placeholder="Task Description"
            style={[
              styles.inputContainer,
              { color: theme.text, borderColor: theme.textSubtle },
            ]}
            value={newTask.description}
            placeholderTextColor={theme.textSubtle}
            onChangeText={handleChangeText}
          />
          <View style={{ height: 25 }}>
            {isError && (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <StaticIcon size={16} icon={error} color={theme.error} />
                <ThemedText type={"errorMessage"}>
                  Description cannot be empty.
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 3 }}>
            <ThemedText style={styles.label}>Date</ThemedText>
            <TouchableOpacity
              style={[styles.inputContainer, { borderColor: theme.textSubtle }]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={1}
            >
              <TextInput
                style={[styles.inputDateTime, { color: theme.text }]}
                value={newTask.due_at?.toDateString()}
                editable={false}
                pointerEvents="none"
              />
              <StaticIcon size={16} icon={calendar} color={theme.icon} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 2 }}>
            <ThemedText style={styles.label}>Time</ThemedText>
            <TouchableOpacity
              style={[styles.inputContainer, { borderColor: theme.textSubtle }]}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={1}
            >
              <TextInput
                style={[styles.inputDateTime, { color: theme.text }]}
                value={newTask.due_at?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                editable={false}
                pointerEvents="none"
              />
              <StaticIcon size={16} icon={clock} color={theme.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.switchContainer}>
          <ThemedText>Flagged:</ThemedText>
          <Switch
            value={newTask.is_flagged}
            trackColor={{ true: theme.flagged }}
            onValueChange={(value) =>
              setNewTask((prevTask) => ({ ...prevTask, is_flagged: value }))
            }
          />
        </View>

        {showDatePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={newTask.due_at || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => onDateTimeChange(event, date, true)}
          />
        )}

        {showTimePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={newTask.due_at || new Date()}
            mode="time"
            display="default"
            onChange={(event, date) => onDateTimeChange(event, date, false)}
          />
        )}

        {showDatePicker && Platform.OS === "ios" && (
          <Modal transparent={true}>
            <View style={[styles.pickerModal]}>
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => handleDateTimePickerIosClose(false, true)}
              />
              <View
                style={[
                  styles.pickerContainer,
                  { backgroundColor: theme.background },
                ]}
              >
                <StaticIcon
                  size={32}
                  icon={close}
                  color={theme.icon}
                  isTouchable={true}
                  handlePressIcon={() =>
                    handleDateTimePickerIosClose(false, true)
                  }
                  containerStyle={{ alignSelf: "flex-end" }}
                />
                <DateTimePicker
                  value={newTask.due_at || new Date()}
                  mode="date"
                  textColor={theme.text}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, date) =>
                    onDateTimeChange(event, date, true)
                  }
                />
                <ThemedButton
                  title={"Done"}
                  handlePress={() => handleDateTimePickerIosClose(true, true)}
                  customContainerStyles={[
                    styles.buttonDateTimeContainer,
                    {
                      borderColor: theme.backgroundNotable,
                      backgroundColor: theme.backgroundNotable,
                    },
                  ]}
                  customTextStyles={{
                    color: theme.buttonNotableText,
                  }}
                ></ThemedButton>
              </View>
            </View>
          </Modal>
        )}

        {showTimePicker && Platform.OS === "ios" && (
          <Modal transparent={true}>
            <View style={[styles.pickerModal]}>
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => handleDateTimePickerIosClose(false, false)}
              />
              <View
                style={[
                  styles.pickerContainer,
                  { backgroundColor: theme.background },
                ]}
              >
                <StaticIcon
                  size={32}
                  icon={close}
                  color={theme.icon}
                  isTouchable={true}
                  handlePressIcon={() =>
                    handleDateTimePickerIosClose(false, false)
                  }
                  containerStyle={{ alignSelf: "flex-end" }}
                />
                <DateTimePicker
                  value={newTask.due_at || new Date()}
                  mode="time"
                  display="spinner"
                  textColor={theme.text}
                  onChange={(event, date) =>
                    onDateTimeChange(event, date, false)
                  }
                />
                <ThemedButton
                  title={"Done"}
                  handlePress={() => handleDateTimePickerIosClose(true, false)}
                  customContainerStyles={[
                    styles.buttonDateTimeContainer,
                    {
                      borderColor: theme.backgroundNotable,
                      backgroundColor: theme.backgroundNotable,
                    },
                  ]}
                  customTextStyles={{
                    color: theme.buttonNotableText,
                  }}
                ></ThemedButton>
              </View>
            </View>
          </Modal>
        )}

        <View style={styles.buttonRow}>
          <ThemedButton
            title={"Cancel"}
            handlePress={handleClose}
            customContainerStyles={[
              styles.buttonContainer,
              {
                borderColor: theme.backgroundNotable,
                backgroundColor: theme.backgroundNotable,
              },
            ]}
            customTextStyles={{
              color: theme.buttonNotableText,
            }}
          ></ThemedButton>
          <ThemedButton
            title={isEditMode ? "Save" : "Add Task"}
            handlePress={checkAddEditTask}
            customContainerStyles={[
              styles.buttonContainer,
              {
                borderColor: theme.backgroundNotable,
                backgroundColor: theme.backgroundNotable,
              },
            ]}
            customTextStyles={{
              color: theme.buttonNotableText,
            }}
          ></ThemedButton>
        </View>
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
    width: "90%",
    padding: 20,
    borderRadius: 8,
    gap: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputDateTime: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 12,
  },
  buttonContainer: {
    flex: 1,
  },
  buttonDateTimeContainer: {
    width: "50%",
  },
  pickerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  pickerContainer: {
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
});

export default CreateEditTask;
