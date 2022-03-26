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
        return {
            error: 'failed to get lists'
        }
    }
}

