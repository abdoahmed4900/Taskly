export interface Epic {
  title?: string;
  description?: string;
  assigneeId?: string;
  projectId?: string;
  deadline?: string;
  id?: string;
  createdBy?: CreatedBy;
  assignee?: Assignee;
  createdAt?: string;
}

export interface CreatedBy {
  sub: string;
  name: string;
  email: string;
  department: string;
}

export interface Assignee {
  sub: string;
  name: string;
  email: string;
  department: string;
}
