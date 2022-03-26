import axios from "axios"
import { ListSummary } from "../models/lists"

export interface ApiResult<T> {
    data?: T
    error?: string
}

export interface ListSummaryResult extends ApiResult<ListSummary[]> { }

export const fetchListSummaries = async (): Promise<ListSummaryResult> => {
    try {
        return await fetchListSummariesFromApi();
    } catch (error) {
        return {
            error: 'failed to get lists'
        }
    }

}

const fetchListSummariesFromApi = async (): Promise<ListSummaryResult> => {

    const re = await axios.get<ListSummary[]>('api/lists')

    return {
        data: re.data
    }
}