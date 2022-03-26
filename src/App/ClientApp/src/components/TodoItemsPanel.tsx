import {useState} from 'react';
import {TodoItem} from '../models/lists';
import {ITodoItemBlock} from './TodoItemBlock';

export interface ITodoItemsPanelProps {
    listName: string;
}

enum FilterMode {
    Outstanding,
    Done,
    All
}

const init: TodoItem[] = [
    {
        title: 'Item 1',
        completedAt: undefined,
        createdAt: new Date()
    },
    {
        title: 'Item 2',
        completedAt: undefined,
        createdAt: new Date()
    },
    {
        title: 'Item 3',
        completedAt: undefined,
        createdAt: new Date()
    }
];


export function TodoItemsPanel({listName}: ITodoItemsPanelProps) {

    const [todoItems, setTodoItems] = useState<TodoItem[]>(init);
    const [filter, setFilter] = useState(FilterMode.Outstanding);

    const getFilteredTodos = () => {
        switch (filter) {
            case FilterMode.Outstanding:
                return todoItems.filter(ti => ti.completedAt === undefined);
            case FilterMode.Done:
                return todoItems.filter(ti => ti.completedAt !== undefined);
            case FilterMode.All:
                return todoItems;
        }
    };

    const todoBlocks = () => {

        const todos = getFilteredTodos();

        if (todos.length < 1) {
            return <div className="panel-block">
                <i className="fa fa-times mr-2"/>
                No todo items
            </div>;
        }

        return todos.map(ti =>
            <ITodoItemBlock item={ti}/>);
    };

    return (
        <nav className="panel">
            <p className="panel-heading">
                {listName}
            </p>
            <div className="panel-block">
                <p className="control has-icons-left">
                    <input className="input" type="text" placeholder="Search"/>
                    <span className="icon is-left">
                    <i className="fas fa-search" aria-hidden="true"/>
                  </span>
                </p>
            </div>
            <p className="panel-tabs">
                <a className="is-active">Outstanding</a>
                <a>Done</a>
                <a>All</a>
            </p>
            {todoBlocks()}
        </nav>

    );
}
