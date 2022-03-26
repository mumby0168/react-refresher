import {useEffect, useState} from 'react';
import {fetchListSummaries} from '../api/apiFuncs';
import {ListsTabs} from '../components/ListsTabs';
import {ListSummary} from '../models/lists';
import {ListForm} from '../components/ListForm';
import {ProtectedPage} from '../components/ProtectedPage';
import {getAPIAuthToken} from '../auth/msal';
import {useMsal} from '@azure/msal-react';
import './ListPage.css';
import {TodoItemsPanel} from '../components/TodoItemsPanel';

const initSummaries: ListSummary[] = [];

export function ListsPage() {

    const [summaries, setSummaries] = useState(initSummaries);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const context = useMsal();

    const handleTitleChanged = (ls: ListSummary) => {
        setTitle(ls.name);
    };

    const loadLists = () => {
        setLoading(true);
        getAPIAuthToken(context).then((t: any) => {
            fetchListSummaries(t).then(r => {
                if (r.data) {
                    const title = r.data.length > 0
                        ? r.data[0].name
                        : 'No lists';
                    setTitle(title);
                    setSummaries(r.data);
                }
                setLoading(false);
            });
        });
    };

    useEffect(() => {
        loadLists();
    }, []);

    const loadingIndicatorClassName = loading
        ? 'py-2 is-animated-display'
        : 'py-2 is-hidden is-animated-display';


    return (
        <ProtectedPage>
            <div className="container is-fluid">
                <div className="pt-5">
                    <ListForm onListCreated={() => loadLists()}/>
                </div>
                <div className={loadingIndicatorClassName}>
                    Loading your lists ...
                    <progress className="progress is-small is-primary" max="100">15%</progress>
                </div>
                <hr/>
                <ListsTabs onTabSelected={handleTitleChanged} summaries={summaries}/>
                <TodoItemsPanel listName={title}/>
            </div>
        </ProtectedPage>
    );
}
