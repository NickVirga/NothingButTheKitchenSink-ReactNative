export interface UserType {
  id: string;
  name: string;
  lastTasksCompletedData: string;
}

export interface UserResponse {
  messager: string;
  user: UserType;
}
