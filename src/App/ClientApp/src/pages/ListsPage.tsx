import {useEffect, useState} from 'react';
import {fetchListSummaries} from '../api/apiFuncs';
import {ListsTabs} from '../components/ListsTabs';
import {ListSummary} from '../models/lists';

const initSummaries: ListSummary[] = [];

export function ListsPage() {

    const [summaries, setSummaries] = useState(initSummaries);
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTitleChanged = (ls: ListSummary) => {
        setTitle(ls.name)
    }

    useEffect(() => {
        setLoading(true);
        fetchListSummaries().then(r => {
            if (r.data) {
                const title = r.data.length > 0
                    ? r.data[0].name
                    : 'No lists'
                setTitle(title);
                setSummaries(r.data);
            }
            setLoading(false);
        })
    }, [setSummaries, setLoading])

    const loadingIndicator = loading
        ? <div className='py-2'>
            Loading your lists ...
            <progress className="progress is-small is-primary" max="100">15%</progress>
        </div>
        : <div/>


    return (
        <div className='container is-fluid'>
            <section className="hero">
                <div className="hero-body pl-0">
                    <p className="title">
                        Lists
                    </p>
                    <p className="subtitle">
                        Your lists are presented below.
                    </p>
                </div>
            </section>
            {loadingIndicator}
            <ListsTabs onTabSelected={handleTitleChanged} summaries={summaries}/>
            <div>{title}</div>
        </div>
    );
}
