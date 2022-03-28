import {useEffect, useState} from 'react';
import {TodoItem} from '../models/lists';
import {ITodoItemBlock} from './TodoItemBlock';
import {getAPIAuthToken} from '../auth/msal';
import {useMsal} from '@azure/msal-react';
import {completeTodoItem, createNewTodoItem, fetchItemsForList} from '../api/apiFuncs';

export interface ITodoItemsPanelProps {
    listName: string;
    onSetLoading: (isLoading: boolean) => void;
}

enum FilterMode {
    Outstanding,
    Done,
    All
}


export function TodoItemsPanel({listName, onSetLoading}: ITodoItemsPanelProps) {

    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [filter, setFilter] = useState(FilterMode.Outstanding);
    const [newError, setNewError] = useState<string>('');
    const [itemTitle, setNewItemTitle] = useState<string>('');
    const context = useMsal();

    useEffect(() => getTodoItems(),
        [listName]);

    const getTodoItems = () => {
        if(listName === null || undefined || '') {
            return;
        }
        
        onSetLoading(true);
        getAPIAuthToken(context)
            .then((t: any) => {
                fetchItemsForList(listName, t)
                    .then((r) => {
                        onSetLoading(false);
                        if (r.data) {
                            setTodoItems(r.data);
                        }
                    });
            });
    };

    const getFilteredTodos = () => {
        switch (filter) {
            case FilterMode.Outstanding:
                return todoItems.filter(ti => !ti.isComplete);
            case FilterMode.Done:
                return todoItems.filter(ti => ti.isComplete);
            case FilterMode.All:
                return todoItems;
        }
    };

    const completeTodo = (item: TodoItem) => {
        onSetLoading(true);
        getAPIAuthToken(context)
            .then((t: any) => {
                completeTodoItem(listName, item.id, t)
                    .then((r) => {
                        onSetLoading(false);
                        if (r !== null) {
                            setNewError(r);
                        } else {
                            setNewItemTitle('');
                            getTodoItems();
                        }
                    });
            });
    };

    const newTodo = () => {
        if (itemTitle === undefined || itemTitle === null || itemTitle === '') {
            setNewError('You must provide a title');
        }
        setNewError('');
        onSetLoading(true);
        getAPIAuthToken(context)
            .then((t: any) => {
                createNewTodoItem(itemTitle, listName, t)
                    .then((r) => {
                        onSetLoading(false);
                        if (r !== null) {
                            setNewError(r);
                        } else {
                            setNewItemTitle('');
                            getTodoItems();
                        }
                    });
            });
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
            <ITodoItemBlock item={ti} onComplete={completeTodo}/>);
    };

    const fieldError = newError !== ''
        ? <div className="field">
            <p className="help is-danger">{newError} </p>
        </div>
        : <div/>;

    return (
        <nav className="panel">
            <p className="panel-heading">
                {listName}
            </p>
            <div className="panel-block is-block">
                <div className="field has-addons w-100 mb-0">
                    <p className="control is-flex-grow-1 has-icons-left">
                        <input
                            value={itemTitle}
                            onChange={(e) => setNewItemTitle(e.currentTarget.value)}
                            className="input"
                            type="text"
                            placeholder="New Todo Item"/>

                        <span className="icon is-left">
                <i className="fas fa-pencil" aria-hidden="true"/>
                </span>
                    </p>
                    <p className="control">
                        <button onClick={newTodo}
                                className="button is-light">
                            Create
                        </button>
                    </p>
                </div>
                {fieldError}
            </div>
            <p className="panel-tabs">
                <a
                    onClick={() => setFilter(FilterMode.Outstanding)}
                    className={filter === FilterMode.Outstanding ? 'is-active' : ''}>Outstanding</a>
                <a
                    onClick={() => setFilter(FilterMode.Done)}
                    className={filter === FilterMode.Done ? 'is-active' : ''}>Done</a>
                <a
                    onClick={() => setFilter(FilterMode.All)}
                    className={filter === FilterMode.All ? 'is-active' : ''}>All</a>
            </p>
            {todoBlocks()}
        </nav>

    );
}
