export enum TaskStatus {
    PENDING = '0',
    IN_PROGRESS = '1',
    COMPLETED = '2',
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    dueDate?: Date;
}