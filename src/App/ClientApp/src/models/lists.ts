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
    title: string
    createdAt: Date
    completedAt?: Date
}