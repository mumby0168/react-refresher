import axios from "axios"
import {ListSummary} from "../models/lists"

export interface ApiResult<T> {
    data?: T
    error?: string
}


export interface ListSummaryResult extends ApiResult<ListSummary[]> { }

export const fetchListSummaries = async (token: string): Promise<ListSummaryResult> => {

    const get = async (): Promise<ListSummaryResult> => {

        console.log(token);
        const re = await axios.get<ListSummary[]>('api/lists', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return {
            data: re.data
        }
    }

    try {
        return await get();
    } catch (error) {
        console.log(error);
        return {
            error: 'failed to get lists'
        }
    }
}

export const createNewList = async (name: string, token: string): Promise<string | null> => {

    const post = async (): Promise<string | null> => {

        console.log(token);
        const re = await axios.post(`api/lists?name=${name}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (re.status === 200) {
            return null;
        } else if (re.status === 400) {
            return re.data.error;
        }

        return 'failed to create list';
    }

    try {
        return await post();
    } catch (error) {
        console.log(error);
        return 'failed to create list'

    }
}

