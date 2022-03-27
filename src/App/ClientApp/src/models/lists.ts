export interface ListSummary {
    name: string
    createdAt: Date
}

export interface List {
    name: string
    createdAt: Date
    items: TodoItem[]
}

export interface TodoItem {
    id: string;
    title: string;
    createdAt: string;
    completedAt?: string;
    isComplete: boolean;
}