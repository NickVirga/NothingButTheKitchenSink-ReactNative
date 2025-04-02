export interface TaskType {
  id: string;
  description: string;
  is_flagged: boolean;
  is_complete: boolean;
  due_at: string;
  completed_at?: string;
}

export interface NewTaskType {
  description?: string;
  is_flagged: boolean;
  due_at?: Date;
}

export interface TasksResponse {
  message: string;
  tasks: TaskType[];
}

export interface TaskResponse {
  message: string;
  task: TaskType;
}
