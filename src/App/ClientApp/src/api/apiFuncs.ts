import axios from 'axios';
import {ListSummary, TodoItem} from '../models/lists';

export interface ApiResult<T> {
    data?: T;
    error?: string;
}


export interface ListSummaryResult extends ApiResult<ListSummary[]> {
}

export interface TodoItemsResults extends ApiResult<TodoItem[]> {
}

export const fetchListSummaries = async (token: string): Promise<ListSummaryResult> => {

    const get = async (): Promise<ListSummaryResult> => {
        const re = await axios.get<ListSummary[]>('api/lists', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return {
            data: re.data
        };
    };

    try {
        return await get();
    } catch (error) {
        console.log(error);
        return {
            error: 'failed to get lists'
        };
    }
};

export const fetchItemsForList = async (listName: string, token: string): Promise<TodoItemsResults> => {

    console.log(listName);

    const get = async (): Promise<TodoItemsResults> => {
        const re = await axios.get<TodoItem[]>(`api/lists/${listName}/items`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(re);

        return {
            data: re.data
        };
    };

    if (listName.length < 1) {
        return {
            error: 'no list name provided'
        };
    }

    try {
        return await get();
    } catch (error) {
        console.log(error);
        return {
            error: 'failed to get lists'
        };
    }
};

export const createNewList = async (name: string, token: string): Promise<string | null> => {

    const post = async (): Promise<string | null> => {
        const re = await axios.post(`api/lists?name=${name}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (re.status === 200) {
            return null;
        } else if (re.status === 400) {
            return re.data.error;
        }

        return 'failed to create list';
    };

    try {
        return await post();
    } catch (error) {
        console.log(error);
        return 'failed to create list';

    }
};

export const completeTodoItem = async (
    listName: string,
    itemId: string,
    token: string): Promise<string | null> => {

    const post = async (): Promise<string | null> => {

        console.log(token);
        const re = await axios.put(`api/lists/${listName}/items/${itemId}/complete`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (re.status === 200) {
            return null;
        } else if (re.status === 400) {
            return re.data.error;
        }

        return 'failed to create list';
    };

    try {
        return await post();
    } catch (error) {
        console.log(error);
        return 'failed to create list';

    }
};

export const createNewTodoItem = async (
    title: string,
    listName: string,
    token: string):
    Promise<string | null> => {

    const post = async (): Promise<string | null> => {

        console.log(token);
        const re = await axios.post(`api/lists/${listName}/items?title=${title}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (re.status === 200) {
            return null;
        } else if (re.status === 400) {
            return re.data.error;
        }

        return 'failed to create item';
    };

    try {
        return await post();
    } catch (error) {
        console.log(error);
        return 'failed to create item';

    }
};

