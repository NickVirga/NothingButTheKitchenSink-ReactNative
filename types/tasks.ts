export interface TaskType {
  id: string;
  description: string;
  is_flagged: boolean;
  is_complete: boolean;
  due_at: string;
}

export interface NewTaskType {
  description: string | undefined;
  is_flagged: boolean;
  due_at: Date | undefined;
}

export interface TasksResponse {
  message: string;
  tasks: TaskType[];
}

export interface TaskResponse {
  message: string;
  task: TaskType;
}
