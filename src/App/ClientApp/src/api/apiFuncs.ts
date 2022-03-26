import axios from "axios"
import {ListSummary} from "../models/lists"

export interface ApiResult<T> {
    data?: T
    error?: string
}

export interface ListSummaryResult extends ApiResult<ListSummary[]> { }

export const fetchListSummaries = async (): Promise<ListSummaryResult> => {

    const get = async (): Promise<ListSummaryResult> => {

        const re = await axios.get<ListSummary[]>('api/lists')

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

